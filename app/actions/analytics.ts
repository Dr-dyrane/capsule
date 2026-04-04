'use server'

import { trackProductEvent } from '@/lib/analytics/events'

export async function trackClarificationPanelViewed(input: {
  cardId: string
  openCount: number
  resolvedCount: number
  evidenceCount: number
}) {
  await trackProductEvent({
    eventName: 'clarification_panel_viewed',
    cardId: input.cardId,
    properties: {
      open_count: input.openCount,
      resolved_count: input.resolvedCount,
      evidence_count: input.evidenceCount,
    },
  })
}
