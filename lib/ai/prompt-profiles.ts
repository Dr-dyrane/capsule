export const IMAGE_MODEL = 'gpt-image-1.5'
export const PLANNER_MODEL = 'gpt-4.1'
export const IMAGE_SIZE = '1536x1024'
export const PROMPT_VERSION = 'capsule-2026-04-02-v1'

export type VisualPlan = {
  conceptType: string
  learningObjective: string
  densityMode: string
  visualStory: string
  visualStructure: string
  dominantScanPath: string
  titleText: string
  microLabels: string[]
  supportingCues: string[]
  avoid: string[]
  sceneDescription: string
}

export type PromptProfileId =
  | 'drug'
  | 'regimen'
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
      learningObjective: 'Show how the paired drugs act together on one disease process and converge on a shared outcome.',
      densityMode: 'quick-scan card',
      visualStory: 'Two-drug convergence into one central disease target and one clear therapeutic outcome.',
      visualStructure: 'converging action card',
      dominantScanPath: 'left to right',
      titleText: trimText(comboTitle, 48),
      microLabels: drugLabels,
      supportingCues: ['shared target', 'merged outcome'],
      avoid: [...COMMON_AVOID, 'long mechanism text', 'extra side effect strips'],
      sceneDescription:
        'A clean clinical board with two compact drug modules feeding into one central disease target, then one simplified treatment outcome zone. The image should explain the pairing visually instead of relying on long labels.',
    }
  }

  if (profileId === 'risk-map') {
    return {
      conceptType: 'Risk factors',
      learningObjective: 'Show the central disease driver and how the listed risks feed into it.',
      densityMode: 'summary board',
      visualStory: 'A central causal hub with compact incoming risk badges.',
      visualStructure: 'risk-factor hub',
      dominantScanPath: 'outside in',
      titleText: trimText(fallbackTitle, 48),
      microLabels: ['risk factors', 'driver'],
      supportingCues: ['inward arrows', 'risk badges'],
      avoid: [...COMMON_AVOID, 'flat bullet lists', 'big paragraphs'],
      sceneDescription:
        'A single central disease or bottleneck process with a ring or arc of compact risk badges feeding inward. The lesson should feel like a causal map, not a memorized list.',
    }
  }

  if (profileId === 'timeline') {
    return {
      conceptType: 'Timeline',
      learningObjective: 'Show onset or recovery timing in grouped phases rather than as disconnected facts.',
      densityMode: 'summary board',
      visualStory: 'A phased timeline with compact grouped windows and minimal labels.',
      visualStructure: 'timeline rail',
      dominantScanPath: 'left to right',
      titleText: trimText(fallbackTitle, 48),
      microLabels: ['early', 'intermediate', 'late'],
      supportingCues: ['phase bands', 'tiny organ cues'],
      avoid: [...COMMON_AVOID, 'mechanism diagrams', 'floating unrelated icons'],
      sceneDescription:
        'A clean timeline or phased band layout that groups the key events into a few onset windows. Emphasize progression and scanability over detail.',
    }
  }

  if (profileId === 'comparison') {
    return {
      conceptType: 'Comparison',
      learningObjective: 'Rank or compare the listed items on one clear visual scale.',
      densityMode: 'quick-scan card',
      visualStory: 'An ordered scale or ladder with the most important contrast made immediately obvious.',
      visualStructure: 'ranking scale',
      dominantScanPath: 'left to right',
      titleText: trimText(fallbackTitle, 48),
      microLabels: ['high', 'low'],
      supportingCues: ['ordered chips', 'comparison line'],
      avoid: [...COMMON_AVOID, 'mechanism panels', 'multi-path layouts'],
      sceneDescription:
        'A single comparison scale, ladder, or ordered strip. The image should immediately show relative position without extra explanation.',
    }
  }

  if (profileId === 'drug') {
    return {
      conceptType: 'Drug',
      learningObjective: 'Show where the drug acts, what it changes, and the main effect that follows.',
      densityMode: 'quick-scan card',
      visualStory: 'One site-of-action strip with a clear before and after change.',
      visualStructure: 'site-of-action strip',
      dominantScanPath: 'left to right',
      titleText: trimText(fallbackTitle, 48),
      microLabels: ['target', 'action', 'effect'],
      supportingCues: ['drug icon', 'site icon'],
      avoid: [...COMMON_AVOID, 'secondary pathways', 'tiny dense labels'],
      sceneDescription:
        'A simple medical mechanism scene focused on one target or site of action, one intervention, and one downstream clinical effect.',
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
- prefer low text, iconography, arrows, grouped chips, anatomy, and strong layout
- rendered text should be very short and sparse
- the UI shell may be pale; do not over-specify background color unless the concept truly needs it
- avoid dark cinematic poster styling, busy radial chaos, giant paragraphs, and leftover prompt artifacts

Return JSON only with:
- conceptType
- learningObjective
- densityMode
- visualStory
- visualStructure
- dominantScanPath
- titleText
- microLabels
- supportingCues
- avoid
- sceneDescription

JSON constraints:
- titleText: short
- microLabels: 0-4 tiny labels
- supportingCues: 0-4 compact cues
- avoid: 4-8 concrete failures to avoid
- sceneDescription: one concise paragraph`
}

export { trimText }
