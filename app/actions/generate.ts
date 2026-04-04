'use server'

import { cookies } from 'next/headers'

import { recordGenerationCosts } from '@/lib/ai/cost-ledger'
import { resolveGenerationStrategy } from '@/lib/ai/strategy'
import {
  consumeGenerationCredit,
  getRequiredCreditKind,
  refundGenerationCredit,
  syncCurrentUserDirectory,
} from '@/lib/billing/entitlements'
import { findCommunityMatchesForPoints } from '@/lib/community/match'
import { isCommunitySchemaError } from '@/lib/community/schema'
import { queueCardForRetry, syncGenerationRunState } from '@/lib/generation/card-worker'
import { planNotePoints } from '@/lib/generation/note-planner'
import { registerGenerationSession } from '@/lib/generation/run-manager'
import { ensureReviewItemExists } from '@/lib/review/queue'
import { createSignedObjectUrlsSafe } from '@/lib/storage/signed-urls'
import { createPublicClient } from '@/lib/supabase/public'
import { createClient } from '@/lib/supabase/server'
import type {
  CardRecord,
  CommunityMatchRecord,
  GenerationGate,
  NoteRole,
  PointRecord,
  SessionRecommendationRecord,
  SessionRecord,
} from '@/lib/types'

type SessionShape = Pick<SessionRecord, 'id' | 'user_id' | 'visibility'>

type GenerateCardMode = 'default' | 'premium' | 'remix'

function getCardTitle(text: string) {
  const title = text.split(':')[0]?.trim()
  return title || 'Learning card'
}

function getGenerationGate(role: NoteRole, topMatchCardId: string | null): GenerationGate {
  if (role === 'hero') {
    return 'automatic'
  }

  if (role === 'support' && topMatchCardId) {
    return 'community-first'
  }

  return 'manual'
}

function buildPlaceholderCard(
  point: PointRecord,
  session: SessionShape,
  role: NoteRole,
  topMatch: CommunityMatchRecord | null,
): CardRecord {
  const cardId = crypto.randomUUID()

  return {
    id: cardId,
    point_id: point.id,
    session_id: session.id,
    image_url: `${session.user_id}/${session.id}/${cardId}.png`,
    title: getCardTitle(point.text),
    status: 'queued',
    card_order: point.sort_order ?? 0,
    generation_gate: getGenerationGate(role, topMatch?.card_id ?? null),
    community_match_card_id: topMatch?.card_id ?? null,
    community_match_score: topMatch?.score ?? null,
    visibility: session.visibility === 'published' ? 'published' : 'private',
  }
}

async function updatePointRoles(
  supabase: Awaited<ReturnType<typeof createClient>>,
  points: PointRecord[],
  rolesByPointId: Map<string, NoteRole>,
) {
  const updates = points
    .filter((point) => (point.note_role ?? 'support') !== (rolesByPointId.get(point.id) ?? 'support'))
    .map((point) =>
      supabase
        .from('points')
        .update({ note_role: rolesByPointId.get(point.id) ?? 'support' })
        .eq('id', point.id),
    )

  if (updates.length === 0) {
    return
  }

  const results = await Promise.all(updates)
  const failed = results.find((result) => result.error)
  if (failed?.error) {
    throw failed.error
  }
}

async function ensureQueuedJob(
  supabase: Awaited<ReturnType<typeof createClient>>,
  input: {
    sessionId: string
    cardId: string
    point: PointRecord
    userId: string
    referenceCardId?: string | null
    entitlementKind?: 'support' | 'premium' | null
  },
) {
  const strategy = resolveGenerationStrategy(input.point.text, input.point.category, input.point.concept)
  const { data: existingJob, error: existingJobError } = await supabase
    .from('card_jobs')
    .select('id')
    .eq('card_id', input.cardId)
    .maybeSingle()

  if (existingJobError) {
    throw existingJobError
  }

  const payload = {
    session_id: input.sessionId,
    card_id: input.cardId,
    point_id: input.point.id,
    user_id: input.userId,
    planner_mode: strategy.plannerMode,
    reference_card_id: input.referenceCardId ?? null,
    entitlement_kind: input.entitlementKind ?? null,
    entitlement_units: input.entitlementKind ? 1 : 0,
    status: 'queued',
    claimed_at: null,
    finished_at: null,
    last_error: null,
  }

  if (existingJob?.id) {
    const { error } = await supabase
      .from('card_jobs')
      .update(payload)
      .eq('id', existingJob.id)

    if (error) {
      throw error
    }

    return existingJob.id
  }

  const { data: createdJob, error } = await supabase
    .from('card_jobs')
    .insert({
      ...payload,
      attempt_count: 0,
      prompt_version: null,
      model: null,
      cache_key: null,
      prompt_hash: null,
    })
    .select('id')
    .single()

  if (error) {
    throw error
  }

  return createdJob.id
}

