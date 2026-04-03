import type { ToonTemplateId } from './toon/toon-types'

export const IMAGE_MODEL = 'gpt-image-1.5'
export const PLANNER_MODEL = 'gpt-4.1'
export const IMAGE_SIZE = '1536x1024'
export const PROMPT_VERSION = 'capsule-2026-04-02-v2'

export type VisualPlan = {
  conceptType: string
  coreTeachingPoint: string
  learningObjective: string
  densityMode: string
  visualStory: string
  visualStructure: string
  dominantScanPath: string
  titleText: string
  microLabels: string[]
  mainEntities: string[]
  causalLinks: string[]
  sequence: string[]
  contrastAxes: string[]
  warnings: string[]
  mustKeep: string[]
  supportingCues: string[]
  avoid: string[]
  sceneDescription: string
  recommendedTemplateId?: ToonTemplateId
}

export type PromptProfileId =
  | 'drug'
  | 'regimen'
  | 'cascade'
  | 'risk-map'
  | 'timeline'
  | 'comparison'
  | 'planner-default'

const COMMON_AVOID = [
  'black background',
  'dense paragraphs',
  'overcrowded labels',
  'prompt artifact text',
  'unrelated diseases or mechanisms',
  'generic startup illustration style',
  'childish cartoon look',
]

function trimText(value: string | null | undefined, limit: number) {
  const compact = String(value ?? '').replace(/\s+/g, ' ').trim()
  if (compact.length <= limit) {
    return compact
  }

  return `${compact.slice(0, Math.max(0, limit - 3)).trimEnd()}...`
}

function titleFromText(text: string, fallback: string) {
  const colonTitle = text.split(':')[0]?.trim()
  if (colonTitle && colonTitle.length <= 48) {
    return colonTitle
  }

  return trimText(fallback, 48)
}

