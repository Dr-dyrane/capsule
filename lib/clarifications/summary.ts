import 'server-only'

import { isClarificationSchemaError } from '@/lib/clarifications/schema'
import { createClient } from '@/lib/supabase/server'

export type ClarificationAnalyticsSummary = {
  clarification_open_count: number
  clarification_resolved_count: number
  clarification_evidence_count: number
  clarification_has_unresolved_correction: boolean
}

const EMPTY_CLARIFICATION_ANALYTICS_SUMMARY: ClarificationAnalyticsSummary = {
  clarification_open_count: 0,
  clarification_resolved_count: 0,
  clarification_evidence_count: 0,
  clarification_has_unresolved_correction: false,
}

export function getEmptyClarificationAnalyticsSummary(): ClarificationAnalyticsSummary {
  return { ...EMPTY_CLARIFICATION_ANALYTICS_SUMMARY }
}

export async function getClarificationAnalyticsSummary(
  cardId: string,
  providedSupabase?: Awaited<ReturnType<typeof createClient>>,
): Promise<ClarificationAnalyticsSummary> {
  if (!cardId) {
    return getEmptyClarificationAnalyticsSummary()
  }

  const supabase = providedSupabase ?? await createClient()

  const [{ data: threadRows, error: threadError }, { data: itemRows, error: itemError }] = await Promise.all([
    supabase
      .from('card_clarification_threads')
      .select('kind, status')
      .eq('card_id', cardId)
      .neq('status', 'removed'),
    supabase
      .from('card_clarification_items')
      .select('evidence_image_path')
      .eq('card_id', cardId)
      .eq('status', 'active')
      .not('evidence_image_path', 'is', null),
  ])

  if (threadError || itemError) {
    const error = threadError ?? itemError

    if (isClarificationSchemaError(error)) {
      return getEmptyClarificationAnalyticsSummary()
    }

    throw error
  }

  return (threadRows ?? []).reduce<ClarificationAnalyticsSummary>((summary, thread) => {
    if (thread.status === 'open') {
      summary.clarification_open_count += 1
    }

    if (thread.status === 'resolved') {
      summary.clarification_resolved_count += 1
    }

    if (thread.kind === 'correction' && thread.status === 'open') {
      summary.clarification_has_unresolved_correction = true
    }

    return summary
  }, {
    ...EMPTY_CLARIFICATION_ANALYTICS_SUMMARY,
    clarification_evidence_count: (itemRows ?? []).length,
  })
}
