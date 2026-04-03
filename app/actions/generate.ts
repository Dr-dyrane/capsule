'use server'

import { cookies } from 'next/headers'

import { queueCardForRetry, syncGenerationRunState } from '@/lib/generation/card-worker'
import { registerGenerationSession } from '@/lib/generation/run-manager'
import { routePromptProfile } from '@/lib/ai/prompt-router'
import { createClient } from '@/lib/supabase/server'
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

async function ensureGenerationArtifacts(sessionId: string) {
  const supabase = await createClient()

  const [{ data: session, error: sessionError }, { data: points, error: pointsError }, { data: existingCards }, { data: existingJobs }] =
    await Promise.all([
      supabase.from('sessions').select('id, user_id').eq('id', sessionId).single(),
      supabase.from('points').select('*').eq('session_id', sessionId).order('sort_order', { ascending: true }),
      supabase.from('cards').select('*').eq('session_id', sessionId),
      supabase.from('card_jobs').select('card_id').eq('session_id', sessionId),
    ])

  if (sessionError) throw sessionError
  if (pointsError) throw pointsError

  const typedPoints = (points ?? []) as PointRecord[]
  const typedExistingCards = (existingCards ?? []) as CardRecord[]
  const cardByPointId = new Map(typedExistingCards.map((card) => [card.point_id, card]))
  const placeholderCards = typedPoints
    .filter((point) => !cardByPointId.has(point.id))
    .map((point) => buildPlaceholderCard(point, sessionId, session.user_id))

  if (placeholderCards.length > 0) {
    const { error: cardsError } = await supabase.from('cards').insert(placeholderCards)
    if (cardsError) throw cardsError
    for (const card of placeholderCards) {
      cardByPointId.set(card.point_id, card)
    }
  }

  const jobCardIds = new Set((existingJobs ?? []).map((job) => job.card_id))
  const jobsToCreate = typedPoints
    .map((point) => {
      const card = cardByPointId.get(point.id)
      if (!card || jobCardIds.has(card.id)) {
        return null
      }

      const route = routePromptProfile(point.text, point.category, point.concept)

      return {
        session_id: sessionId,
        card_id: card.id,
        point_id: point.id,
        user_id: session.user_id,
        status: 'queued',
        planner_mode: route.plannerMode,
        attempt_count: 0,
      }
    })
    .filter(Boolean)

  if (jobsToCreate.length > 0) {
    const { error: jobsError } = await supabase.from('card_jobs').insert(jobsToCreate)
    if (jobsError) throw jobsError
  }

  const { error: runError } = await supabase.from('generation_runs').upsert(
    {
      session_id: sessionId,
      user_id: session.user_id,
      status: 'queued',
      total_cards: typedPoints.length,
    },
    { onConflict: 'session_id' },
  )

  if (runError) throw runError

  await syncGenerationRunState(supabase, sessionId)
  return { session, points: typedPoints }
}

export async function ensureCardPlaceholders(sessionId: string) {
  await ensureGenerationArtifacts(sessionId)
  return { success: true }
}

export async function generateCard(pointId: string, existingCardId?: string) {
  const supabase = await createClient()
  const cookieSnapshot = (await cookies()).getAll().map(({ name, value }) => ({ name, value }))

  const { data: point, error: pointError } = await supabase
    .from('points')
    .select('id, session_id')
    .eq('id', pointId)
    .single()

  if (pointError) throw pointError

  await ensureGenerationArtifacts(point.session_id)

  let cardId = existingCardId

  if (!cardId) {
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select('id')
      .eq('point_id', pointId)
      .single()

    if (cardError) throw cardError
    cardId = card.id
  }

  if (!cardId) {
    throw new Error('Card not found')
  }

  await queueCardForRetry(supabase, cardId)
  registerGenerationSession(point.session_id, cookieSnapshot)

  return { success: true, cardId }
}

export async function generateSessionCards(sessionId: string) {
  const cookieSnapshot = (await cookies()).getAll().map(({ name, value }) => ({ name, value }))
  await ensureGenerationArtifacts(sessionId)
  registerGenerationSession(sessionId, cookieSnapshot)
  return { success: true }
}
