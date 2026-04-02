'use server'

import { createClient } from '@/lib/supabase/server'
import { generateCardImage } from '@/lib/ai/generate'
import type { CardRecord, PointRecord } from '@/lib/types'

function getCardTitle(text: string) {
  const title = text.split(':')[0]?.trim()
  return title || 'Learning card'
}

function buildPlaceholderCard(point: PointRecord, sessionId: string, userId: string): CardRecord {
  const cardId = crypto.randomUUID()

  return {
    id: cardId,
    point_id: point.id,
    session_id: sessionId,
    image_url: `${userId}/${sessionId}/${cardId}.png`,
    title: getCardTitle(point.text),
    status: 'queued',
    card_order: point.sort_order ?? 1,
  }
}

async function finalizeSessionProgress(supabase: Awaited<ReturnType<typeof createClient>>, sessionId: string) {
  const { count } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)
    .eq('status', 'complete')

  await supabase
    .from('sessions')
    .update({
      card_count: count ?? 0,
    })
    .eq('id', sessionId)

  return count ?? 0
}

async function syncSessionState(supabase: Awaited<ReturnType<typeof createClient>>, sessionId: string) {
  const completeCount = await finalizeSessionProgress(supabase, sessionId)

  const { count: unfinishedCount } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)
    .in('status', ['queued', 'generating'])

  await supabase
    .from('sessions')
    .update({
      status: (unfinishedCount ?? 0) === 0 ? 'complete' : 'generating',
      card_count: completeCount,
    })
    .eq('id', sessionId)

  return {
    completeCount,
    unfinishedCount: unfinishedCount ?? 0,
  }
}

export async function generateCard(pointId: string, existingCardId?: string) {
  const supabase = await createClient()

  const { data: point, error: pointError } = await supabase
    .from('points')
    .select('*, sessions(user_id, session_context)')
    .eq('id', pointId)
    .single()

  if (pointError) throw pointError

  const sessionId = point.session_id
  const userId = point.sessions.user_id

  if (!existingCardId) {
    const { data: existingCard } = await supabase
      .from('cards')
      .select('id')
      .eq('point_id', pointId)
      .maybeSingle()

    existingCardId = existingCard?.id
  }

  let cardId = existingCardId ?? crypto.randomUUID()
  let filePath = `${userId}/${sessionId}/${cardId}.png`

  if (existingCardId) {
    const { data: existingCard, error: existingCardError } = await supabase
      .from('cards')
      .select('id, image_url')
      .eq('id', existingCardId)
      .single()

    if (existingCardError) throw existingCardError

    cardId = existingCard.id
    filePath = existingCard.image_url

    const { error: queueError } = await supabase
      .from('cards')
      .update({
        title: getCardTitle(point.text),
        status: 'generating',
        card_order: point.sort_order ?? 1,
      })
      .eq('id', cardId)

    if (queueError) throw queueError
  } else {
    const { error: placeholderError } = await supabase
      .from('cards')
      .insert({
        id: cardId,
        point_id: pointId,
        session_id: sessionId,
        image_url: filePath,
        title: getCardTitle(point.text),
        status: 'generating',
        card_order: point.sort_order ?? 1,
      })

    if (placeholderError) throw placeholderError
  }

  try {
    const imageUrl = await generateCardImage(
      point.text,
      point.category,
      point.sessions.session_context || ''
    )

    const imageRes = await fetch(imageUrl)
    if (!imageRes.ok) {
      throw new Error(`Failed to fetch generated image: ${imageRes.status}`)
    }

    const imageBlob = await imageRes.blob()

    const { error: uploadError } = await supabase.storage.from('cards').upload(filePath, imageBlob, {
      contentType: 'image/png',
      upsert: true,
    })

    if (uploadError) throw uploadError

    const { data: card, error: cardError } = await supabase
      .from('cards')
      .update({
        image_url: filePath,
        status: 'complete',
      })
      .eq('id', cardId)
      .select()
      .single()

    if (cardError) throw cardError

    await syncSessionState(supabase, sessionId)

    return card
  } catch (error) {
    console.error(error)
    await supabase
      .from('cards')
      .update({ status: 'error' })
      .eq('id', cardId)

    await syncSessionState(supabase, sessionId)

    throw error
  }
}

export async function generateSessionCards(sessionId: string) {
  const supabase = await createClient()

  const [{ data: session, error: sessionError }, { data: points, error: pointsError }, { data: existingCards }] =
    await Promise.all([
      supabase.from('sessions').select('id, user_id').eq('id', sessionId).single(),
      supabase.from('points').select('*').eq('session_id', sessionId).order('sort_order', { ascending: true }),
      supabase.from('cards').select('*').eq('session_id', sessionId).order('card_order', { ascending: true }),
    ])

  if (sessionError) throw sessionError
  if (pointsError) throw pointsError

  const typedPoints = (points ?? []) as PointRecord[]
  const typedExistingCards = (existingCards ?? []) as CardRecord[]

  const cardsByPointId = new Map(typedExistingCards.map((card) => [card.point_id, card]))
  const missingPoints = typedPoints.filter((point) => !cardsByPointId.has(point.id))

  if (missingPoints.length > 0) {
    const placeholderCards = missingPoints.map((point) => buildPlaceholderCard(point, sessionId, session.user_id))

    const { data: insertedCards, error: insertError } = await supabase.from('cards').insert(placeholderCards).select()
    if (insertError) throw insertError

    for (const card of (insertedCards ?? []) as CardRecord[]) {
      cardsByPointId.set(card.point_id, card)
    }
  }

  let hadFailure = false

  for (const point of typedPoints) {
    const card = cardsByPointId.get(point.id)

    if (!card) continue
    if (card.status === 'complete') continue

    try {
      await generateCard(point.id, card.id)
    } catch (error) {
      hadFailure = true
      console.error(error)
    }
  }

  const { completeCount } = await syncSessionState(supabase, sessionId)

  return {
    success: !hadFailure,
    count: completeCount,
    error: hadFailure ? 'One or more cards could not finish.' : undefined,
  }
}
