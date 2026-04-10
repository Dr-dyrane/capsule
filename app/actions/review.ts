'use server'

import { revalidatePath } from 'next/cache'

import { trackProductEvent } from '@/lib/analytics/events'
import { isCommunitySchemaError } from '@/lib/community/schema'
import { ensureReviewItemExists } from '@/lib/review/queue'
import { getNextReviewSchedule } from '@/lib/review/schedule'
import { isReviewSchemaError } from '@/lib/review/schema'
import { getCommunityLibraryDisplayTitle, getSessionDisplayTitle } from '@/lib/sessions/display'
import { createSignedObjectUrlsSafe } from '@/lib/storage/signed-urls'
import { createClient } from '@/lib/supabase/server'
import type {
  ReviewItemRecord,
  ReviewQueueItem,
  ReviewScore,
  ReviewSourceType,
} from '@/lib/types'

type ReviewQueueOptions = {
  limit?: number
  focusCardId?: string | null
}

type ReviewRow = Pick<
  ReviewItemRecord,
  | 'id'
  | 'card_id'
  | 'source_type'
  | 'state'
  | 'last_score'
  | 'last_reviewed_at'
  | 'next_review_at'
  | 'review_count'
  | 'lapse_count'
>

type GeneratedReviewPointRow = {
  text: string
  category: string | null
  concept: string | null
  note_role?: ReviewQueueItem['note_role']
}

type GeneratedReviewCardRow = {
  id: string
  title: string | null
  image_url: string
  status: string
  session_id: string
  points: GeneratedReviewPointRow | GeneratedReviewPointRow[]
}

type CommunityReviewCardRow = {
  card_id: string
  session_id: string
  image_url: string
  title: string | null
  point_text: string
  category: string | null
  concept: string | null
  note_role?: ReviewQueueItem['note_role']
}

type ReviewCardDetails = {
  card_id: string
  session_id: string
  session_label: string | null
  title: string | null
  image_url: string
  point_text: string
  category: string | null
  concept: string | null
  note_role: ReviewQueueItem['note_role']
}

type ReviewQueueSummary = {
  dueCount: number
  generatedCount: number
  savedCommunityCount: number
  hasFocusCard: boolean
  focusSourceType: ReviewSourceType | null
}

type ReviewQueueResult = {
  items: ReviewQueueItem[]
  summary: ReviewQueueSummary
}

const REVIEW_RUN_WINDOW_MS = 1000 * 60 * 60 * 6

function revalidateReviewPaths(cardId?: string, sessionId?: string) {
  revalidatePath('/review')
  revalidatePath('/library')
  revalidatePath('/cards')

  if (cardId) {
    revalidatePath(`/cards/${cardId}`)
    revalidatePath(`/community/${cardId}`)
  }

  if (sessionId) {
    revalidatePath(`/scan/${sessionId}`)
    revalidatePath(`/community/library/${sessionId}`)
  }
}

function getPointFromCard(card: GeneratedReviewCardRow) {
  return Array.isArray(card.points) ? card.points[0] : card.points
}

function mapGeneratedCardDetails(card: GeneratedReviewCardRow): ReviewCardDetails | null {
  const point = getPointFromCard(card)

  if (!point?.text) {
    return null
  }

  return {
    card_id: card.id,
    session_id: card.session_id,
    session_label: null,
    title: card.title,
    image_url: card.image_url,
    point_text: point.text,
    category: point.category ?? null,
    concept: point.concept ?? null,
    note_role: point.note_role ?? null,
  }
}

function mapCommunityCardDetails(card: CommunityReviewCardRow): ReviewCardDetails | null {
  if (!card.point_text) {
    return null
  }

  return {
    card_id: card.card_id,
    session_id: card.session_id,
    session_label: null,
    title: card.title,
    image_url: card.image_url,
    point_text: card.point_text,
    category: card.category ?? null,
    concept: card.concept ?? null,
    note_role: card.note_role ?? null,
  }
}