async function fetchSessionShape(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sessionId: string,
) {
  const sessionWithVisibility = await supabase
    .from('sessions')
    .select('id, user_id, visibility')
    .eq('id', sessionId)
    .single()

  if (!sessionWithVisibility.error) {
    return sessionWithVisibility.data as SessionShape
  }

  if (!isCommunitySchemaError(sessionWithVisibility.error)) {
    throw sessionWithVisibility.error
  }

  const fallback = await supabase
    .from('sessions')
    .select('id, user_id')
    .eq('id', sessionId)
    .single()

  if (fallback.error) {
    throw fallback.error
  }

  return fallback.data as SessionShape
}

async function ensureGenerationArtifacts(sessionId: string) {
  const supabase = await createClient()
  const session = await fetchSessionShape(supabase, sessionId)

  const [{ data: points, error: pointsError }, { data: existingCards, error: cardsError }, { data: existingJobs, error: jobsError }] =
    await Promise.all([
      supabase.from('points').select('*').eq('session_id', sessionId).order('sort_order', { ascending: true }),
      supabase.from('cards').select('*').eq('session_id', sessionId),
      supabase.from('card_jobs').select('id, card_id').eq('session_id', sessionId),
    ])

  if (pointsError) throw pointsError
  if (cardsError) throw cardsError
  if (jobsError) throw jobsError

  const typedPoints = (points ?? []) as PointRecord[]
  const typedExistingCards = (existingCards ?? []) as CardRecord[]
  const existingJobsByCardId = new Set((existingJobs ?? []).map((job) => job.card_id))

  if (typedPoints.length === 0) {
    return { session, points: typedPoints, cards: typedExistingCards }
  }

  const notePlan = planNotePoints(typedPoints)
  const rolesByPointId = new Map(notePlan.items.map((item) => [item.pointId, item.role]))
  const matchesByPointId = await findCommunityMatchesForPoints(
    typedPoints.filter((point) => (rolesByPointId.get(point.id) ?? 'support') === 'support'),
  )

  await updatePointRoles(supabase, typedPoints, rolesByPointId)

  const cardsByPointId = new Map(typedExistingCards.map((card) => [card.point_id, card]))
  const cardsToInsert: CardRecord[] = []
  const cardUpdates = typedPoints
    .map((point) => {
      const role = rolesByPointId.get(point.id) ?? 'support'
      const topMatch = matchesByPointId.get(point.id)?.[0] ?? null
      const nextGate = getGenerationGate(role, topMatch?.card_id ?? null)
      const existingCard = cardsByPointId.get(point.id)

      if (!existingCard) {
        const placeholder = buildPlaceholderCard(point, session, role, topMatch)
        cardsToInsert.push(placeholder)
        cardsByPointId.set(point.id, placeholder)
        return null
      }

      const preserveGate = existingCard.generation_gate === 'reused' ? 'reused' : nextGate
      const nextVisibility = session.visibility === 'published' ? 'published' : 'private'
      const updatePayload: Partial<CardRecord> = {}

      if ((existingCard.title ?? '') !== getCardTitle(point.text)) {
        updatePayload.title = getCardTitle(point.text)
      }

      if ((existingCard.card_order ?? 0) !== (point.sort_order ?? 0)) {
        updatePayload.card_order = point.sort_order ?? 0
      }

      if ((existingCard.generation_gate ?? 'manual') !== preserveGate) {
        updatePayload.generation_gate = preserveGate
      }

      if ((existingCard.community_match_card_id ?? null) !== (topMatch?.card_id ?? null)) {
        updatePayload.community_match_card_id = topMatch?.card_id ?? null
      }

      if ((existingCard.community_match_score ?? null) !== (topMatch?.score ?? null)) {
        updatePayload.community_match_score = topMatch?.score ?? null
      }

      if ((existingCard.visibility ?? 'private') !== nextVisibility) {
        updatePayload.visibility = nextVisibility
      }

      if (Object.keys(updatePayload).length === 0) {
        return null
      }

      return supabase.from('cards').update(updatePayload).eq('id', existingCard.id)
    })
    .filter(Boolean)

  if (cardsToInsert.length > 0) {
    const { error } = await supabase.from('cards').insert(cardsToInsert)
    if (error) {
      throw error
    }
  }

  if (cardUpdates.length > 0) {
    const results = await Promise.all(cardUpdates)
    const failed = results.find((result) => result?.error)
    if (failed?.error) {
      throw failed.error
    }
  }

  const automaticCards = typedPoints
    .map((point) => {
      const role = rolesByPointId.get(point.id) ?? 'support'
      const topMatch = matchesByPointId.get(point.id)?.[0] ?? null
      const gate = getGenerationGate(role, topMatch?.card_id ?? null)
      const card = cardsByPointId.get(point.id)

      if (!card || gate !== 'automatic' || card.status === 'complete') {
        return null
      }

      return { card, point }
    })
    .filter(Boolean) as Array<{ card: CardRecord; point: PointRecord }>

  for (const { card, point } of automaticCards) {
    if (!existingJobsByCardId.has(card.id)) {
      await ensureQueuedJob(supabase, {
        sessionId,
        cardId: card.id,
        point,
        userId: session.user_id,
      })
      existingJobsByCardId.add(card.id)
    }
  }

  const { error: runError } = await supabase.from('generation_runs').upsert(
    {
      session_id: sessionId,
      user_id: session.user_id,
      status: 'queued',
      total_cards: automaticCards.length,
      completed_cards: 0,
      failed_cards: 0,
      active_card_id: null,
      last_error: null,
    },
    { onConflict: 'session_id' },
  )

  if (runError) {
    throw runError
  }

  await syncGenerationRunState(supabase, sessionId)

  const { data: refreshedCards, error: refreshedCardsError } = await supabase
    .from('cards')
    .select('*')
    .eq('session_id', sessionId)
    .order('card_order', { ascending: true })

  if (refreshedCardsError) {
    throw refreshedCardsError
  }

  return {
    session,
    points: typedPoints.map((point) => ({
      ...point,
      note_role: rolesByPointId.get(point.id) ?? 'support',
    })),
    cards: (refreshedCards ?? []) as CardRecord[],
  }
}

