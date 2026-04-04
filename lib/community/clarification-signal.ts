import type { CommunityIndexRecord } from '@/lib/types'

export type CommunityClarificationSignal = {
  tone: 'warning' | 'info' | 'calm'
  compactLabel: string
  detailLabel: string
}

export function getCommunityClarificationSignal(
  card: Pick<
    CommunityIndexRecord,
    'clarification_open_count' | 'clarification_resolved_count' | 'has_unresolved_correction'
  >,
): CommunityClarificationSignal | null {
  if (card.has_unresolved_correction) {
    return {
      tone: 'warning',
      compactLabel: 'Correction open',
      detailLabel: 'Correction open',
    }
  }

  if (card.clarification_open_count > 0) {
    return {
      tone: 'info',
      compactLabel: `${card.clarification_open_count} open`,
      detailLabel:
        card.clarification_open_count === 1
          ? '1 open clarification'
          : `${card.clarification_open_count} open clarifications`,
    }
  }

  if (card.clarification_resolved_count > 0) {
    return {
      tone: 'calm',
      compactLabel: 'Resolved',
      detailLabel:
        card.clarification_resolved_count === 1
          ? '1 resolved clarification'
          : `${card.clarification_resolved_count} resolved clarifications`,
    }
  }

  return null
}