export function buildDeterministicPlan(
  profileId: PromptProfileId,
  pointText: string,
  concept: string,
): VisualPlan | null {
  const safeConcept = concept || 'medical concept'
  const fallbackTitle = titleFromText(pointText, safeConcept || 'Learning card')

  if (profileId === 'regimen') {
    const comboTitle = pointText.includes(':') ? pointText.split(':')[0]?.trim() || fallbackTitle : fallbackTitle
    const comboText = pointText.split(':')[1]?.trim() || pointText
    const drugLabels = comboText
      .split('+')
      .map((item) => trimText(item, 28))
      .filter(Boolean)
      .slice(0, 2)

    return {
      conceptType: 'Regimen',
      coreTeachingPoint: 'Paired drugs converge on one disease target and one therapeutic outcome.',
      learningObjective: 'Show how the paired drugs act together on one disease process and converge on a shared outcome.',
      densityMode: 'quick-scan card',
      visualStory: 'Two-drug convergence into one central disease target and one clear therapeutic outcome.',
      visualStructure: 'converging action card',
      dominantScanPath: 'left to right',
      titleText: trimText(comboTitle, 48),
      microLabels: drugLabels,
      mainEntities: drugLabels,
      causalLinks: ['drug A + drug B -> shared effect', 'shared effect -> clinical outcome'],
      sequence: ['disease target', 'drug actions', 'shared outcome'],
      contrastAxes: [],
      warnings: [],
      mustKeep: ['shared target', 'merged outcome'],
      supportingCues: ['shared target', 'merged outcome'],
      avoid: [...COMMON_AVOID, 'long mechanism text', 'extra side effect strips'],
      sceneDescription:
        'A clean clinical board with two compact drug modules feeding into one central disease target, then one simplified treatment outcome zone. The image should explain the pairing visually instead of relying on long labels.',
      recommendedTemplateId: 'protocol-board',
    }
  }

  if (profileId === 'risk-map') {
    return {
      conceptType: 'Risk factors',
      coreTeachingPoint: 'Risk factors feed into one central driver or bottleneck process.',
      learningObjective: 'Show the central disease driver and how the listed risks feed into it.',
      densityMode: 'summary board',
      visualStory: 'A central causal hub with compact incoming risk badges.',
      visualStructure: 'risk-factor hub',
      dominantScanPath: 'outside in',
      titleText: trimText(fallbackTitle, 48),
      microLabels: ['risk factors', 'driver'],
      mainEntities: ['central driver', 'risk badges'],
      causalLinks: ['risk factors -> central driver'],
      sequence: [],
      contrastAxes: [],
      warnings: [],
      mustKeep: ['central hub', 'incoming factors'],
      supportingCues: ['inward arrows', 'risk badges'],
      avoid: [...COMMON_AVOID, 'flat bullet lists', 'big paragraphs'],
      sceneDescription:
        'A single central disease or bottleneck process with a ring or arc of compact risk badges feeding inward. The lesson should feel like a causal map, not a memorized list.',
      recommendedTemplateId: 'risk-map',
    }
  }

  if (profileId === 'timeline') {
    return {
      conceptType: 'Timeline',
      coreTeachingPoint: 'The lesson is about grouped timing phases, not isolated facts.',
      learningObjective: 'Show onset or recovery timing in grouped phases rather than as disconnected facts.',
      densityMode: 'summary board',
      visualStory: 'A phased timeline with compact grouped windows and minimal labels.',
      visualStructure: 'timeline rail',
      dominantScanPath: 'left to right',
      titleText: trimText(fallbackTitle, 48),
      microLabels: ['early', 'intermediate', 'late'],
      mainEntities: ['early phase', 'middle phase', 'late phase'],
      causalLinks: [],
      sequence: ['early', 'intermediate', 'late'],
      contrastAxes: [],
      warnings: [],
      mustKeep: ['phase order', 'timing groups'],
      supportingCues: ['phase bands', 'tiny organ cues'],
      avoid: [...COMMON_AVOID, 'mechanism diagrams', 'floating unrelated icons'],
      sceneDescription:
        'A clean timeline or phased band layout that groups the key events into a few onset windows. Emphasize progression and scanability over detail.',
      recommendedTemplateId: 'timeline',
    }
  }

  if (profileId === 'comparison') {
    return {
      conceptType: 'Comparison',
      coreTeachingPoint: 'The key lesson is relative position on one clear comparison axis.',
      learningObjective: 'Rank or compare the listed items on one clear visual scale.',
      densityMode: 'quick-scan card',
      visualStory: 'An ordered scale or ladder with the most important contrast made immediately obvious.',
      visualStructure: 'ranking scale',
      dominantScanPath: 'left to right',
      titleText: trimText(fallbackTitle, 48),
      microLabels: ['high', 'low'],
      mainEntities: ['left comparator', 'right comparator'],
      causalLinks: [],
      sequence: [],
      contrastAxes: ['rank or relative level'],
      warnings: [],
      mustKeep: ['ordered scale'],
      supportingCues: ['ordered chips', 'comparison line'],
      avoid: [...COMMON_AVOID, 'mechanism panels', 'multi-path layouts'],
      sceneDescription:
        'A single comparison scale, ladder, or ordered strip. The image should immediately show relative position without extra explanation.',
      recommendedTemplateId: 'comparison-board',
    }
  }

  if (profileId === 'drug') {
    return {
      conceptType: 'Drug',
      coreTeachingPoint: 'The drug acts at one site, changes one process, and produces one main effect.',
      learningObjective: 'Show where the drug acts, what it changes, and the main effect that follows.',
      densityMode: 'quick-scan card',
      visualStory: 'One site-of-action strip with a clear before and after change.',
      visualStructure: 'site-of-action strip',
      dominantScanPath: 'left to right',
      titleText: trimText(fallbackTitle, 48),
      microLabels: ['target', 'action', 'effect'],
      mainEntities: ['target', 'drug action', 'effect'],
      causalLinks: ['target -> action -> effect'],
      sequence: ['site', 'action', 'effect'],
      contrastAxes: [],
      warnings: [],
      mustKeep: ['site of action'],
      supportingCues: ['drug icon', 'site icon'],
      avoid: [...COMMON_AVOID, 'secondary pathways', 'tiny dense labels'],
      sceneDescription:
        'A simple medical mechanism scene focused on one target or site of action, one intervention, and one downstream clinical effect.',
      recommendedTemplateId: 'mechanism-board',
    }
  }

  return null
}

export function buildCompactPlannerGuidance() {
  return `You are Capsule's visual teaching planner.

Plan one 16:9 illustrative medical learning card.

Rules:
- choose structure dynamically instead of forcing templates
- understanding first, memorization second
- keep the lesson concept-pure and medically accurate
- form is constrained by a template layer; focus on meaning, not art direction
- prefer low text, iconography, arrows, grouped chips, anatomy, and strong layout
- rendered text should be very short and sparse
- the UI shell may be pale; do not over-specify background color unless the concept truly needs it
- avoid dark cinematic poster styling, busy radial chaos, giant paragraphs, and leftover prompt artifacts

Return JSON only with:
- conceptType
- coreTeachingPoint
- learningObjective
- densityMode
- visualStory
- visualStructure
- dominantScanPath
- titleText
- microLabels
- mainEntities
- causalLinks
- sequence
- contrastAxes
- warnings
- mustKeep
- supportingCues
- avoid
- sceneDescription
- recommendedTemplateId (only if the content truly needs a different structure than expected)

JSON constraints:
- titleText: short
- microLabels: 0-4 tiny labels
- mainEntities: 1-5 compact entities
- causalLinks: 0-4 short causal statements
- sequence: 0-5 ordered steps
- contrastAxes: 0-4 comparison axes
- warnings: 0-3 concise warnings
- mustKeep: 0-4 non-negotiable content anchors
- supportingCues: 0-4 compact cues
- avoid: 4-8 concrete failures to avoid
- sceneDescription: one concise paragraph`
}

export { trimText }