export async function ensureCardPlaceholders(sessionId: string) {
  await ensureGenerationArtifacts(sessionId)
  return { success: true }
}

export async function getSessionRecommendations(sessionId: string): Promise<SessionRecommendationRecord[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const [{ data: session, error: sessionError }, { data: points, error: pointsError }, { data: cards, error: cardsError }] =
    await Promise.all([
      supabase.from('sessions').select('id').eq('id', sessionId).eq('user_id', user.id).single(),
      supabase.from('points').select('*').eq('session_id', sessionId).order('sort_order', { ascending: true }),
      supabase.from('cards').select('point_id, generation_gate, community_match_card_id, community_match_score').eq('session_id', sessionId),
    ])

  if (sessionError || !session) {
    throw new Error('Session not found')
  }

  if (pointsError) throw pointsError
  if (cardsError) throw cardsError

  const typedPoints = (points ?? []) as PointRecord[]
  const cardsByPointId = new Map((cards ?? []).map((card) => [card.point_id, card as Pick<CardRecord, 'point_id' | 'generation_gate' | 'community_match_card_id' | 'community_match_score'>]))

  const matchedCardIds = [...new Set(
    (cards ?? [])
      .map((card) => card.community_match_card_id)
      .filter((value): value is string => typeof value === 'string' && value.length > 0),
  )]

  let matchesByCardId = new Map<string, CommunityMatchRecord>()
  let signedUrls: Record<string, string> = {}

  if (matchedCardIds.length > 0) {
    const publicClient = createPublicClient()
    const { data: matchRows, error } = await publicClient
      .from('community_index')
      .select('card_id, title, image_url, author_name, community_template, category, concept')
      .in('card_id', matchedCardIds)

    if (error) {
      if (!isCommunitySchemaError(error)) {
        throw error
      }
    } else {
      const typedMatches = (matchRows ?? []) as Array<{
        card_id: string
        title: string | null
        image_url: string
        author_name: string | null
        community_template: string | null
        category: string | null
        concept: string | null
      }>

      signedUrls = await createSignedObjectUrlsSafe(
        'cards',
        typedMatches.map((match) => match.image_url),
      )

      matchesByCardId = new Map(
        typedMatches.map((match) => [
          match.card_id,
          {
            ...match,
            score:
              (cards ?? []).find((card) => card.community_match_card_id === match.card_id)?.community_match_score ?? 0,
          },
        ]),
      )
    }
  }

  return typedPoints.map((point) => {
    const card = cardsByPointId.get(point.id)
    const match = card?.community_match_card_id ? matchesByCardId.get(card.community_match_card_id) ?? null : null

    return {
      point_id: point.id,
      role: point.note_role ?? 'support',
      gate: (card?.generation_gate ?? 'manual') as GenerationGate,
      match: match
        ? {
            ...match,
            signed_url: signedUrls[match.image_url] ?? null,
          }
        : null,
    }
  })
}

