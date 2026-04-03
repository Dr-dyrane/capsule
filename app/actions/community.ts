'use server'

import { revalidatePath } from 'next/cache'

import { isCommunitySchemaError } from '@/lib/community/schema'
import { createPublicClient } from '@/lib/supabase/public'
import { createClient } from '@/lib/supabase/server'
import type {
  CardRecord,
  CommunityFilterMeta,
  CommunityIndexRecord,
  CommunityReactionKind,
  CommunitySort,
  CommunityViewerState,
  CommunityVisibility,
  ProfileRecord,
} from '@/lib/types'

export type CommunityCardRecord = CommunityIndexRecord

export type CommunityQueryOptions = {
  search?: string
  template?: string | null
  category?: string | null
  topic?: string | null
  sort?: CommunitySort
  savedOnly?: boolean
  authorId?: string | null
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

  if (sessionId) {
    revalidatePath(`/scan/${sessionId}`)
  }

  if (cardId) {
    revalidatePath(`/cards/${cardId}`)
  }
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

  return cards.map((card) => {
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
}

export async function publishCard(cardId: string) {
  const { supabase, user } = await ensureCurrentUserProfile()

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

  revalidateCommunityPaths(null, cardId)
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

  return (data ?? []) as CommunityCardRecord[]
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

  const cards = (data ?? []) as CommunityCardRecord[]
  const uniquePaths = [...new Set(cards.map((card) => card.image_url).filter(Boolean))]
  let signedUrls: Record<string, string> = {}

  if (uniquePaths.length > 0) {
    const { data: signed, error: signedError } = await publicClient.storage
      .from('cards')
      .createSignedUrls(uniquePaths, 60 * 60)

    if (!signedError) {
      signedUrls = uniquePaths.reduce<Record<string, string>>((acc, path, index) => {
        const signedUrl = signed?.[index]?.signedUrl
        if (signedUrl) {
          acc[path] = signedUrl
        }
        return acc
      }, {})
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

  const { data: signed, error: signedError } = await supabase.storage
    .from('cards')
    .createSignedUrl(card.image_url, 60 * 60)

  if (signedError && !isCommunitySchemaError(signedError)) {
    throw signedError
  }

  return {
    ...card,
    signedUrl: signed?.signedUrl ?? null,
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

export async function fetchCommunityCardsWithUrls(
  page: number = 0,
  limit: number = 20,
  options: CommunityQueryOptions = {},
) {
  const cards = await getCommunityCards(page, limit, options)
  const safeCards = cards ?? []

  const uniquePaths = [...new Set(safeCards.map((card) => card.image_url).filter(Boolean))]
  let signedUrls: Record<string, string> = {}

  if (uniquePaths.length > 0) {
    const supabase = createPublicClient()
    const { data, error } = await supabase.storage.from('cards').createSignedUrls(uniquePaths, 60 * 60)

    if (error) {
      if (!isCommunitySchemaError(error)) {
        throw error
      }
    } else {
      signedUrls = uniquePaths.reduce<Record<string, string>>((acc, path, index) => {
        const signedUrl = data?.[index]?.signedUrl
        if (signedUrl) {
          acc[path] = signedUrl
        }
        return acc
      }, {})
    }
  }

  return { cards: safeCards, signedUrls }
}
