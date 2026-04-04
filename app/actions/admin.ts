'use server'

import 'server-only'

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { revalidatePath } from 'next/cache'

import { isCapsuleAdminEmail, syncCurrentUserDirectory } from '@/lib/billing/entitlements'
import { isAnalyticsSchemaError } from '@/lib/analytics/schema'
import { createClient } from '@/lib/supabase/server'
import type { EntitlementGrantRecord, FundingSource, EntitlementPlan, UserDirectoryRecord, UserEntitlementRecord } from '@/lib/types'

const DEMO_PREFIX = '/demo/community-seed/'
const ANALYTICS_WINDOW_DAYS = 14
const PRODUCT_EVENT_ORDER = [
  'clarification_panel_viewed',
  'clarification_created',
  'clarification_reply_created',
  'clarification_resolved',
  'clarification_evidence_attached',
  'community_card_saved',
  'community_card_remix_started',
  'review_item_scored',
] as const
const FOLLOW_ON_EVENT_NAMES = new Set([
  'community_card_saved',
  'community_card_remix_started',
  'review_item_scored',
])
const CLARIFICATION_AUTHOR_EVENT_NAMES = new Set([
  'clarification_created',
  'clarification_reply_created',
  'clarification_resolved',
  'clarification_evidence_attached',
])

type ProductEventName = (typeof PRODUCT_EVENT_ORDER)[number]

type ProductEventRow = {
  id: string
  user_id: string
  event_name: ProductEventName | string
  card_id: string | null
  session_id: string | null
  properties: Record<string, unknown> | null
  created_at: string
}

export type AdminAnalyticsSnapshot = {
  supported: boolean
  windowDays: number
  totalEvents: number
  activeUsers: number
  cardsTouched: number
  clarificationAuthors: number
  clarifiedFollowOnCount: number
  unresolvedCorrectionFollowOnCount: number
  clarifiedActions: {
    saves: number
    remixes: number
    reviews: number
  }
  eventCounts: Array<{
    eventName: ProductEventName
    count: number
  }>
  recentEvents: Array<{
    id: string
    eventName: ProductEventName | string
    createdAt: string
    cardId: string | null
    detail: string | null
  }>
}

function getContentType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase()

  if (extension === '.png') return 'image/png'
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg'
  if (extension === '.webp') return 'image/webp'

  return 'application/octet-stream'
}

