'use server'

import { revalidatePath } from 'next/cache'

import { trackProductEvent } from '@/lib/analytics/events'
import { isClarificationSchemaError } from '@/lib/clarifications/schema'
import { isCommunitySchemaError } from '@/lib/community/schema'
import { ensureReviewItemExists } from '@/lib/review/queue'
import { isReviewSchemaError } from '@/lib/review/schema'
import { createDirectAssetUrlMap, isDirectAssetUrl } from '@/lib/storage/asset-paths'
import { createPublicClient } from '@/lib/supabase/public'
import { createClient } from '@/lib/supabase/server'
import type {
  CardRecord,
  CommunityCardRelationshipRecord,
  CommunityFilterMeta,
  CommunityIndexRecord,
  CommunityLibraryIndexRecord,
  CommunityReactionKind,
  CommunitySort,
  CommunityViewerState,
  CommunityVisibility,
  ProfileRecord,
} from '@/lib/types'

export type CommunityCardRecord = CommunityIndexRecord
export type CommunityLibraryRecord = CommunityLibraryIndexRecord

type CommunityCardRelationshipIndexRow = {
  card_id: string
  related_card_id: string
  relationship_type: CommunityCardRelationshipRecord['relationship_type']
  relationship_reason: string
  relationship_strength: number
  related_session_id: string
  related_image_url: string
  related_title: string | null
  related_published_at: string | null
  related_published_by: string | null
  related_community_template: string | null
  related_category: string | null
  related_concept: string | null
  related_author_name: string | null
  related_author_avatar_url: string | null
  related_like_count: number | null
  related_save_count: number | null
  related_report_count: number | null
  related_trend_score: number | null
}

export type CommunityQueryOptions = {
  search?: string
  template?: string | null
  category?: string | null
  topic?: string | null
  sort?: CommunitySort
  savedOnly?: boolean
  authorId?: string | null
  sessionId?: string | null
}

type CommunityClarificationSummary = Pick<
  CommunityIndexRecord,
  'clarification_open_count' | 'clarification_resolved_count' | 'has_unresolved_correction'
>

const EMPTY_COMMUNITY_CLARIFICATION_SUMMARY: CommunityClarificationSummary = {
  clarification_open_count: 0,
  clarification_resolved_count: 0,
  has_unresolved_correction: false,
}

function toCommunityUnsupportedError() {
  return new Error('Community publishing is not available yet.')
}

function normalizeSearch(search?: string) {
  return search?.trim() ?? ''
}

function normalizeTemplate(template?: string | null) {
  if (!template || template === 'all') {
    return null
  }

  return template
}

function normalizeValue(value?: string | null) {
  if (!value || value === 'all') {
    return null
  }

  return value
}

function normalizeSort(sort?: CommunitySort) {
  return sort === 'trending' ? 'trending' : 'recent'
}

function revalidateCommunityPaths(sessionId?: string | null, cardId?: string | null) {
  revalidatePath('/')
  revalidatePath('/cards')
  revalidatePath('/community')
  revalidatePath('/library')
  revalidatePath('/review')

  if (sessionId) {
    revalidatePath(`/scan/${sessionId}`)
  }

  if (cardId) {
    revalidatePath(`/cards/${cardId}`)
    revalidatePath(`/community/${cardId}`)
  }

  if (sessionId) {
    revalidatePath(`/community/library/${sessionId}`)
  }
}

function createEmptyViewerStateMap(ids: string[]) {
  return Object.fromEntries(
    ids.map((id) => [
      id,
      {
        liked: false,
        saved: false,
        reported: false,
      } satisfies CommunityViewerState,
    ]),
  ) as Record<string, CommunityViewerState>
}

async function updateSessionVisibility(
  sessionId: string,
  visibility: CommunityVisibility,
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('sessions')
    .update({ visibility })
    .eq('id', sessionId)

  if (error && !isCommunitySchemaError(error)) {
    throw error
  }
}

async function refreshPublicCardRelationships(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sessionId?: string | null,
) {
  const { error } = await supabase.rpc('refresh_public_card_relationships', {
    p_session_id: sessionId ?? null,
  })

  if (error && !isCommunitySchemaError(error)) {
    throw error
  }
}

async function ensureCurrentUserProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        username:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          null,
        avatar_url: user.user_metadata?.avatar_url || null,
      },
      { onConflict: 'id' },
    )

  if (error && !isCommunitySchemaError(error)) {
    throw error
  }

  return { supabase, user }
}

