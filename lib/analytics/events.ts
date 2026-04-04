import 'server-only'

import { isAnalyticsSchemaError } from '@/lib/analytics/schema'
import { getClarificationAnalyticsSummary } from '@/lib/clarifications/summary'
import { createClient } from '@/lib/supabase/server'

export type ProductEventName =
  | 'clarification_panel_viewed'
  | 'clarification_created'
  | 'clarification_reply_created'
  | 'clarification_resolved'
  | 'clarification_evidence_attached'
  | 'community_card_saved'
  | 'community_card_remix_started'
  | 'review_item_scored'

type ProductEventInput = {
  eventName: ProductEventName
  userId?: string | null
  cardId?: string | null
  sessionId?: string | null
  properties?: Record<string, unknown>
  includeClarificationSummary?: boolean
  supabase?: Awaited<ReturnType<typeof createClient>>
}

function sanitizeProperties(properties: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  )
}

export async function trackProductEvent({
  eventName,
  userId,
  cardId = null,
  sessionId = null,
  properties = {},
  includeClarificationSummary = false,
  supabase: providedSupabase,
}: ProductEventInput) {
  try {
    const supabase = providedSupabase ?? await createClient()
    let resolvedUserId = userId ?? null

    if (!resolvedUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      resolvedUserId = user?.id ?? null
    }

    if (!resolvedUserId) {
      return
    }

    const mergedProperties = includeClarificationSummary && cardId
      ? {
          ...properties,
          ...(await getClarificationAnalyticsSummary(cardId, supabase)),
        }
      : properties

    const { error } = await supabase.from('product_events').insert({
      user_id: resolvedUserId,
      event_name: eventName,
      card_id: cardId,
      session_id: sessionId,
      properties: sanitizeProperties(mergedProperties),
    })

    if (error && !isAnalyticsSchemaError(error)) {
      console.error(`Could not track ${eventName}`, error)
    }
  } catch (error) {
    console.error(`Could not track ${eventName}`, error)
  }
}