function mapReviewRow(
  row: ReviewRow,
  card: ReviewCardDetails | undefined,
  signedUrls: Record<string, string>,
): ReviewQueueItem | null {
  if (!card) {
    return null
  }

  return {
    review_item_id: row.id,
    card_id: row.card_id,
    session_id: card.session_id,
    session_label: card.session_label,
    source_type: row.source_type,
    title: card.title,
    image_url: card.image_url,
    signed_url: signedUrls[card.image_url] ?? null,
    point_text: card.point_text,
    category: card.category,
    concept: card.concept,
    note_role: card.note_role,
    state: row.state,
    last_score: row.last_score,
    last_reviewed_at: row.last_reviewed_at,
    next_review_at: row.next_review_at,
    review_count: row.review_count,
    lapse_count: row.lapse_count,
  }
}

function getReviewRowGroupKey(row: ReviewRow, cardLookup: Map<string, ReviewCardDetails>) {
  const sessionId = cardLookup.get(row.card_id)?.session_id
  return sessionId ? `${row.source_type}:${sessionId}` : `${row.source_type}:${row.card_id}`
}

function getReviewRowTimestamp(row: ReviewRow) {
  const value = new Date(row.next_review_at).getTime()
  return Number.isFinite(value) ? value : 0
}

function orderDueRowsIntoRuns(rows: ReviewRow[], cardLookup: Map<string, ReviewCardDetails>) {
  const remaining = [...rows]
  const ordered: ReviewRow[] = []

  while (remaining.length > 0) {
    const seed = remaining.shift()

    if (!seed) {
      break
    }

    ordered.push(seed)

    const seedGroupKey = getReviewRowGroupKey(seed, cardLookup)
    const seedTime = getReviewRowTimestamp(seed)

    for (let index = 0; index < remaining.length;) {
      const candidate = remaining[index]
      const candidateGroupKey = getReviewRowGroupKey(candidate, cardLookup)
      const candidateTime = getReviewRowTimestamp(candidate)

      if (candidateGroupKey === seedGroupKey && candidateTime - seedTime <= REVIEW_RUN_WINDOW_MS) {
        ordered.push(candidate)
        remaining.splice(index, 1)
        continue
      }

      index += 1
    }
  }

  return ordered
}

function orderReviewRows({
  dueRows,
  focusRows,
  cardLookup,
}: {
  dueRows: ReviewRow[]
  focusRows: ReviewRow[]
  cardLookup: Map<string, ReviewCardDetails>
}) {
  const focusRowIds = new Set(focusRows.map((row) => row.id))
  const remainingDueRows = dueRows.filter((row) => !focusRowIds.has(row.id))
  const preferredGroupKey = focusRows[0] ? getReviewRowGroupKey(focusRows[0], cardLookup) : null

  let preferredRows: ReviewRow[] = []
  let otherRows = remainingDueRows

  if (preferredGroupKey) {
    preferredRows = remainingDueRows.filter((row) => getReviewRowGroupKey(row, cardLookup) === preferredGroupKey)
    otherRows = remainingDueRows.filter((row) => getReviewRowGroupKey(row, cardLookup) !== preferredGroupKey)
  }

  return [
    ...focusRows,
    ...preferredRows,
    ...orderDueRowsIntoRuns(otherRows, cardLookup),
  ]
}

async function syncGeneratedReviewItems(userId: string) {
  const supabase = await createClient()

  const [{ data: ownedCompleteCards, error: cardsError }, { data: existingItems, error: itemsError }] = await Promise.all([
    supabase
      .from('cards')
      .select('id')
      .eq('status', 'complete'),
    supabase
      .from('review_items')
      .select('card_id')
      .eq('user_id', userId),
  ])

  if (cardsError) {
    throw cardsError
  }

  if (itemsError) {
    if (isReviewSchemaError(itemsError)) {
      return
    }

    throw itemsError
  }

  const existingCardIds = new Set((existingItems ?? []).map((item) => item.card_id))
  const missingCardIds = (ownedCompleteCards ?? [])
    .map((card) => card.id as string)
    .filter((cardId) => !existingCardIds.has(cardId))

  if (missingCardIds.length === 0) {
    return
  }

  const now = new Date().toISOString()
  const payload = missingCardIds.map((cardId) => ({
    user_id: userId,
    card_id: cardId,
    source_type: 'generated' as const,
    state: 'new' as const,
    next_review_at: now,
  }))

  const { error } = await supabase.from('review_items').upsert(payload, {
    onConflict: 'user_id,card_id',
    ignoreDuplicates: true,
  })

  if (error) {
    if (isReviewSchemaError(error)) {
      return
    }

    throw error
  }
}