async function fetchProfilesById(userIds: string[]) {
  if (userIds.length === 0) {
    return new Map<string, Pick<ProfileRecord, 'username' | 'avatar_url'>>()
  }

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', userIds)

  if (error) {
    if (isCommunitySchemaError(error)) {
      return new Map<string, Pick<ProfileRecord, 'username' | 'avatar_url'>>()
    }

    throw error
  }

  const profiles = (data ?? []) as Pick<ProfileRecord, 'id' | 'username' | 'avatar_url'>[]

  return new Map(
    profiles.map((profile) => [
      profile.id,
      {
        username: profile.username,
        avatar_url: profile.avatar_url,
      },
    ]),
  )
}

function mergeCommunityClarificationSummary<T extends Pick<CommunityIndexRecord, 'card_id'>>(
  card: T,
  summary?: CommunityClarificationSummary,
) {
  return {
    ...card,
    ...(summary ?? EMPTY_COMMUNITY_CLARIFICATION_SUMMARY),
  }
}

async function getCommunityClarificationSummaries(cardIds: string[]) {
  const ids = [...new Set(cardIds.filter(Boolean))]

  if (ids.length === 0) {
    return new Map<string, CommunityClarificationSummary>()
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Map<string, CommunityClarificationSummary>()
  }

  const { data, error } = await supabase
    .from('card_clarification_threads')
    .select('card_id, kind, status')
    .in('card_id', ids)
    .neq('status', 'removed')

  if (error) {
    if (isClarificationSchemaError(error)) {
      return new Map<string, CommunityClarificationSummary>()
    }

    throw error
  }

  return (data ?? []).reduce<Map<string, CommunityClarificationSummary>>((acc, thread) => {
    const current = acc.get(thread.card_id) ?? { ...EMPTY_COMMUNITY_CLARIFICATION_SUMMARY }

    if (thread.status === 'open') {
      current.clarification_open_count += 1
    }

    if (thread.status === 'resolved') {
      current.clarification_resolved_count += 1
    }

    if (thread.kind === 'correction' && thread.status === 'open') {
      current.has_unresolved_correction = true
    }

    acc.set(thread.card_id, current)
    return acc
  }, new Map<string, CommunityClarificationSummary>())
}

async function enrichCommunityCardsWithClarifications<T extends Pick<CommunityIndexRecord, 'card_id'>>(
  cards: T[],
) {
  if (cards.length === 0) {
    return [] as Array<T & CommunityClarificationSummary>
  }

  const summaries = await getCommunityClarificationSummaries(cards.map((card) => card.card_id))
  return cards.map((card) => mergeCommunityClarificationSummary(card, summaries.get(card.card_id)))
}

async function getCommunityCardsFallback(page: number, limit: number) {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('cards')
    .select(
      'id, point_id, session_id, image_url, title, status, card_order, created_at, visibility, published_at, published_by, community_template, community_hash, points(category, concept)',
    )
    .eq('visibility', 'published')
    .eq('status', 'complete')
    .order('published_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (error) {
    if (isCommunitySchemaError(error)) {
      return [] as CommunityCardRecord[]
    }

    throw error
  }

  const cards = (data ?? []) as CardRecord[]
  const authorIds = [...new Set(cards.map((card) => card.published_by).filter(Boolean) as string[])]
  const profilesById = await fetchProfilesById(authorIds)

  const fallbackCards = cards.map((card) => {
    const point = Array.isArray(card.points) ? card.points[0] : card.points

    return {
      card_id: card.id,
      session_id: card.session_id,
      image_url: card.image_url,
      title: card.title,
      published_at: card.published_at ?? null,
      published_by: card.published_by ?? null,
      community_template: card.community_template ?? 'mechanism-board',
      category: point?.category ?? null,
      concept: point?.concept ?? null,
      author_name: card.published_by ? profilesById.get(card.published_by)?.username ?? null : null,
      author_avatar_url: card.published_by ? profilesById.get(card.published_by)?.avatar_url ?? null : null,
      like_count: 0,
      save_count: 0,
      report_count: 0,
      trend_score: 0,
    }
  })

  return enrichCommunityCardsWithClarifications(fallbackCards)
}

export async function publishCard(cardId: string) {
  const { supabase, user } = await ensureCurrentUserProfile()
  const { data: card } = await supabase
    .from('cards')
    .select('session_id')
    .eq('id', cardId)
    .maybeSingle()

  const { error } = await supabase
    .from('cards')
    .update({
      visibility: 'published',
      published_at: new Date().toISOString(),
      published_by: user.id,
    })
    .eq('id', cardId)

  if (error) {
    if (isCommunitySchemaError(error)) {
      throw toCommunityUnsupportedError()
    }

    throw error
  }

  await refreshPublicCardRelationships(supabase, card?.session_id ?? null)
  revalidateCommunityPaths(card?.session_id ?? null, cardId)
}

