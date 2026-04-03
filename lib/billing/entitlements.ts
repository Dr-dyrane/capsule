import 'server-only'

import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

import type { NoteRole, RenderCreditKind, UserEntitlementRecord } from '@/lib/types'

const CAPSULE_ADMIN_EMAILS = new Set(['drdyrane@gmail.com', 'hello@dyrane.tech'])

function normalizeEntitlementRecord(data: unknown): UserEntitlementRecord {
  if (Array.isArray(data)) {
    return data[0] as UserEntitlementRecord
  }

  return data as UserEntitlementRecord
}

export function isCapsuleAdminEmail(email?: string | null) {
  const normalized = email?.trim().toLowerCase()
  return Boolean(normalized && CAPSULE_ADMIN_EMAILS.has(normalized))
}

export async function syncCurrentUserDirectory(supabase: SupabaseClient, user: User) {
  if (!user.email) {
    return
  }

  const { error } = await supabase.rpc('sync_current_user_directory', {
    p_email: user.email,
    p_display_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    p_avatar_url: user.user_metadata?.avatar_url ?? null,
  })

  if (error) {
    throw error
  }
}

export async function getCurrentUserEntitlement(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc('get_or_create_user_entitlement')

  if (error) {
    throw error
  }

  return normalizeEntitlementRecord(data)
}

export async function consumeGenerationCredit(
  supabase: SupabaseClient,
  kind: RenderCreditKind,
) {
  const { data, error } = await supabase.rpc('consume_generation_credit', {
    p_kind: kind,
  })

  if (error) {
    throw error
  }

  return normalizeEntitlementRecord(data)
}

export async function refundGenerationCredit(
  supabase: SupabaseClient,
  kind: RenderCreditKind,
  units = 1,
) {
  const { data, error } = await supabase.rpc('refund_generation_credit', {
    p_kind: kind,
    p_units: units,
  })

  if (error) {
    throw error
  }

  return normalizeEntitlementRecord(data)
}

export function getRequiredCreditKind(
  noteRole: NoteRole,
  mode: 'default' | 'premium' | 'remix',
): RenderCreditKind | null {
  if (mode === 'remix') {
    return null
  }

  if (mode === 'premium') {
    return 'premium'
  }

  if (noteRole === 'hero') {
    return null
  }

  return 'support'
}