async function syncSavedCommunityReviewItems(userId: string) {
  const supabase = await createClient()
  const { data: savedRows, error: savedError } = await supabase
    .from('community_reactions')
    .select('card_id')
    .eq('user_id', userId)
    .eq('kind', 'save')

  if (savedError) {
    if (isCommunitySchemaError(savedError) || isReviewSchemaError(savedError)) {
      return
    }

    throw savedError
  }

  const savedCardIds = [...new Set((savedRows ?? []).map((row) => row.card_id as string))]
  let validSavedCardIds: string[] = []

  if (savedCardIds.length > 0) {
    const { data: publishedRows, error: publishedError } = await supabase
      .from('community_review_index')
      .select('card_id')
      .in('card_id', savedCardIds)

    if (publishedError) {
      if (isCommunitySchemaError(publishedError) || isReviewSchemaError(publishedError)) {
        return
      }

      throw publishedError
    }

    validSavedCardIds = [...new Set((publishedRows ?? []).map((row) => row.card_id as string))]
  }

  const { data: existingItems, error: itemsError } = await supabase
    .from('review_items')
    .select('card_id')
    .eq('user_id', userId)
    .eq('source_type', 'saved_community')

  if (itemsError) {
    if (isReviewSchemaError(itemsError)) {
      return
    }

    throw itemsError
  }

  const existingCardIds = new Set((existingItems ?? []).map((item) => item.card_id))
  const validSavedCardIdSet = new Set(validSavedCardIds)
  const missingCardIds = validSavedCardIds.filter((cardId) => !existingCardIds.has(cardId))
  const staleCardIds = (existingItems ?? [])
    .map((item) => item.card_id as string)
    .filter((cardId) => !validSavedCardIdSet.has(cardId))

  if (missingCardIds.length > 0) {
    const now = new Date().toISOString()
    const payload = missingCardIds.map((cardId) => ({
      user_id: userId,
      card_id: cardId,
      source_type: 'saved_community' as const,
      state: 'new' as const,
      next_review_at: now,
    }))

    const { error } = await supabase.from('review_items').upsert(payload, {
      onConflict: 'user_id,card_id',
      ignoreDuplicates: true,
    })

    if (error) {
      if (!isReviewSchemaError(error)) {
        throw error
      }
    }
  }

  if (staleCardIds.length > 0) {
    const { error } = await supabase
      .from('review_items')
      .delete()
      .eq('user_id', userId)
      .eq('source_type', 'saved_community')
      .in('card_id', staleCardIds)

    if (error) {
      if (!isReviewSchemaError(error)) {
        throw error
      }
    }
  }
}

async function syncCurrentUserReviewItems(userId: string) {
  await Promise.all([
    syncGeneratedReviewItems(userId),
    syncSavedCommunityReviewItems(userId),
  ])
}

async function ensureFocusCardReviewItem(userId: string, focusCardId?: string | null) {
  if (!focusCardId) {
    return
  }

  const supabase = await createClient()
  const { data: ownedCard, error } = await supabase
    .from('cards')
    .select('id')
    .eq('id', focusCardId)
    .eq('status', 'complete')
    .maybeSingle()

  if (error) {
    if (isReviewSchemaError(error)) {
      return
    }

    throw error
  }

  if (!ownedCard?.id) {
    return
  }

  await ensureReviewItemExists(supabase, {
    userId,
    cardId: ownedCard.id,
  })
}

async function fetchReviewRows(userId: string, limit: number, dueOnly: boolean, focusCardId?: string | null) {
  const supabase = await createClient()
  const now = new Date().toISOString()
  let query = supabase
    .from('review_items')
    .select('id, card_id, source_type, state, last_score, last_reviewed_at, next_review_at, review_count, lapse_count')
    .eq('user_id', userId)

  if (focusCardId) {
    query = query.eq('card_id', focusCardId)
  }

  if (dueOnly) {
    query = query.lte('next_review_at', now)
  }

  const { data, error } = await query
    .order('next_review_at', { ascending: true })
    .limit(limit)

  if (error) {
    if (isReviewSchemaError(error)) {
      return []
    }

    throw error
  }

  return (data ?? []) as ReviewRow[]
}