export async function unpublishCard(cardId: string) {
  const supabase = await createClient()

  const { data: card } = await supabase
    .from('cards')
    .select('session_id')
    .eq('id', cardId)
    .maybeSingle()

  const { error } = await supabase
    .from('cards')
    .update({
      visibility: 'private',
      published_at: null,
      published_by: null,
    })
    .eq('id', cardId)

  if (error) {
    if (isCommunitySchemaError(error)) {
      throw toCommunityUnsupportedError()
    }

    throw error
  }

  await refreshPublicCardRelationships(supabase, card?.session_id ?? null)
  revalidateCommunityPaths(card?.session_id ?? null, cardId)
}

export async function publishCards(cardIds: string[]) {
  const ids = [...new Set(cardIds.filter(Boolean))]
  if (ids.length === 0) return

  const { supabase, user } = await ensureCurrentUserProfile()
  const now = new Date().toISOString()

  const { data: sessions } = await supabase
    .from('cards')
    .select('session_id')
    .in('id', ids)

  const { error } = await supabase
    .from('cards')
    .update({
      visibility: 'published',
      published_at: now,
      published_by: user.id,
    })
    .in('id', ids)

  if (error) {
    if (isCommunitySchemaError(error)) {
      throw toCommunityUnsupportedError()
    }

    throw error
  }

  const sessionIds = [...new Set((sessions ?? []).map((entry) => entry.session_id).filter(Boolean))]
  for (const sessionId of sessionIds) {
    await refreshPublicCardRelationships(supabase, sessionId)
  }
  sessionIds.forEach((sessionId) => revalidateCommunityPaths(sessionId))
}

export async function unpublishCards(cardIds: string[]) {
  const ids = [...new Set(cardIds.filter(Boolean))]
  if (ids.length === 0) return

  const supabase = await createClient()

  const { data: sessions } = await supabase
    .from('cards')
    .select('session_id')
    .in('id', ids)

  const { error } = await supabase
    .from('cards')
    .update({
      visibility: 'private',
      published_at: null,
      published_by: null,
    })
    .in('id', ids)

  if (error) {
    if (isCommunitySchemaError(error)) {
      throw toCommunityUnsupportedError()
    }

    throw error
  }

  const sessionIds = [...new Set((sessions ?? []).map((entry) => entry.session_id).filter(Boolean))]
  for (const sessionId of sessionIds) {
    await refreshPublicCardRelationships(supabase, sessionId)
  }
  sessionIds.forEach((sessionId) => revalidateCommunityPaths(sessionId))
}

export async function publishSession(sessionId: string) {
  const { supabase, user } = await ensureCurrentUserProfile()

  await updateSessionVisibility(sessionId, 'published')

  const { error: cardsError } = await supabase
    .from('cards')
    .update({
      visibility: 'published',
      published_at: new Date().toISOString(),
      published_by: user.id,
    })
    .eq('session_id', sessionId)

  if (cardsError) {
    if (isCommunitySchemaError(cardsError)) {
      throw toCommunityUnsupportedError()
    }

    throw cardsError
  }

  await refreshPublicCardRelationships(supabase, sessionId)
  revalidateCommunityPaths(sessionId)
}

export async function unpublishSession(sessionId: string) {
  const supabase = await createClient()

  await updateSessionVisibility(sessionId, 'private')

  const { error: cardsError } = await supabase
    .from('cards')
    .update({
      visibility: 'private',
      published_at: null,
      published_by: null,
    })
    .eq('session_id', sessionId)

  if (cardsError) {
    if (isCommunitySchemaError(cardsError)) {
      throw toCommunityUnsupportedError()
    }

    throw cardsError
  }

  await refreshPublicCardRelationships(supabase, sessionId)
  revalidateCommunityPaths(sessionId)
}

