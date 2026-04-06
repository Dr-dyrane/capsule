import type { CardRelationshipType } from '@/lib/types'

const CARD_RELATIONSHIP_LABELS: Record<CardRelationshipType, string> = {
  same_story: 'Same note story',
  same_pathophysiology: 'Same pathophysiology',
  same_natural_history: 'Same disease course',
  same_ruleset: 'Same ruleset',
}

export function getCardRelationshipLabel(type: CardRelationshipType) {
  return CARD_RELATIONSHIP_LABELS[type] ?? 'Related card'
}
