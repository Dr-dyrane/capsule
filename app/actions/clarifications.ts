'use server'

import { revalidatePath } from 'next/cache'

import { trackProductEvent } from '@/lib/analytics/events'
import {
  getClarificationEvidenceFile,
  removeClarificationEvidenceFiles,
  uploadClarificationEvidenceFile,
} from '@/lib/clarifications/evidence'
import { isClarificationSchemaError } from '@/lib/clarifications/schema'
import { createSignedObjectUrlsSafe } from '@/lib/storage/signed-urls'
import { createPublicClient } from '@/lib/supabase/public'
import { createClient } from '@/lib/supabase/server'
import type {
  CardClarificationItemRecord,
  CardClarificationModerationItem,
  CardClarificationModerationResult,
  CardClarificationItemView,
  CardClarificationListResult,
  CardClarificationThreadRecord,
  ClarificationKind,
  ProfileRecord,
} from '@/lib/types'

type PublishedCardMeta = {
  id: string
  published_by: string | null
}

const MAX_CLARIFICATION_BODY_LENGTH = 1200

function toClarificationsUnsupportedError() {
  return new Error('Card clarifications are not available yet.')
}

function normalizeClarificationBody(body: string) {
  return body.replace(/\r\n/g, '\n').trim()
}

function ensureClarificationBody(body: string) {
  const normalized = normalizeClarificationBody(body)

  if (normalized.length < 3) {
    throw new Error('Write a little more before posting.')
  }

  if (normalized.length > MAX_CLARIFICATION_BODY_LENGTH) {
    throw new Error('Keep clarifications under 1200 characters.')
  }

  return normalized
}

function revalidateClarificationPaths(cardId: string) {
  revalidatePath('/community')
  revalidatePath('/community/reports')
  revalidatePath(`/community/${cardId}`)
}

async function ensureAuthenticatedUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return { supabase, user }
}