export async function useCommunityMatch(existingCardId: string, matchedCardId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: card, error: cardError } = await supabase
    .from('cards')
    .select('id, session_id, point_id')
    .eq('id', existingCardId)
    .single()

  if (cardError) throw cardError

  const [{ data: session, error: sessionError }, { data: point, error: pointError }] = await Promise.all([
    supabase
      .from('sessions')
      .select('id, user_id')
      .eq('id', card.session_id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('points')
      .select('id, text')
      .eq('id', card.point_id)
      .single(),
  ])

  if (sessionError || !session) {
    throw new Error('Session not found')
  }

  if (pointError) throw pointError

  const publicClient = createPublicClient()
  const { data: matchedCardRow, error: matchError } = await publicClient
    .from('community_index')
    .select('card_id, image_url, community_template')
    .eq('card_id', matchedCardId)
    .maybeSingle()

  if (matchError) {
    throw matchError
  }

  const matchedCard = matchedCardRow as { card_id: string; image_url: string; community_template: string | null } | null

  if (!matchedCard) {
    throw new Error('Matched community card not found')
  }

  const now = new Date().toISOString()

  const [{ error: updateCardError }, { error: updateJobsError }] = await Promise.all([
    supabase
      .from('cards')
      .update({
        image_url: matchedCard.image_url,
        title: getCardTitle(point.text),
        status: 'complete',
        generation_gate: 'reused',
        reused_from_card_id: matchedCard.card_id,
        render_model: null,
        render_quality: null,
        community_template: matchedCard.community_template ?? null,
      })
      .eq('id', existingCardId),
    supabase
      .from('card_jobs')
      .update({
        status: 'complete',
        reference_card_id: matchedCard.card_id,
        finished_at: now,
        last_error: null,
      })
      .eq('card_id', existingCardId),
  ])

  if (updateCardError) throw updateCardError
  if (updateJobsError) throw updateJobsError

  await ensureReviewItemExists(supabase, {
    userId: session.user_id,
    cardId: existingCardId,
  })

  await recordGenerationCosts(supabase, [
    {
      userId: user.id,
      sessionId: session.id,
      cardId: existingCardId,
      pointId: point.id,
      stage: 'cache_hit',
      model: 'community-reuse',
      estimatedCostUsd: 0,
      metadata: {
        reused_from_card_id: matchedCard.card_id,
      },
    },
  ])

  await syncGenerationRunState(supabase, session.id)

  return { success: true, cardId: existingCardId }
}