function toStoragePath(userId: string, assetPath: string) {
  const normalized = assetPath.replace(/^\/+/, '')
  const scoped = normalized.replace(/^demo\/community-seed\//, 'community-seed/')
  return `${userId}/${scoped}`
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

async function ensureAdminUser() {
  const { supabase, user } = await ensureAuthenticatedUser()

  await syncCurrentUserDirectory(supabase, user)

  if (!isCapsuleAdminEmail(user.email)) {
    throw new Error('Unauthorized')
  }

  return { supabase, user }
}

function normalizeSingleRow<T>(data: unknown) {
  if (Array.isArray(data)) {
    return (data[0] ?? null) as T | null
  }

  return (data ?? null) as T | null
}

function toProductEventProperties(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {} as Record<string, unknown>
  }

  return value as Record<string, unknown>
}

function getNumericProperty(properties: Record<string, unknown>, key: string) {
  const value = properties[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function hasClarificationContext(properties: Record<string, unknown>) {
  return (
    getNumericProperty(properties, 'clarification_open_count') > 0 ||
    getNumericProperty(properties, 'clarification_resolved_count') > 0 ||
    getNumericProperty(properties, 'clarification_evidence_count') > 0
  )
}

function getRecentEventDetail(row: ProductEventRow) {
  const properties = toProductEventProperties(row.properties)

  if (typeof properties.kind === 'string') {
    return properties.kind
  }

  if (row.event_name === 'review_item_scored') {
    const score = typeof properties.score === 'string' ? properties.score : null
    const nextState = typeof properties.next_state === 'string' ? properties.next_state : null

    if (score && nextState) {
      return `${score} -> ${nextState}`
    }

    return score ?? nextState
  }

  if (row.event_name === 'community_card_remix_started') {
    return properties.publish === true ? 'publish on' : 'publish off'
  }

  return null
}

export async function getLegacySeedMigrationStatus() {
  const { supabase } = await ensureAdminUser()

  const [{ data: sessions, error: sessionsError }, { data: cards, error: cardsError }] = await Promise.all([
    supabase
      .from('sessions')
      .select('source_url')
      .like('source_url', `${DEMO_PREFIX}%`),
    supabase
      .from('cards')
      .select('image_url')
      .like('image_url', `${DEMO_PREFIX}%`),
  ])

  if (sessionsError) throw sessionsError
  if (cardsError) throw cardsError

  const notePaths = [...new Set((sessions ?? []).map((row) => row.source_url).filter(Boolean))]
  const cardPaths = [...new Set((cards ?? []).map((row) => row.image_url).filter(Boolean))]

  return {
    noteCount: notePaths.length,
    cardCount: cardPaths.length,
    isPending: notePaths.length + cardPaths.length > 0,
  }
}

export async function migrateLegacySeedAssetsToStorage() {
  const { supabase, user } = await ensureAdminUser()

  const [{ data: sessionRows, error: sessionsError }, { data: cardRows, error: cardsError }] = await Promise.all([
    supabase
      .from('sessions')
      .select('id, source_url')
      .like('source_url', `${DEMO_PREFIX}%`),
    supabase
      .from('cards')
      .select('id, image_url')
      .like('image_url', `${DEMO_PREFIX}%`),
  ])

  if (sessionsError) throw sessionsError
  if (cardsError) throw cardsError

  const noteRows = (sessionRows ?? []) as Array<{ id: string; source_url: string }>
  const imageRows = (cardRows ?? []) as Array<{ id: string; image_url: string }>

  const notePaths = [...new Set(noteRows.map((row) => row.source_url).filter(Boolean))]
  const cardPaths = [...new Set(imageRows.map((row) => row.image_url).filter(Boolean))]
  const uploads = [
    ...notePaths.map((assetPath) => ({ bucket: 'notes' as const, assetPath })),
    ...cardPaths.map((assetPath) => ({ bucket: 'cards' as const, assetPath })),
  ]

  const rewritten = new Map<string, string>()

  for (const upload of uploads) {
    const localPath = path.join(process.cwd(), 'public', upload.assetPath.replace(/^\/+/, ''))
    const storagePath = toStoragePath(user.id, upload.assetPath)
    const file = await readFile(localPath)

    const { error } = await supabase.storage
      .from(upload.bucket)
      .upload(storagePath, file, {
        upsert: true,
        contentType: getContentType(localPath),
        cacheControl: '31536000',
      })

    if (error) {
      throw error
    }

    rewritten.set(upload.assetPath, storagePath)
  }

  for (const row of noteRows) {
    const nextPath = rewritten.get(row.source_url)
    if (!nextPath) continue

    const { error } = await supabase
      .from('sessions')
      .update({ source_url: nextPath })
      .eq('id', row.id)

    if (error) throw error
  }

  for (const row of imageRows) {
    const nextPath = rewritten.get(row.image_url)
    if (!nextPath) continue

    const { error } = await supabase
      .from('cards')
      .update({ image_url: nextPath })
      .eq('id', row.id)

    if (error) throw error
  }

  revalidatePath('/')
  revalidatePath('/community')
  revalidatePath('/library')
  revalidatePath('/profile')

  return {
    migratedNotes: notePaths.length,
    migratedCards: cardPaths.length,
  }
}

type GrantAccessInput = {
  email: string
  supportRenders?: number
  premiumRenders?: number
  plan?: EntitlementPlan
  fundingSource?: FundingSource
  notes?: string
  expiresAt?: string | null
}

export async function getAccessAdminSnapshot(email?: string) {
  const { supabase } = await ensureAdminUser()

  const normalizedEmail = email?.trim().toLowerCase()

  const grantsQuery = supabase
    .from('entitlement_grants')
    .select('id, user_id, granted_by, grant_type, support_renders, premium_renders, plan, funding_source, reason, source_reference, expires_at, created_at')
    .order('created_at', { ascending: false })
    .limit(12)

  const targetPromise = normalizedEmail
    ? supabase
        .from('user_directory')
        .select('user_id, email, display_name, avatar_url, updated_at')
        .eq('email', normalizedEmail)
        .maybeSingle()
    : Promise.resolve({ data: null, error: null })

  const [{ data: grants, error: grantsError }, targetResult] = await Promise.all([
    grantsQuery,
    targetPromise,
  ])

  if (grantsError) {
    throw grantsError
  }

  if (targetResult.error) {
    throw targetResult.error
  }

  let entitlement: UserEntitlementRecord | null = null
  if (targetResult.data?.user_id) {
    const { data: entitlementRow, error } = await supabase
      .from('user_entitlements')
      .select('*')
      .eq('user_id', targetResult.data.user_id)
      .maybeSingle()

    if (error) {
      throw error
    }

    entitlement = (entitlementRow ?? null) as UserEntitlementRecord | null
  }

  return {
    target: (targetResult.data ?? null) as UserDirectoryRecord | null,
    entitlement,
    grants: (grants ?? []) as EntitlementGrantRecord[],
  }
}

export async function grantUserAccess(input: GrantAccessInput) {
  const { supabase } = await ensureAdminUser()

  const normalizedEmail = input.email.trim().toLowerCase()
  if (!normalizedEmail) {
    throw new Error('Email required')
  }

  const { data, error } = await supabase.rpc('admin_grant_user_entitlement', {
    p_email: normalizedEmail,
    p_plan: input.plan ?? null,
    p_support_renders: Math.max(0, Math.trunc(input.supportRenders ?? 0)),
    p_premium_renders: Math.max(0, Math.trunc(input.premiumRenders ?? 0)),
    p_funding_source: input.fundingSource ?? 'manual',
    p_reason: input.notes ?? null,
    p_source_reference: 'manual_admin_surface',
    p_expires_at: input.expiresAt ?? null,
    p_grant_type: 'manual_grant',
  })

  if (error) {
    throw error
  }

  revalidatePath('/profile')
  revalidatePath('/profile/admin/access')

  return normalizeSingleRow<{
    user_id: string
    email: string
    plan: EntitlementPlan
    funding_source: FundingSource
    support_renders_remaining: number
    premium_renders_remaining: number
    can_high_quality: boolean
    expires_at: string | null
  }>(data)
}

export async function getProductAnalyticsSnapshot(): Promise<AdminAnalyticsSnapshot> {
  const { supabase } = await ensureAdminUser()
  const since = new Date(Date.now() - ANALYTICS_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('product_events')
    .select('id, user_id, event_name, card_id, session_id, properties, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .range(0, 4999)

  if (error) {
    if (isAnalyticsSchemaError(error)) {
      return {
        supported: false,
        windowDays: ANALYTICS_WINDOW_DAYS,
        totalEvents: 0,
        activeUsers: 0,
        cardsTouched: 0,
        clarificationAuthors: 0,
        clarifiedFollowOnCount: 0,
        unresolvedCorrectionFollowOnCount: 0,
        clarifiedActions: {
          saves: 0,
          remixes: 0,
          reviews: 0,
        },
        eventCounts: PRODUCT_EVENT_ORDER.map((eventName) => ({ eventName, count: 0 })),
        recentEvents: [],
      }
    }

    throw error
  }

  const rows = (data ?? []) as ProductEventRow[]
  const eventCounts = new Map<string, number>()
  const activeUsers = new Set<string>()
  const cardsTouched = new Set<string>()
  const clarificationAuthors = new Set<string>()
  const clarifiedActions = {
    saves: 0,
    remixes: 0,
    reviews: 0,
  }
  let clarifiedFollowOnCount = 0
  let unresolvedCorrectionFollowOnCount = 0

  for (const row of rows) {
    eventCounts.set(row.event_name, (eventCounts.get(row.event_name) ?? 0) + 1)
    activeUsers.add(row.user_id)

    if (row.card_id) {
      cardsTouched.add(row.card_id)
    }

    if (CLARIFICATION_AUTHOR_EVENT_NAMES.has(row.event_name)) {
      clarificationAuthors.add(row.user_id)
    }

    if (!FOLLOW_ON_EVENT_NAMES.has(row.event_name)) {
      continue
    }

    const properties = toProductEventProperties(row.properties)
    if (!hasClarificationContext(properties)) {
      continue
    }

    clarifiedFollowOnCount += 1

    if (row.event_name === 'community_card_saved') {
      clarifiedActions.saves += 1
    }

    if (row.event_name === 'community_card_remix_started') {
      clarifiedActions.remixes += 1
    }

    if (row.event_name === 'review_item_scored') {
      clarifiedActions.reviews += 1
    }

    if (properties.clarification_has_unresolved_correction === true) {
      unresolvedCorrectionFollowOnCount += 1
    }
  }

  return {
    supported: true,
    windowDays: ANALYTICS_WINDOW_DAYS,
    totalEvents: rows.length,
    activeUsers: activeUsers.size,
    cardsTouched: cardsTouched.size,
    clarificationAuthors: clarificationAuthors.size,
    clarifiedFollowOnCount,
    unresolvedCorrectionFollowOnCount,
    clarifiedActions,
    eventCounts: PRODUCT_EVENT_ORDER.map((eventName) => ({
      eventName,
      count: eventCounts.get(eventName) ?? 0,
    })),
    recentEvents: rows.slice(0, 12).map((row) => ({
      id: row.id,
      eventName: row.event_name,
      createdAt: row.created_at,
      cardId: row.card_id,
      detail: getRecentEventDetail(row),
    })),
  }
}
