import { trimText, type VisualPlan } from '../prompt-profiles'
import { buildToonRulesPack, getToonAvoidList, TOON_VERSION } from './toon-rules'
import { TOON_TEMPLATES } from './toon-templates'
import type { ToonTemplateId } from './toon-types'

function uniqueShortList(values: unknown, maxItems: number, maxLength: number) {
  if (!Array.isArray(values)) {
    return []
  }

  const seen = new Set<string>()
  const cleaned: string[] = []

  for (const value of values) {
    const item = trimText(typeof value === 'string' ? value : String(value ?? ''), maxLength)
    if (!item) continue

    const key = item.toLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    cleaned.push(item)

    if (cleaned.length >= maxItems) {
      break
    }
  }

  return cleaned
}

export function buildToonImagePrompt(
  pointText: string,
  concept: string,
  sessionContext: string,
  plan: VisualPlan,
  templateId: ToonTemplateId,
) {
  const template = TOON_TEMPLATES[templateId]
  const contextLine = trimText(sessionContext, 280)
  const microLabels = uniqueShortList(plan.microLabels, 4, 28)
  const entities = uniqueShortList(plan.mainEntities, 5, 28)
  const sequence = uniqueShortList(plan.sequence, 5, 48)
  const warnings = uniqueShortList(plan.warnings, 3, 42)
  const mustKeep = uniqueShortList(plan.mustKeep, 4, 52)
  const avoidItems = uniqueShortList(getToonAvoidList(template, plan.avoid), 10, 84)

  return [
    'Use case: infographic-diagram',
    'Asset type: 16:9 medical learning card',
    `Primary request: create one polished medical teaching card for "${trimText(pointText, 180)}"`,
    buildToonRulesPack(template),
    `TOON version: ${TOON_VERSION}`,
    plan.visualStory ? `Teaching story: ${plan.visualStory}` : '',
    `Concept type: ${plan.conceptType}`,
    `Core teaching point: ${plan.coreTeachingPoint || plan.learningObjective}`,
    plan.dominantScanPath ? `Scan path: ${plan.dominantScanPath}` : '',
    entities.length > 0 ? `Main entities: ${entities.join('; ')}` : '',
    sequence.length > 0 ? `Ordered sequence: ${sequence.join(' -> ')}` : '',
    plan.causalLinks.length > 0 ? `Causal links: ${plan.causalLinks.join('; ')}` : '',
    plan.contrastAxes.length > 0 ? `Contrast axes: ${plan.contrastAxes.join('; ')}` : '',
    warnings.length > 0 ? `Warnings: ${warnings.join('; ')}` : '',
    mustKeep.length > 0 ? `Must keep visible: ${mustKeep.join('; ')}` : '',
    contextLine ? `Clinical context: ${contextLine}` : '',
    `Title text if needed: "${plan.titleText || trimText(concept || 'Learning card', 40)}"`,
    microLabels.length > 0
      ? `Allowed short labels only if essential: ${microLabels.map((label) => `"${label}"`).join(', ')}`
      : 'Avoid extra text. Use only the minimum short labels needed.',
    'Text rules: no paragraphs, no provenance text, no prompt artifacts, no page numbers, no repeated labels. If a label is longer than two words, convert it into iconography or a compact badge.',
    'Medical rules: concept-pure, mechanism-accurate, and faithful to the teaching objective.',
    `Avoid: ${avoidItems.join('; ')}`,
    'Quality: high',
  ]
    .filter(Boolean)
    .join('\n')
}