export async function generateCard(
  pointId: string,
  existingCardId?: string,
  options?: {
    mode?: GenerateCardMode
    referenceCardId?: string | null
  },
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  await syncCurrentUserDirectory(supabase, user)
  const cookieSnapshot = (await cookies()).getAll().map(({ name, value }) => ({ name, value }))
  const mode = options?.mode ?? 'default'

  const { data: point, error: pointError } = await supabase
    .from('points')
    .select('*')
    .eq('id', pointId)
    .single()

  if (pointError) throw pointError

  const { session } = await ensureGenerationArtifacts(point.session_id)

  let cardId = existingCardId
  let card: CardRecord | null = null

  if (cardId) {
    const { data: existingCard, error: cardError } = await supabase
      .from('cards')
      .select('*')
      .eq('id', cardId)
      .single()

    if (cardError) throw cardError
    card = existingCard as CardRecord
  } else {
    const { data: existingCard, error: cardError } = await supabase
      .from('cards')
      .select('*')
      .eq('point_id', pointId)
      .single()

    if (cardError) throw cardError
    card = existingCard as CardRecord
    cardId = card.id
  }

  if (!cardId || !card) {
    throw new Error('Card not found')
  }

  const creditKind = getRequiredCreditKind((point.note_role ?? 'support') as NoteRole, mode)

  if (creditKind) {
    await consumeGenerationCredit(supabase, creditKind)
  }

  let refundCredit = Boolean(creditKind)
  try {
    const nextGate: GenerationGate =
      mode === 'premium'
        ? 'premium'
        : point.note_role === 'hero'
          ? 'automatic'
          : 'manual'

    await supabase
      .from('cards')
      .update({
        status: 'queued',
        generation_gate: nextGate,
        reused_from_card_id: null,
        render_model: null,
        render_quality: null,
      })
      .eq('id', cardId)

    await ensureQueuedJob(supabase, {
      sessionId: point.session_id,
      cardId,
      point: point as PointRecord,
      userId: session.user_id,
      referenceCardId: mode === 'remix' ? options?.referenceCardId ?? null : null,
      entitlementKind: creditKind,
    })
    refundCredit = false

    await syncGenerationRunState(supabase, point.session_id)
    registerGenerationSession(point.session_id, cookieSnapshot)

    return { success: true, cardId }
  } catch (error) {
    if (creditKind && refundCredit) {
      await refundGenerationCredit(supabase, creditKind)
    }

    throw error
  }
}

export async function generateSessionCards(sessionId: string) {
  const cookieSnapshot = (await cookies()).getAll().map(({ name, value }) => ({ name, value }))
  await ensureGenerationArtifacts(sessionId)
  registerGenerationSession(sessionId, cookieSnapshot)
  return { success: true }
}

export async function retryCard(cardId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  await syncCurrentUserDirectory(supabase, user)

  const [{ data: card, error: cardError }, { data: pointRow, error: pointError }] = await Promise.all([
    supabase
      .from('cards')
      .select('session_id, generation_gate, point_id')
      .eq('id', cardId)
      .single(),
    supabase
      .from('cards')
      .select('points ( note_role )')
      .eq('id', cardId)
      .single(),
  ])

  if (cardError) {
    throw cardError
  }

  if (pointError) {
    throw pointError
  }

  const noteRole = ((pointRow.points as { note_role?: NoteRole } | null)?.note_role ?? 'support') as NoteRole
  const retryMode: GenerateCardMode = card.generation_gate === 'premium' ? 'premium' : 'default'
  const creditKind = getRequiredCreditKind(noteRole, retryMode)

  if (creditKind) {
    await consumeGenerationCredit(supabase, creditKind)
  }
  let refundCredit = Boolean(creditKind)
  try {
    const { error: entitlementError } = await supabase
      .from('card_jobs')
      .update({
        entitlement_kind: creditKind,
        entitlement_units: creditKind ? 1 : 0,
      })
      .eq('card_id', cardId)

    if (entitlementError) {
      throw entitlementError
    }

    await queueCardForRetry(supabase, cardId)
    refundCredit = false

    const cookieSnapshot = (await cookies()).getAll().map(({ name, value }) => ({ name, value }))
    registerGenerationSession(card.session_id, cookieSnapshot)

    return { success: true }
  } catch (error) {
    if (creditKind && refundCredit) {
      await refundGenerationCredit(supabase, creditKind)
    }

    throw error
  }
}