async function getPublishedCardMeta(cardId: string) {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('cards')
    .select('id, published_by')
    .eq('id', cardId)
    .eq('visibility', 'published')
    .eq('status', 'complete')
    .maybeSingle()

  if (error) {
    if (isClarificationSchemaError(error)) {
      return null
    }

    throw error
  }

  return (data ?? null) as PublishedCardMeta | null
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
    return new Map<string, Pick<ProfileRecord, 'username' | 'avatar_url'>>()
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

function sortClarificationThreads(a: CardClarificationThreadRecord, b: CardClarificationThreadRecord) {
  if (a.status !== b.status) {
    return a.status === 'open' ? -1 : 1
  }

  return new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime()
}

function toItemView(
  item: CardClarificationItemRecord,
  viewerId: string,
  cardOwnerId: string | null,
  profilesById: Map<string, Pick<ProfileRecord, 'username' | 'avatar_url'>>,
  reportedItemIds: Set<string>,
  evidenceUrls: Record<string, string>,
): CardClarificationItemView {
  const profile = profilesById.get(item.user_id)
  const hasReported = reportedItemIds.has(item.id)

  return {
    id: item.id,
    thread_id: item.thread_id,
    user_id: item.user_id,
    parent_item_id: item.parent_item_id,
    body: item.body,
    evidence_image_url: item.evidence_image_path ? evidenceUrls[item.evidence_image_path] ?? null : null,
    status: item.status,
    created_at: item.created_at,
    updated_at: item.updated_at,
    author_name: profile?.username ?? 'Capsule learner',
    author_avatar_url: profile?.avatar_url ?? null,
    author_is_card_owner: cardOwnerId === item.user_id,
    can_delete: item.user_id === viewerId && item.status === 'active',
    can_report: item.user_id !== viewerId && item.status === 'active' && !hasReported,
    has_reported: hasReported,
  }
}

async function createClarificationItemRecord({
  supabase,
  threadId,
  cardId,
  userId,
  body,
  parentItemId = null,
  evidenceFile = null,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  threadId: string
  cardId: string
  userId: string
  body: string
  parentItemId?: string | null
  evidenceFile?: File | null
}) {
  let evidenceImagePath: string | null = null

  try {
    if (evidenceFile) {
      evidenceImagePath = await uploadClarificationEvidenceFile(userId, cardId, evidenceFile)
    }

    const { data, error } = await supabase
      .from('card_clarification_items')
      .insert({
        thread_id: threadId,
        card_id: cardId,
        user_id: userId,
        parent_item_id: parentItemId,
        body,
        evidence_image_path: evidenceImagePath,
      })
      .select('id, evidence_image_path')
      .single()

    if (error) {
      if (isClarificationSchemaError(error)) {
        throw toClarificationsUnsupportedError()
      }

      throw error
    }

    return data as Pick<CardClarificationItemRecord, 'id' | 'evidence_image_path'>
  } catch (error) {
    await removeClarificationEvidenceFiles([evidenceImagePath])
    throw error
  }
}

function getCreateClarificationPayload(formData: FormData) {
  const cardId = formData.get('cardId')
  const kind = formData.get('kind')
  const body = formData.get('body')

  if (typeof cardId !== 'string' || typeof kind !== 'string' || typeof body !== 'string') {
    throw new Error('Clarification details are incomplete.')
  }

  if (!['question', 'clarification', 'correction'].includes(kind)) {
    throw new Error('Choose a valid clarification type.')
  }

  return {
    cardId,
    kind: kind as ClarificationKind,
    body,
    evidenceFile: getClarificationEvidenceFile(formData.get('evidence')),
  }
}

function getReplyClarificationPayload(formData: FormData) {
  const threadId = formData.get('threadId')
  const body = formData.get('body')

  if (typeof threadId !== 'string' || typeof body !== 'string') {
    throw new Error('Reply details are incomplete.')
  }

  return {
    threadId,
    body,
    evidenceFile: getClarificationEvidenceFile(formData.get('evidence')),
  }
}

async function markClarificationThreadRemoved(
  supabase: Awaited<ReturnType<typeof createClient>>,
  threadId: string,
) {
  const { error } = await supabase
    .from('card_clarification_threads')
    .update({ status: 'removed' })
    .eq('id', threadId)

  if (error && !isClarificationSchemaError(error)) {
    console.error('Failed to cleanup clarification thread:', error)
  }
}

export async function getCardClarifications(cardId: string): Promise<CardClarificationListResult> {
  const card = await getPublishedCardMeta(cardId)

  if (!card) {
    return {
      supported: false,
      open_count: 0,
      resolved_count: 0,
      evidence_count: 0,
      threads: [],
    }
  }

  const { supabase, user } = await ensureAuthenticatedUser()
  const { data: threadRows, error: threadError } = await supabase
    .from('card_clarification_threads')
    .select(
      'id, card_id, created_by, kind, status, root_item_id, reply_count, last_activity_at, resolved_by, resolved_at, created_at, updated_at',
    )
    .eq('card_id', cardId)
    .neq('status', 'removed')

  if (threadError) {
    if (isClarificationSchemaError(threadError)) {
      return {
        supported: false,
        open_count: 0,
        resolved_count: 0,
        evidence_count: 0,
        threads: [],
      }
    }

    throw threadError
  }

  const rawThreads = ((threadRows ?? []) as CardClarificationThreadRecord[]).sort(sortClarificationThreads)
  const threadIds = rawThreads.map((thread) => thread.id)

  if (threadIds.length === 0) {
    return {
      supported: true,
      open_count: 0,
      resolved_count: 0,
      evidence_count: 0,
      threads: [],
    }
  }

  const { data: itemRows, error: itemError } = await supabase
    .from('card_clarification_items')
    .select('id, thread_id, card_id, user_id, parent_item_id, body, evidence_image_path, status, created_at, updated_at')
    .in('thread_id', threadIds)
    .order('created_at', { ascending: true })

  if (itemError) {
    if (isClarificationSchemaError(itemError)) {
      return {
        supported: false,
        open_count: 0,
        resolved_count: 0,
        evidence_count: 0,
        threads: [],
      }
    }

    throw itemError
  }

  const rawItems = (itemRows ?? []) as CardClarificationItemRecord[]
  const itemIds = rawItems.map((item) => item.id)
  const evidenceUrls = await createSignedObjectUrlsSafe(
    'clarifications',
    rawItems.map((item) => item.evidence_image_path ?? ''),
  )
  const { data: reportRows, error: reportError } = itemIds.length
    ? await supabase
        .from('card_clarification_reports')
        .select('item_id')
        .in('item_id', itemIds)
        .eq('user_id', user.id)
    : { data: [], error: null }

  if (reportError) {
    if (!isClarificationSchemaError(reportError)) {
      throw reportError
    }
  }

  const reportedItemIds = new Set((reportRows ?? []).map((row) => row.item_id))
  const profilesById = await fetchProfilesById([
    ...new Set(rawItems.map((item) => item.user_id)),
  ])

  const itemsByThread = rawItems.reduce<Map<string, CardClarificationItemRecord[]>>((acc, item) => {
    const current = acc.get(item.thread_id) ?? []
    current.push(item)
    acc.set(item.thread_id, current)
    return acc
  }, new Map())

  const threads = rawThreads
    .map((thread) => {
      const threadItems = itemsByThread.get(thread.id) ?? []
      const rootRecord =
        threadItems.find((item) => item.id === thread.root_item_id) ??
        threadItems.find((item) => item.parent_item_id === null)

      if (!rootRecord || rootRecord.status !== 'active') {
        return null
      }

      const root = toItemView(rootRecord, user.id, card.published_by, profilesById, reportedItemIds, evidenceUrls)
      const replies = threadItems
        .filter((item) => item.parent_item_id !== null && item.status === 'active')
        .map((item) =>
          toItemView(item, user.id, card.published_by, profilesById, reportedItemIds, evidenceUrls),
        )

      return {
        id: thread.id,
        card_id: thread.card_id,
        created_by: thread.created_by,
        kind: thread.kind,
        status: thread.status,
        reply_count: replies.length,
        last_activity_at: thread.last_activity_at,
        resolved_by: thread.resolved_by,
        resolved_at: thread.resolved_at,
        created_at: thread.created_at,
        root,
        replies,
        can_reply: thread.status === 'open',
        can_resolve: thread.status === 'open' && card.published_by === user.id,
      }
    })
    .filter((thread): thread is NonNullable<typeof thread> => Boolean(thread))

  return {
    supported: true,
    open_count: threads.filter((thread) => thread.status === 'open').length,
    resolved_count: threads.filter((thread) => thread.status === 'resolved').length,
    evidence_count: threads.reduce((count, thread) => {
      const rootCount = thread.root?.evidence_image_url ? 1 : 0
      const replyCount = thread.replies.filter((reply) => Boolean(reply.evidence_image_url)).length
      return count + rootCount + replyCount
    }, 0),
    threads,
  }
}

export async function createClarification(cardId: string, kind: ClarificationKind, body: string) {
  const normalizedBody = ensureClarificationBody(body)
  const card = await getPublishedCardMeta(cardId)

  if (!card) {
    throw new Error('This card is not available for clarification.')
  }

  const { supabase, user } = await ensureAuthenticatedUser()
  const { data: thread, error: threadError } = await supabase
    .from('card_clarification_threads')
    .insert({
      card_id: cardId,
      created_by: user.id,
      kind,
      status: 'open',
    })
    .select('id, card_id, created_by, kind, status, root_item_id, reply_count, last_activity_at, resolved_by, resolved_at, created_at, updated_at')
    .single()

  if (threadError) {
    if (isClarificationSchemaError(threadError)) {
      throw toClarificationsUnsupportedError()
    }

    throw threadError
  }

  let rootItem: Pick<CardClarificationItemRecord, 'id' | 'evidence_image_path'>

  try {
    rootItem = await createClarificationItemRecord({
      supabase,
      threadId: thread.id,
      cardId,
      userId: user.id,
      body: normalizedBody,
    })
  } catch (error) {
    await markClarificationThreadRemoved(supabase, thread.id)
    throw error
  }

  const { error: rootLinkError } = await supabase
    .from('card_clarification_threads')
    .update({ root_item_id: rootItem.id })
    .eq('id', thread.id)

  if (rootLinkError && !isClarificationSchemaError(rootLinkError)) {
    await markClarificationThreadRemoved(supabase, thread.id)
    throw rootLinkError
  }

  await trackProductEvent({
    eventName: 'clarification_created',
    userId: user.id,
    cardId,
    properties: { kind },
    includeClarificationSummary: true,
    supabase,
  })

  revalidateClarificationPaths(cardId)
  return { created: true }
}

export async function createClarificationWithEvidence(formData: FormData) {
  const { cardId, kind, body, evidenceFile } = getCreateClarificationPayload(formData)
  const normalizedBody = ensureClarificationBody(body)
  const card = await getPublishedCardMeta(cardId)

  if (!card) {
    throw new Error('This card is not available for clarification.')
  }

  const { supabase, user } = await ensureAuthenticatedUser()
  const { data: thread, error: threadError } = await supabase
    .from('card_clarification_threads')
    .insert({
      card_id: cardId,
      created_by: user.id,
      kind,
      status: 'open',
    })
    .select('id, card_id, created_by, kind, status, root_item_id, reply_count, last_activity_at, resolved_by, resolved_at, created_at, updated_at')
    .single()

  if (threadError) {
    if (isClarificationSchemaError(threadError)) {
      throw toClarificationsUnsupportedError()
    }

    throw threadError
  }

  let rootItem: Pick<CardClarificationItemRecord, 'id' | 'evidence_image_path'>

  try {
    rootItem = await createClarificationItemRecord({
      supabase,
      threadId: thread.id,
      cardId,
      userId: user.id,
      body: normalizedBody,
      evidenceFile,
    })
  } catch (error) {
    await markClarificationThreadRemoved(supabase, thread.id)
    throw error
  }

  const { error: rootLinkError } = await supabase
    .from('card_clarification_threads')
    .update({ root_item_id: rootItem.id })
    .eq('id', thread.id)

  if (rootLinkError && !isClarificationSchemaError(rootLinkError)) {
    await markClarificationThreadRemoved(supabase, thread.id)
    throw rootLinkError
  }

  await trackProductEvent({
    eventName: 'clarification_created',
    userId: user.id,
    cardId,
    properties: { kind },
    includeClarificationSummary: true,
    supabase,
  })

  if (rootItem.evidence_image_path) {
    await trackProductEvent({
      eventName: 'clarification_evidence_attached',
      userId: user.id,
      cardId,
      properties: {
        kind,
        mode: 'create',
      },
      includeClarificationSummary: true,
      supabase,
    })
  }

  revalidateClarificationPaths(cardId)
  return { created: true }
}

export async function replyToClarification(threadId: string, body: string) {
  const normalizedBody = ensureClarificationBody(body)
  const { supabase, user } = await ensureAuthenticatedUser()
  const { data: thread, error: threadError } = await supabase
    .from('card_clarification_threads')
    .select('id, card_id, root_item_id, status, kind')
    .eq('id', threadId)
    .maybeSingle()

  if (threadError) {
    if (isClarificationSchemaError(threadError)) {
      throw toClarificationsUnsupportedError()
    }

    throw threadError
  }

  if (!thread?.card_id || !thread.root_item_id || thread.status !== 'open') {
    throw new Error('This clarification is no longer open for replies.')
  }

  await createClarificationItemRecord({
    supabase,
    threadId: thread.id,
    cardId: thread.card_id,
    userId: user.id,
    parentItemId: thread.root_item_id,
    body: normalizedBody,
  })

  await trackProductEvent({
    eventName: 'clarification_reply_created',
    userId: user.id,
    cardId: thread.card_id,
    properties: { kind: thread.kind },
    includeClarificationSummary: true,
    supabase,
  })

  revalidateClarificationPaths(thread.card_id)
  return { created: true }
}

export async function replyToClarificationWithEvidence(formData: FormData) {
  const { threadId, body, evidenceFile } = getReplyClarificationPayload(formData)
  const normalizedBody = ensureClarificationBody(body)
  const { supabase, user } = await ensureAuthenticatedUser()
  const { data: thread, error: threadError } = await supabase
    .from('card_clarification_threads')
    .select('id, card_id, root_item_id, status, kind')
    .eq('id', threadId)
    .maybeSingle()

  if (threadError) {
    if (isClarificationSchemaError(threadError)) {
      throw toClarificationsUnsupportedError()
    }

    throw threadError
  }

  if (!thread?.card_id || !thread.root_item_id || thread.status !== 'open') {
    throw new Error('This clarification is no longer open for replies.')
  }

  const replyItem = await createClarificationItemRecord({
    supabase,
    threadId: thread.id,
    cardId: thread.card_id,
    userId: user.id,
    parentItemId: thread.root_item_id,
    body: normalizedBody,
    evidenceFile,
  })

  await trackProductEvent({
    eventName: 'clarification_reply_created',
    userId: user.id,
    cardId: thread.card_id,
    properties: { kind: thread.kind },
    includeClarificationSummary: true,
    supabase,
  })

  if (replyItem.evidence_image_path) {
    await trackProductEvent({
      eventName: 'clarification_evidence_attached',
      userId: user.id,
      cardId: thread.card_id,
      properties: {
        kind: thread.kind,
        mode: 'reply',
      },
      includeClarificationSummary: true,
      supabase,
    })
  }

  revalidateClarificationPaths(thread.card_id)
  return { created: true }
}

export async function resolveClarification(threadId: string) {
  const { supabase, user } = await ensureAuthenticatedUser()
  const { data: thread, error: threadError } = await supabase
    .from('card_clarification_threads')
    .select('id, card_id, kind, status')
    .eq('id', threadId)
    .maybeSingle()

  if (threadError) {
    if (isClarificationSchemaError(threadError)) {
      throw toClarificationsUnsupportedError()
    }

    throw threadError
  }

  if (!thread?.card_id || thread.status !== 'open') {
    return { resolved: true }
  }

  const card = await getPublishedCardMeta(thread.card_id)

  if (!card || card.published_by !== user.id) {
    throw new Error('Only the card creator can resolve this clarification.')
  }

  const { error } = await supabase
    .from('card_clarification_threads')
    .update({
      status: 'resolved',
      resolved_by: user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', threadId)

  if (error) {
    if (isClarificationSchemaError(error)) {
      throw toClarificationsUnsupportedError()
    }

    throw error
  }

  await trackProductEvent({
    eventName: 'clarification_resolved',
    userId: user.id,
    cardId: thread.card_id,
    properties: { kind: thread.kind },
    includeClarificationSummary: true,
    supabase,
  })

  revalidateClarificationPaths(thread.card_id)
  return { resolved: true }
}

export async function deleteClarificationItem(itemId: string) {
  const { supabase, user } = await ensureAuthenticatedUser()
  const { data: item, error: itemError } = await supabase
    .from('card_clarification_items')
    .select('id, thread_id, card_id, user_id, parent_item_id, status, evidence_image_path')
    .eq('id', itemId)
    .maybeSingle()

  if (itemError) {
    if (isClarificationSchemaError(itemError)) {
      throw toClarificationsUnsupportedError()
    }

    throw itemError
  }

  if (!item?.card_id) {
    return { deleted: true }
  }

  if (item.user_id !== user.id) {
    throw new Error('You can only delete your own clarification.')
  }

  const { error } = await supabase
    .from('card_clarification_items')
    .update({
      body: 'Deleted',
      status: 'deleted',
    })
    .eq('id', item.id)

  if (error) {
    if (isClarificationSchemaError(error)) {
      throw toClarificationsUnsupportedError()
    }

    throw error
  }

  await removeClarificationEvidenceFiles([item.evidence_image_path])

  if (!item.parent_item_id) {
    const { error: threadError } = await supabase
      .from('card_clarification_threads')
      .update({ status: 'removed' })
      .eq('id', item.thread_id)

    if (threadError && !isClarificationSchemaError(threadError)) {
      throw threadError
    }
  }

  revalidateClarificationPaths(item.card_id)
  return { deleted: true }
}

export async function reportClarificationItem(itemId: string) {
  const { supabase, user } = await ensureAuthenticatedUser()
  const { data: item, error: itemError } = await supabase
    .from('card_clarification_items')
    .select('id, card_id, user_id')
    .eq('id', itemId)
    .maybeSingle()

  if (itemError) {
    if (isClarificationSchemaError(itemError)) {
      throw toClarificationsUnsupportedError()
    }

    throw itemError
  }

  if (!item?.card_id || item.user_id === user.id) {
    return { reported: false }
  }

  const { data: existing, error: existingError } = await supabase
    .from('card_clarification_reports')
    .select('id')
    .eq('item_id', itemId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingError) {
    if (isClarificationSchemaError(existingError)) {
      throw toClarificationsUnsupportedError()
    }

    throw existingError
  }

  if (!existing?.id) {
    const { error } = await supabase
      .from('card_clarification_reports')
      .insert({
        item_id: itemId,
        user_id: user.id,
      })

    if (error) {
      if (isClarificationSchemaError(error)) {
        throw toClarificationsUnsupportedError()
      }

      throw error
    }
  }

  revalidateClarificationPaths(item.card_id)
  return { reported: true }
}

export async function getCreatorModerationClarifications(
  limit: number = 24,
): Promise<CardClarificationModerationResult> {
  const { supabase, user } = await ensureAuthenticatedUser()
  const publicClient = createPublicClient()
  const { data: cards, error: cardsError } = await publicClient
    .from('cards')
    .select('id, title')
    .eq('published_by', user.id)
    .eq('visibility', 'published')
    .eq('status', 'complete')

  if (cardsError) {
    if (isClarificationSchemaError(cardsError)) {
      return { supported: false, items: [] }
    }

    throw cardsError
  }

  const cardRows = (cards ?? []) as Array<{ id: string; title: string | null }>
  const cardIds = cardRows.map((card) => card.id)

  if (cardIds.length === 0) {
    return { supported: true, items: [] }
  }

  const [{ data: threadRows, error: threadError }, { data: itemRows, error: itemError }] = await Promise.all([
    supabase
      .from('card_clarification_threads')
      .select('id, card_id, created_by, kind, status, root_item_id, reply_count, last_activity_at, resolved_by, resolved_at, created_at, updated_at')
      .in('card_id', cardIds)
      .neq('status', 'removed'),
    supabase
      .from('card_clarification_items')
      .select('id, thread_id, card_id, user_id, parent_item_id, body, evidence_image_path, status, created_at, updated_at')
      .in('card_id', cardIds)
      .eq('status', 'active'),
  ])

  if (threadError || itemError) {
    const error = threadError ?? itemError

    if (isClarificationSchemaError(error)) {
      return { supported: false, items: [] }
    }

    throw error
  }

  const rawThreads = (threadRows ?? []) as CardClarificationThreadRecord[]
  const rawItems = (itemRows ?? []) as CardClarificationItemRecord[]
  const itemIds = rawItems.map((item) => item.id)
  const evidenceUrls = await createSignedObjectUrlsSafe(
    'clarifications',
    rawItems.map((item) => item.evidence_image_path ?? ''),
  )

  if (itemIds.length === 0) {
    return { supported: true, items: [] }
  }

  const { data: reportRows, error: reportError } = await supabase
    .from('card_clarification_reports')
    .select('item_id')
    .in('item_id', itemIds)

  if (reportError) {
    if (isClarificationSchemaError(reportError)) {
      return { supported: false, items: [] }
    }

    throw reportError
  }

  const reportCounts = (reportRows ?? []).reduce<Map<string, number>>((acc, row) => {
    acc.set(row.item_id, (acc.get(row.item_id) ?? 0) + 1)
    return acc
  }, new Map())

  const threadById = new Map(rawThreads.map((thread) => [thread.id, thread]))
  const cardById = new Map(cardRows.map((card) => [card.id, card]))
  const reportedItems = rawItems.filter((item) => (reportCounts.get(item.id) ?? 0) > 0)
  const profilesById = await fetchProfilesById([...new Set(reportedItems.map((item) => item.user_id))])

  const moderationItems = reportedItems
    .map<CardClarificationModerationItem | null>((item) => {
      const thread = threadById.get(item.thread_id)
      const card = cardById.get(item.card_id)

      if (!thread || !card) {
        return null
      }

      const profile = profilesById.get(item.user_id)

      return {
        item_id: item.id,
        thread_id: item.thread_id,
        card_id: item.card_id,
        card_title: card.title,
        thread_kind: thread.kind,
        thread_status: thread.status,
        item_body: item.body,
        evidence_image_url: item.evidence_image_path ? evidenceUrls[item.evidence_image_path] ?? null : null,
        parent_item_id: item.parent_item_id,
        item_created_at: item.created_at,
        author_name: profile?.username ?? 'Capsule learner',
        author_avatar_url: profile?.avatar_url ?? null,
        report_count: reportCounts.get(item.id) ?? 0,
      }
    })
    .filter((item): item is CardClarificationModerationItem => Boolean(item))
    .sort((a, b) => {
      if (a.report_count !== b.report_count) {
        return b.report_count - a.report_count
      }

      return new Date(b.item_created_at).getTime() - new Date(a.item_created_at).getTime()
    })
    .slice(0, limit)

  return {
    supported: true,
    items: moderationItems,
  }
}

export async function clearClarificationReports(itemId: string) {
  const { supabase, user } = await ensureAuthenticatedUser()
  const { data: item, error: itemError } = await supabase
    .from('card_clarification_items')
    .select('id, card_id')
    .eq('id', itemId)
    .maybeSingle()

  if (itemError) {
    if (isClarificationSchemaError(itemError)) {
      throw toClarificationsUnsupportedError()
    }

    throw itemError
  }

  if (!item?.card_id) {
    return { cleared: true }
  }

  const card = await getPublishedCardMeta(item.card_id)

  if (!card || card.published_by !== user.id) {
    throw new Error('Only the card creator can review reports on this clarification.')
  }

  const { error } = await supabase
    .from('card_clarification_reports')
    .delete()
    .eq('item_id', itemId)

  if (error) {
    if (isClarificationSchemaError(error)) {
      throw toClarificationsUnsupportedError()
    }

    throw error
  }

  revalidateClarificationPaths(item.card_id)
  return { cleared: true }
}

export async function removeClarificationItemAsCreator(itemId: string) {
  const { supabase, user } = await ensureAuthenticatedUser()
  const { data: item, error: itemError } = await supabase
    .from('card_clarification_items')
    .select('id, thread_id, card_id, parent_item_id, status, evidence_image_path')
    .eq('id', itemId)
    .maybeSingle()

  if (itemError) {
    if (isClarificationSchemaError(itemError)) {
      throw toClarificationsUnsupportedError()
    }

    throw itemError
  }

  if (!item?.card_id) {
    return { removed: true }
  }

  const card = await getPublishedCardMeta(item.card_id)

  if (!card || card.published_by !== user.id) {
    throw new Error('Only the card creator can remove this clarification.')
  }

  const { error } = await supabase
    .from('card_clarification_items')
    .update({
      body: 'Removed by card author',
      status: 'deleted',
    })
    .eq('id', item.id)

  if (error) {
    if (isClarificationSchemaError(error)) {
      throw toClarificationsUnsupportedError()
    }

    throw error
  }

  await removeClarificationEvidenceFiles([item.evidence_image_path])

  if (!item.parent_item_id) {
    const { error: threadError } = await supabase
      .from('card_clarification_threads')
      .update({ status: 'removed' })
      .eq('id', item.thread_id)

    if (threadError) {
      if (isClarificationSchemaError(threadError)) {
        throw toClarificationsUnsupportedError()
      }

      throw threadError
    }
  }

  const { error: reportError } = await supabase
    .from('card_clarification_reports')
    .delete()
    .eq('item_id', item.id)

  if (reportError) {
    if (isClarificationSchemaError(reportError)) {
      throw toClarificationsUnsupportedError()
    }

    throw reportError
  }

  revalidateClarificationPaths(item.card_id)
  return { removed: true }
}
