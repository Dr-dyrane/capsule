'use server'

import { createClient } from '@/lib/supabase/server'
import { extractPointsFromImage } from '@/lib/ai/ocr'
import { createSignedObjectUrl } from '@/lib/storage/signed-urls'

function getCardTitle(text: string) {
  const title = text.split(':')[0]?.trim()
  return title || 'Learning card'
}

export async function processNote(sessionId: string) {
  const supabase = await createClient()

  // 1. Get Session
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .update({ status: 'processing' })
    .eq('id', sessionId)
    .select()
    .single()

  if (sessionError) throw sessionError

  // 2. Create a short-lived signed URL for OCR instead of exposing the note publicly.
  const signedUrl = await createSignedObjectUrl('notes', session.source_url, 60 * 10)

  // 3. Extract Points
  try {
    const result = await extractPointsFromImage(signedUrl)
    const points = result.points ?? []

    if (points.length === 0) {
      throw new Error('No teaching points were extracted from the page.')
    }

    // 4. Save Points to DB
    const pointsToInsert = points.map((p, index) => ({
      session_id: sessionId,
      text: p.text,
      category: p.category,
      concept: p.concept,
      sort_order: index,
      card_count: p.card_count,
    }))

    const { data: insertedPoints, error: pointsError } = await supabase
      .from('points')
      .insert(pointsToInsert)
      .select('id, text, sort_order')

    if (pointsError) throw pointsError

    const queuedCards = (insertedPoints ?? []).map((point) => {
      const cardId = crypto.randomUUID()

      return {
        id: cardId,
        point_id: point.id,
        session_id: sessionId,
        image_url: `${session.user_id}/${sessionId}/${cardId}.png`,
        title: getCardTitle(point.text),
        status: 'queued',
        card_order: point.sort_order ?? 0,
      }
    })

    const { error: cardsError } = await supabase.from('cards').insert(queuedCards)

    if (cardsError) throw cardsError

    // 5. Update Session
    await supabase
      .from('sessions')
      .update({
        status: 'generating',
        point_count: points.length,
        session_context: result.session_context,
      })
      .eq('id', sessionId)

    return { success: true, count: points.length }
  } catch (error) {
    console.error(error)
    await supabase
      .from('sessions')
      .update({ status: 'error' })
      .eq('id', sessionId)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Processing failed',
    }
  }
}

export async function restartSession(sessionId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single()

  if (sessionError || !session) {
    throw new Error('Session not found')
  }

  await supabase.from('cards').delete().eq('session_id', sessionId)
  await supabase.from('points').delete().eq('session_id', sessionId)

  const { error: updateError } = await supabase
    .from('sessions')
    .update({
      status: 'processing',
      point_count: 0,
      card_count: 0,
    })
    .eq('id', sessionId)

  if (updateError) {
    throw updateError
  }

  return { success: true }
}