async function fetchGeneratedSessionLabels(sessionIds: string[]) {
  if (sessionIds.length === 0) {
    return new Map<string, string>()
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sessions')
    .select('id, custom_title, session_context, remix_source_card_id')
    .in('id', sessionIds)

  if (error) {
    throw error
  }

  return new Map(
    (data ?? []).map((session) => [
      session.id as string,
      getSessionDisplayTitle({
        custom_title: (session.custom_title as string | null) ?? null,
        session_context: (session.session_context as string | null) ?? null,
        remix_source_card_id: (session.remix_source_card_id as string | null) ?? null,
      }),
    ]),
  )
}

async function fetchCommunitySessionLabels(sessionIds: string[]) {
  if (sessionIds.length === 0) {
    return new Map<string, string>()
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('community_library_index')
    .select('session_id, title, category, concept')
    .in('session_id', sessionIds)

  if (error) {
    if (isCommunitySchemaError(error) || isReviewSchemaError(error)) {
      return new Map<string, string>()
    }

    throw error
  }

  return new Map(
    (data ?? []).map((library) => [
      library.session_id as string,
      getCommunityLibraryDisplayTitle({
        title: (library.title as string | null) ?? null,
        category: (library.category as string | null) ?? null,
        concept: (library.concept as string | null) ?? null,
      }),
    ]),
  )
}

async function fetchGeneratedCardDetails(cardIds: string[]) {
  if (cardIds.length === 0) {
    return new Map<string, ReviewCardDetails>()
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cards')
    .select('id, title, image_url, status, session_id, points!inner(text, category, concept, note_role)')
    .in('id', cardIds)
    .eq('status', 'complete')

  if (error) {
    throw error
  }

  const cards = (data ?? []) as GeneratedReviewCardRow[]
  const sessionLabels = await fetchGeneratedSessionLabels([...new Set(cards.map((card) => card.session_id))])
  return new Map(
    cards
      .map((card) => {
        const mapped = mapGeneratedCardDetails(card)
        if (!mapped) {
          return null
        }

        return {
          ...mapped,
          session_label: sessionLabels.get(card.session_id) ?? mapped.session_label,
        }
      })
      .filter((card): card is ReviewCardDetails => Boolean(card))
      .map((card) => [card.card_id, card]),
  )
}

async function fetchSavedCommunityCardDetails(cardIds: string[]) {
  if (cardIds.length === 0) {
    return new Map<string, ReviewCardDetails>()
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('community_review_index')
    .select('card_id, session_id, image_url, title, point_text, category, concept, note_role')
    .in('card_id', cardIds)

  if (error) {
    if (isCommunitySchemaError(error) || isReviewSchemaError(error)) {
      return new Map<string, ReviewCardDetails>()
    }

    throw error
  }

  const cards = (data ?? []) as CommunityReviewCardRow[]
  const sessionLabels = await fetchCommunitySessionLabels([...new Set(cards.map((card) => card.session_id))])
  return new Map(
    cards
      .map((card) => {
        const mapped = mapCommunityCardDetails(card)
        if (!mapped) {
          return null
        }

        return {
          ...mapped,
          session_label: sessionLabels.get(card.session_id) ?? mapped.session_label,
        }
      })
      .filter((card): card is ReviewCardDetails => Boolean(card))
      .map((card) => [card.card_id, card]),
  )
}

async function countDueReviewItems(userId: string) {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('review_items')
    .select('id, cards!inner(id)', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('cards.status', 'complete')
    .lte('next_review_at', new Date().toISOString())

  if (error) {
    if (isReviewSchemaError(error)) {
      return 0
    }

    throw error
  }

  return count ?? 0
}

export async function getDueReviewCount() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return 0
  }

  await syncCurrentUserReviewItems(user.id)

  return countDueReviewItems(user.id)
}

export async function getReviewQueue(options: ReviewQueueOptions = {}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const limit = options.limit ?? 20
  await syncCurrentUserReviewItems(user.id)
  await ensureFocusCardReviewItem(user.id, options.focusCardId ?? null)

  const [dueCount, dueRows, focusRows] = await Promise.all([
    countDueReviewItems(user.id),
    fetchReviewRows(user.id, limit, true),
    options.focusCardId ? fetchReviewRows(user.id, 1, false, options.focusCardId) : Promise.resolve([] as ReviewRow[]),
  ])

  const rows = [...focusRows, ...dueRows].filter(
    (row, index, collection) => collection.findIndex((candidate) => candidate.id === row.id) === index,
  )

  const generatedCardIds = rows
    .filter((row) => row.source_type === 'generated')
    .map((row) => row.card_id)
  const savedCommunityCardIds = rows
    .filter((row) => row.source_type === 'saved_community')
    .map((row) => row.card_id)

  const [generatedCards, savedCommunityCards] = await Promise.all([
    fetchGeneratedCardDetails(generatedCardIds),
    fetchSavedCommunityCardDetails(savedCommunityCardIds),
  ])

  const cardLookup = new Map<string, ReviewCardDetails>([
    ...generatedCards,
    ...savedCommunityCards,
  ])

  const orderedRows = orderReviewRows({
    dueRows,
    focusRows,
    cardLookup,
  })

  const signedUrls = await createSignedObjectUrlsSafe(
    'cards',
    orderedRows
      .map((row) => cardLookup.get(row.card_id)?.image_url)
      .filter((path): path is string => typeof path === 'string' && path.length > 0),
  )

  const items = orderedRows
    .map((row) => mapReviewRow(row, cardLookup.get(row.card_id), signedUrls))
    .filter((row): row is ReviewQueueItem => Boolean(row))

  return {
    items,
    summary: {
      dueCount,
      generatedCount: rows.filter((row) => row.source_type === 'generated').length,
      savedCommunityCount: rows.filter((row) => row.source_type === 'saved_community').length,
      hasFocusCard: focusRows.length > 0,
      focusSourceType: focusRows[0]?.source_type ?? null,
    },
  } satisfies ReviewQueueResult
}

export async function submitReviewResult(reviewItemId: string, score: ReviewScore) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: reviewItem, error } = await supabase
    .from('review_items')
    .select('id, card_id, source_type, state, review_count, lapse_count, cards!inner(session_id)')
    .eq('id', reviewItemId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (isReviewSchemaError(error)) {
      throw new Error('Review is not available yet. Apply the latest database migration first.')
    }

    throw error
  }

  const session = Array.isArray(reviewItem.cards) ? reviewItem.cards[0] : reviewItem.cards
  const now = new Date()
  const schedule = getNextReviewSchedule(reviewItem.state, score, now)

  const [{ error: updateError }, { error: eventError }] = await Promise.all([
    supabase
      .from('review_items')
      .update({
        state: schedule.nextState,
        last_score: score,
        last_reviewed_at: now.toISOString(),
        next_review_at: schedule.nextReviewAt,
        review_count: (reviewItem.review_count ?? 0) + 1,
        lapse_count: (reviewItem.lapse_count ?? 0) + schedule.lapseIncrement,
      })
      .eq('id', reviewItemId)
      .eq('user_id', user.id),
    supabase
      .from('review_events')
      .insert({
        user_id: user.id,
        review_item_id: reviewItemId,
        score,
        reviewed_at: now.toISOString(),
      }),
  ])

  if (updateError) {
    if (isReviewSchemaError(updateError)) {
      throw new Error('Review is not available yet. Apply the latest database migration first.')
    }

    throw updateError
  }

  if (eventError) {
    if (isReviewSchemaError(eventError)) {
      throw new Error('Review is not available yet. Apply the latest database migration first.')
    }

    throw eventError
  }

  await trackProductEvent({
    eventName: 'review_item_scored',
    userId: user.id,
    cardId: reviewItem.card_id,
    sessionId: session?.session_id ?? null,
    properties: {
      next_state: schedule.nextState,
      score,
      source_type: reviewItem.source_type,
    },
    includeClarificationSummary: true,
    supabase,
  })

  revalidateReviewPaths(reviewItem.card_id, session?.session_id ?? undefined)

  return {
    success: true,
    nextReviewAt: schedule.nextReviewAt,
    nextState: schedule.nextState,
  }
}
