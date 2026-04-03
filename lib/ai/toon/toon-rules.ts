import type { ToonTemplateDefinition } from './toon-types'

export const TOON_VERSION = 'toon-v1'

const BASE_RULES = [
  'educational medical visual, not decorative poster art',
  'clean structured layout with obvious hierarchy',
  'short labels only, no paragraphs',
  'use arrows, panels, bands, nodes, and badges deliberately',
  'high clarity over artistic flourish',
  'low clutter and calm negative space',
  'semantically meaningful color and grouping',
  'consistent visual family across cards',
]

const BASE_AVOID = [
  'busy radial chaos',
  'dense explanatory blocks',
  'generic startup illustration style',
  'leftover prompt artifact text',
  'extra mechanisms not central to the lesson',
]

export function buildToonRulesPack(template: ToonTemplateDefinition) {
  return [
    `TOON system version: ${TOON_VERSION}`,
    `Template family: ${template.label}`,
    `Layout grammar: ${template.layoutGrammar}`,
    `Element grammar: ${template.elementGrammar.join('; ')}`,
    `Text grammar: ${template.textGrammar.join('; ')}`,
    `Color grammar: ${template.colorGrammar.join('; ')}`,
    `Composition grammar: ${template.compositionGrammar.join('; ')}`,
    `Template rules: ${template.localRules.join('; ')}`,
    `Global rules: ${BASE_RULES.join('; ')}`,
  ].join('\n')
}

export function getToonAvoidList(template: ToonTemplateDefinition, extraAvoid: string[] = []) {
  return [...BASE_AVOID, ...template.localRules.filter((rule) => rule.toLowerCase().startsWith('avoid ')), ...extraAvoid]
}