export async function getCommunityCards(
  page: number = 0,
  limit: number = 20,
  options: CommunityQueryOptions = {},
) {
  const supabase = createPublicClient()
  const search = normalizeSearch(options.search)
  const template = normalizeTemplate(options.template)
  const category = normalizeValue(options.category)
  const topic = normalizeValue(options.topic)
  const sort = normalizeSort(options.sort)
  const savedOnly = Boolean(options.savedOnly)
  const authorId = normalizeValue(options.authorId)
  const sessionId = normalizeValue(options.sessionId)

  let savedCardIds: string[] | null = null

  if (savedOnly) {
    const serverClient = await createClient()
    const {
      data: { user },
    } = await serverClient.auth.getUser()

    if (!user) {
      return []
    }

    const { data: savedRows, error: savedError } = await serverClient
      .from('community_reactions')
      .select('card_id')
      .eq('user_id', user.id)
      .eq('kind', 'save')

    if (savedError) {
      if (isCommunitySchemaError(savedError)) {
        return []
      }

      throw savedError
    }

    savedCardIds = (savedRows ?? []).map((row) => row.card_id)

    if (savedCardIds.length === 0) {
      return []
    }
  }

  let query = supabase
    .from('community_index')
    .select(
      'card_id, session_id, image_url, title, published_at, published_by, community_template, category, concept, author_name, author_avatar_url, like_count, save_count, report_count, trend_score',
    )
    .range(page * limit, (page + 1) * limit - 1)

  if (template) {
    query = query.eq('community_template', template)
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (topic) {
    query = query.eq('concept', topic)
  }

  if (authorId) {
    query = query.eq('published_by', authorId)
  }

  if (sessionId) {
    query = query.eq('session_id', sessionId)
  }

  if (savedCardIds) {
    query = query.in('card_id', savedCardIds)
  }

  if (search) {
    const escaped = search.replace(/[%_,]/g, '').trim()
    if (escaped) {
      query = query.or(
        `title.ilike.%${escaped}%,author_name.ilike.%${escaped}%,category.ilike.%${escaped}%,concept.ilike.%${escaped}%`,
      )
    }
  }

  if (sort === 'trending') {
    query = query
      .order('trend_score', { ascending: false })
      .order('published_at', { ascending: false })
  } else {
    query = query.order('published_at', { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    if (isCommunitySchemaError(error)) {
      return getCommunityCardsFallback(page, limit)
    }

    throw error
  }

  return enrichCommunityCardsWithClarifications((data ?? []) as CommunityCardRecord[])
}

export async function getCommunityCardCount(options: Omit<CommunityQueryOptions, 'sort'> = {}) {
  const supabase = createPublicClient()
  const search = normalizeSearch(options.search)
  const template = normalizeTemplate(options.template)
  const category = normalizeValue(options.category)
  const topic = normalizeValue(options.topic)
  const savedOnly = Boolean(options.savedOnly)
  const authorId = normalizeValue(options.authorId)
  const sessionId = normalizeValue(options.sessionId)

  let savedCardIds: string[] | null = null

  if (savedOnly) {
    const serverClient = await createClient()
    const {
      data: { user },
    } = await serverClient.auth.getUser()

    if (!user) {
      return 0
    }

    const { data: savedRows, error: savedError } = await serverClient
      .from('community_reactions')
      .select('card_id')
      .eq('user_id', user.id)
      .eq('kind', 'save')

    if (savedError) {
      if (isCommunitySchemaError(savedError)) {
        return 0
      }

      throw savedError
    }

    savedCardIds = (savedRows ?? []).map((row) => row.card_id)

    if (savedCardIds.length === 0) {
      return 0
    }
  }

  let query = supabase
    .from('community_index')
    .select('card_id', { count: 'exact', head: true })

  if (template) {
    query = query.eq('community_template', template)
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (topic) {
    query = query.eq('concept', topic)
  }

  if (authorId) {
    query = query.eq('published_by', authorId)
  }

  if (sessionId) {
    query = query.eq('session_id', sessionId)
  }

  if (savedCardIds) {
    query = query.in('card_id', savedCardIds)
  }

  if (search) {
    const escaped = search.replace(/[%_,]/g, '').trim()
    if (escaped) {
      query = query.or(
        `title.ilike.%${escaped}%,author_name.ilike.%${escaped}%,category.ilike.%${escaped}%,concept.ilike.%${escaped}%`,
      )
    }
  }

  const { count, error } = await query

  if (error) {
    if (isCommunitySchemaError(error)) {
      return 0
    }

    throw error
  }

  return count ?? 0
}

export async function getCommunityFilters(): Promise<CommunityFilterMeta> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('community_index')
    .select('community_template, category, concept')
    .order('community_template', { ascending: true })

  if (error) {
    if (isCommunitySchemaError(error)) {
      return {
        templates: ['mechanism-board'],
        categories: [],
        topics: [],
      }
    }

    throw error
  }

  const rows = (data ?? []) as Array<{
    community_template: string | null
    category: string | null
    concept: string | null
  }>

  const templates = rows
    .map((row) => row.community_template)
    .filter((value): value is string => typeof value === 'string' && value.length > 0)

  const categories = rows
    .map((row) => row.category)
    .filter((value): value is string => typeof value === 'string' && value.length > 0)

  const topics = rows
    .map((row) => row.concept)
    .filter((value): value is string => typeof value === 'string' && value.length > 0)

  return {
    templates: [...new Set(templates)],
    categories: [...new Set(categories)],
    topics: [...new Set(topics)],
  }
}

export async function getSavedCommunityCardsWithUrls(limit: number = 12) {
  return fetchCommunityCardsWithUrls(0, limit, {
    savedOnly: true,
    sort: 'recent',
  })
}

export async function getCommunityAuthorSummary(authorId: string) {
  const publicClient = createPublicClient()
  const [{ data: author }, { data: cards, error: cardsError }] = await Promise.all([
    publicClient.from('profiles').select('id, username, avatar_url').eq('id', authorId).maybeSingle(),
    publicClient
      .from('community_index')
      .select('card_id, like_count, save_count, report_count')
      .eq('published_by', authorId),
  ])

  if (cardsError) {
    if (isCommunitySchemaError(cardsError)) {
      return null
    }

    throw cardsError
  }

  const communityCards = (cards ?? []) as Array<{
    card_id: string
    like_count: number | null
    save_count: number | null
    report_count: number | null
  }>
  const totals = communityCards.reduce(
    (acc, card) => {
      acc.cardCount += 1
      acc.likeCount += card.like_count ?? 0
      acc.saveCount += card.save_count ?? 0
      acc.reportCount += card.report_count ?? 0
      return acc
    },
    { cardCount: 0, likeCount: 0, saveCount: 0, reportCount: 0 },
  )

  const typedAuthor = author as Pick<ProfileRecord, 'username' | 'avatar_url'> | null

  if (!typedAuthor && communityCards.length === 0) {
    return null
  }

  return {
    id: authorId,
    username: typedAuthor?.username ?? 'Community author',
    avatar_url: typedAuthor?.avatar_url ?? null,
    ...totals,
  }
}

export async function getCreatorModerationCardsWithUrls(limit: number = 20) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { cards: [] as CommunityCardRecord[], signedUrls: {} as Record<string, string> }
  }

  const publicClient = createPublicClient()
  const { data, error } = await publicClient
    .from('community_index')
    .select(
      'card_id, session_id, image_url, title, published_at, published_by, community_template, category, concept, author_name, author_avatar_url, like_count, save_count, report_count, trend_score',
    )
    .eq('published_by', user.id)
    .gt('report_count', 0)
    .order('report_count', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    if (isCommunitySchemaError(error)) {
      return { cards: [] as CommunityCardRecord[], signedUrls: {} as Record<string, string> }
    }

    throw error
  }

  const cards = await enrichCommunityCardsWithClarifications((data ?? []) as CommunityCardRecord[])
  const uniquePaths = [...new Set(cards.map((card) => card.image_url).filter(Boolean))]
  let signedUrls: Record<string, string> = createDirectAssetUrlMap(uniquePaths)
  const storagePaths = uniquePaths.filter((path) => !isDirectAssetUrl(path))

  if (storagePaths.length > 0) {
    const { data: signed, error: signedError } = await publicClient.storage
      .from('cards')
      .createSignedUrls(storagePaths, 60 * 60)

    if (!signedError) {
      signedUrls = storagePaths.reduce<Record<string, string>>((acc, path, index) => {
        const signedUrl = signed?.[index]?.signedUrl
        if (signedUrl) {
          acc[path] = signedUrl
        }
        return acc
      }, signedUrls)
    }
  }

  return { cards, signedUrls }
}

export async function getViewerCommunityReactions(cardIds: string[]) {
  const ids = [...new Set(cardIds.filter(Boolean))]
  if (ids.length === 0) {
    return {} as Record<string, CommunityViewerState>
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {} as Record<string, CommunityViewerState>
  }

  const { data, error } = await supabase
    .from('community_reactions')
    .select('card_id, kind')
    .in('card_id', ids)
    .eq('user_id', user.id)

  if (error) {
    if (isCommunitySchemaError(error)) {
      return {} as Record<string, CommunityViewerState>
    }

    throw error
  }

  return (data ?? []).reduce<Record<string, CommunityViewerState>>((acc, reaction) => {
    const existing = acc[reaction.card_id] ?? { liked: false, saved: false, reported: false }
    if (reaction.kind === 'like') {
      existing.liked = true
    }
    if (reaction.kind === 'save') {
      existing.saved = true
    }
    acc[reaction.card_id] = existing
    return acc
  }, {})
}

export async function getViewerCommunityReports(cardIds: string[]) {
  const ids = [...new Set(cardIds.filter(Boolean))]
  if (ids.length === 0) {
    return {} as Record<string, boolean>
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {} as Record<string, boolean>
  }

  const { data, error } = await supabase
    .from('community_reports')
    .select('card_id')
    .in('card_id', ids)
    .eq('user_id', user.id)

  if (error) {
    if (isCommunitySchemaError(error)) {
      return {} as Record<string, boolean>
    }

    throw error
  }

  return (data ?? []).reduce<Record<string, boolean>>((acc, report) => {
    acc[report.card_id] = true
    return acc
  }, {})
}

export async function getViewerCommunityLibraryReactions(sessionIds: string[]) {
  const ids = [...new Set(sessionIds.filter(Boolean))]
  if (ids.length === 0) {
    return {} as Record<string, CommunityViewerState>
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return createEmptyViewerStateMap(ids)
  }

  const { data, error } = await supabase
    .from('community_library_reactions')
    .select('session_id, kind')
    .in('session_id', ids)
    .eq('user_id', user.id)

  if (error) {
    if (isCommunitySchemaError(error)) {
      return createEmptyViewerStateMap(ids)
    }

    throw error
  }

  return (data ?? []).reduce<Record<string, CommunityViewerState>>((acc, reaction) => {
    const existing = acc[reaction.session_id] ?? { liked: false, saved: false, reported: false }
    if (reaction.kind === 'like') {
      existing.liked = true
    }
    if (reaction.kind === 'save') {
      existing.saved = true
    }
    acc[reaction.session_id] = existing
    return acc
  }, createEmptyViewerStateMap(ids))
}

export async function getViewerCommunityLibraryReports(sessionIds: string[]) {
  const ids = [...new Set(sessionIds.filter(Boolean))]
  if (ids.length === 0) {
    return {} as Record<string, boolean>
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {} as Record<string, boolean>
  }

  const { data, error } = await supabase
    .from('community_library_reports')
    .select('session_id')
    .in('session_id', ids)
    .eq('user_id', user.id)

  if (error) {
    if (isCommunitySchemaError(error)) {
      return {} as Record<string, boolean>
    }

    throw error
  }

  return (data ?? []).reduce<Record<string, boolean>>((acc, report) => {
    acc[report.session_id] = true
    return acc
  }, {})
}

export async function getCommunityCardByIdWithUrl(cardId: string) {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('community_index')
    .select(
      'card_id, session_id, image_url, title, published_at, published_by, community_template, category, concept, author_name, author_avatar_url, like_count, save_count, report_count, trend_score',
    )
    .eq('card_id', cardId)
    .maybeSingle()

  if (error) {
    if (isCommunitySchemaError(error)) {
      return null
    }

    throw error
  }

  const card = (data ?? null) as CommunityCardRecord | null

  if (!card?.image_url) {
    return null
  }

  const [enrichedCard] = await enrichCommunityCardsWithClarifications([card])
  const safeCard = enrichedCard ?? mergeCommunityClarificationSummary(card)

  if (isDirectAssetUrl(safeCard.image_url)) {
    return {
      ...safeCard,
      signedUrl: safeCard.image_url,
    }
  }

  const { data: signed, error: signedError } = await supabase.storage
    .from('cards')
    .createSignedUrl(safeCard.image_url, 60 * 60)

  if (signedError && !isCommunitySchemaError(signedError)) {
    throw signedError
  }

  return {
    ...safeCard,
    signedUrl: signed?.signedUrl ?? null,
  }
}

function mapRelationshipRowToCommunityCard(
  row: CommunityCardRelationshipIndexRow,
): CommunityCardRelationshipRecord {
  return {
    card_id: row.related_card_id,
    session_id: row.related_session_id,
    image_url: row.related_image_url,
    title: row.related_title,
    published_at: row.related_published_at,
    published_by: row.related_published_by,
    community_template: row.related_community_template,
    category: row.related_category,
    concept: row.related_concept,
    author_name: row.related_author_name,
    author_avatar_url: row.related_author_avatar_url,
    like_count: row.related_like_count ?? 0,
    save_count: row.related_save_count ?? 0,
    report_count: row.related_report_count ?? 0,
    trend_score: row.related_trend_score ?? 0,
    clarification_open_count: 0,
    clarification_resolved_count: 0,
    has_unresolved_correction: false,
    relationship_type: row.relationship_type,
    relationship_reason: row.relationship_reason,
    relationship_strength: row.relationship_strength,
  }
}

export async function getRelatedCommunityCards(cardId: string, limit: number = 4) {
  const safeLimit = Math.max(1, Math.min(limit, 8))
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('community_card_relationship_index')
    .select(
      'card_id, related_card_id, relationship_type, relationship_reason, relationship_strength, related_session_id, related_image_url, related_title, related_published_at, related_published_by, related_community_template, related_category, related_concept, related_author_name, related_author_avatar_url, related_like_count, related_save_count, related_report_count, related_trend_score',
    )
    .eq('card_id', cardId)
    .order('relationship_strength', { ascending: false })
    .order('related_trend_score', { ascending: false })
    .limit(safeLimit * 3)

  if (error) {
    if (isCommunitySchemaError(error)) {
      return [] as CommunityCardRelationshipRecord[]
    }

    throw error
  }

  const deduped = new Map<string, CommunityCardRelationshipRecord>()
  for (const row of (data ?? []) as CommunityCardRelationshipIndexRow[]) {
    if (deduped.has(row.related_card_id)) {
      continue
    }

    deduped.set(row.related_card_id, mapRelationshipRowToCommunityCard(row))

    if (deduped.size >= safeLimit) {
      break
    }
  }

  return [...deduped.values()]
}

export async function getCommunityLibraries(limit: number = 6, authorId?: string | null) {
  const supabase = createPublicClient()
  let query = supabase
    .from('community_library_index')
    .select(
      'session_id, cover_image_url, title, published_at, published_by, author_name, author_avatar_url, card_count, like_count, save_count, report_count, trend_score, category, concept',
    )
    .order('published_at', { ascending: false })
    .limit(limit)

  const normalizedAuthorId = normalizeValue(authorId)

  if (normalizedAuthorId) {
    query = query.eq('published_by', normalizedAuthorId)
  }

  const { data, error } = await query

  if (error) {
    if (isCommunitySchemaError(error)) {
      return [] as CommunityLibraryRecord[]
    }

    throw error
  }

  return (data ?? []) as CommunityLibraryRecord[]
}

export async function getCommunityLibraryCount(authorId?: string | null) {
  const supabase = createPublicClient()
  let query = supabase
    .from('community_library_index')
    .select('session_id', { count: 'exact', head: true })

  const normalizedAuthorId = normalizeValue(authorId)

  if (normalizedAuthorId) {
    query = query.eq('published_by', normalizedAuthorId)
  }

  const { count, error } = await query

  if (error) {
    if (isCommunitySchemaError(error)) {
      return 0
    }

    throw error
  }

  return count ?? 0
}

export async function getCommunityLibrariesWithUrls(limit: number = 6, authorId?: string | null) {
  const libraries = await getCommunityLibraries(limit, authorId)
  const uniquePaths = [...new Set(libraries.map((library) => library.cover_image_url).filter(Boolean))]
  let signedUrls: Record<string, string> = createDirectAssetUrlMap(uniquePaths)
  const storagePaths = uniquePaths.filter((path) => !isDirectAssetUrl(path))

  if (storagePaths.length > 0) {
    const supabase = createPublicClient()
    const { data, error } = await supabase.storage.from('cards').createSignedUrls(storagePaths, 60 * 60)

    if (error) {
      if (!isCommunitySchemaError(error)) {
        throw error
      }
    } else {
      signedUrls = {
        ...signedUrls,
        ...Object.fromEntries(
          (data ?? [])
            .filter((row) => typeof row.path === 'string')
            .map((row) => {
              const path = row.path as string
              return [
                path,
                row.signedUrl ?? signedUrls[path] ?? '',
              ]
            }),
        ),
      }
    }
  }

  return {
    libraries,
    signedUrls,
  }
}

export async function getCommunityLibraryById(sessionId: string) {
  const publicClient = createPublicClient()
  const { data: library, error } = await publicClient
    .from('community_library_index')
    .select(
      'session_id, cover_image_url, title, published_at, published_by, author_name, author_avatar_url, card_count, like_count, save_count, report_count, trend_score, category, concept',
    )
    .eq('session_id', sessionId)
    .maybeSingle()

  if (error) {
    if (isCommunitySchemaError(error)) {
      return null
    }

    throw error
  }

  if (!library) {
    return null
  }

  const typedLibrary = library as CommunityLibraryRecord
  const cards = await getCommunityCards(
    0,
    Math.max(typedLibrary.card_count || 1, 1),
    { sessionId },
  )

  return {
    library: typedLibrary,
    cards,
  }
}

export async function toggleCommunityReaction(cardId: string, kind: CommunityReactionKind) {
  const { supabase, user } = await ensureCurrentUserProfile()

  const { data: existing, error: fetchError } = await supabase
    .from('community_reactions')
    .select('id')
    .eq('card_id', cardId)
    .eq('user_id', user.id)
    .eq('kind', kind)
    .maybeSingle()

  if (fetchError) {
    if (isCommunitySchemaError(fetchError)) {
      throw new Error('Community reactions are not available yet.')
    }

    throw fetchError
  }

  if (existing?.id) {
    const { error } = await supabase
      .from('community_reactions')
      .delete()
      .eq('id', existing.id)

    if (error) throw error

    if (kind === 'save') {
      const { error: reviewError } = await supabase
        .from('review_items')
        .delete()
        .eq('user_id', user.id)
        .eq('card_id', cardId)
        .eq('source_type', 'saved_community')

      if (reviewError && !isReviewSchemaError(reviewError)) {
        console.error('Could not remove saved community review item', reviewError)
      }
    }

    revalidateCommunityPaths()
    return { active: false }
  }

  const { error } = await supabase
    .from('community_reactions')
    .insert({
      card_id: cardId,
      user_id: user.id,
      kind,
    })

  if (error) {
    if (isCommunitySchemaError(error)) {
      throw new Error('Community reactions are not available yet.')
    }

    throw error
  }

  if (kind === 'save') {
    try {
      await ensureReviewItemExists(supabase, {
        userId: user.id,
        cardId,
        sourceType: 'saved_community',
      })
    } catch (reviewError) {
      console.error('Could not create saved community review item', reviewError)
    }

    await trackProductEvent({
      eventName: 'community_card_saved',
      userId: user.id,
      cardId,
      includeClarificationSummary: true,
      supabase,
    })
  }

  revalidateCommunityPaths()
  return { active: true }
}

export async function reportCommunityCard(cardId: string) {
  const { supabase, user } = await ensureCurrentUserProfile()

  const { data: existing, error: existingError } = await supabase
    .from('community_reports')
    .select('id')
    .eq('card_id', cardId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingError) {
    if (isCommunitySchemaError(existingError)) {
      throw new Error('Community reports are not available yet.')
    }

    throw existingError
  }

  if (existing?.id) {
    return { reported: true }
  }

  const { error } = await supabase
    .from('community_reports')
    .insert({
      card_id: cardId,
      user_id: user.id,
    })

  if (error) {
    if (isCommunitySchemaError(error)) {
      throw new Error('Community reports are not available yet.')
    }

    throw error
  }

  revalidateCommunityPaths()
  return { reported: true }
}

export async function toggleCommunityLibraryReaction(sessionId: string, kind: CommunityReactionKind) {
  const { supabase, user } = await ensureCurrentUserProfile()

  const { data: existing, error: fetchError } = await supabase
    .from('community_library_reactions')
    .select('id')
    .eq('session_id', sessionId)
    .eq('user_id', user.id)
    .eq('kind', kind)
    .maybeSingle()

  if (fetchError) {
    if (isCommunitySchemaError(fetchError)) {
      throw new Error('Community library reactions are not available yet.')
    }

    throw fetchError
  }

  if (existing?.id) {
    const { error } = await supabase
      .from('community_library_reactions')
      .delete()
      .eq('id', existing.id)

    if (error) {
      if (isCommunitySchemaError(error)) {
        throw new Error('Community library reactions are not available yet.')
      }

      throw error
    }

    revalidateCommunityPaths(sessionId)
    return { active: false }
  }

  const { error } = await supabase
    .from('community_library_reactions')
    .insert({
      session_id: sessionId,
      user_id: user.id,
      kind,
    })

  if (error) {
    if (isCommunitySchemaError(error)) {
      throw new Error('Community library reactions are not available yet.')
    }

    throw error
  }

  revalidateCommunityPaths(sessionId)
  return { active: true }
}

export async function reportCommunityLibrary(sessionId: string) {
  const { supabase, user } = await ensureCurrentUserProfile()

  const { data: existing, error: existingError } = await supabase
    .from('community_library_reports')
    .select('id')
    .eq('session_id', sessionId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingError) {
    if (isCommunitySchemaError(existingError)) {
      throw new Error('Community library reports are not available yet.')
    }

    throw existingError
  }

  if (existing?.id) {
    return { reported: true }
  }

  const { error } = await supabase
    .from('community_library_reports')
    .insert({
      session_id: sessionId,
      user_id: user.id,
    })

  if (error) {
    if (isCommunitySchemaError(error)) {
      throw new Error('Community library reports are not available yet.')
    }

    throw error
  }

  revalidateCommunityPaths(sessionId)
  return { reported: true }
}

export async function fetchCommunityCardsWithUrls(
  page: number = 0,
  limit: number = 20,
  options: CommunityQueryOptions = {},
) {
  const cards = await getCommunityCards(page, limit, options)
  const safeCards = cards ?? []

  const uniquePaths = [...new Set(safeCards.map((card) => card.image_url).filter(Boolean))]
  let signedUrls: Record<string, string> = createDirectAssetUrlMap(uniquePaths)
  const storagePaths = uniquePaths.filter((path) => !isDirectAssetUrl(path))

  if (storagePaths.length > 0) {
    const supabase = createPublicClient()
    const { data, error } = await supabase.storage.from('cards').createSignedUrls(storagePaths, 60 * 60)

    if (error) {
      if (!isCommunitySchemaError(error)) {
        throw error
      }
    } else {
      signedUrls = storagePaths.reduce<Record<string, string>>((acc, path, index) => {
        const signedUrl = data?.[index]?.signedUrl
        if (signedUrl) {
          acc[path] = signedUrl
        }
        return acc
      }, signedUrls)
    }
  }

  return { cards: safeCards, signedUrls }
}
