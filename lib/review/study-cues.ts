import type { ReviewQueueItem } from '@/lib/types'

export type StudyMode =
  | 'rule-recall'
  | 'compare-recall'
  | 'mechanism-recall'
  | 'formula-recall'
  | 'sequence-recall'
  | 'therapy-recall'
  | 'core-recall'

export type StudyCue = {
  mode: StudyMode
  label: string
  promptText: string
  coverTitle: string
  coverText: string
  revealLabel: string
}

const RULE_TERMS = [
  'regulation',
  'ethic',
  'confidential',
  'prescription',
  'dispens',
  'report',
  'required',
  'must',
  'only',
  'cannot',
  'may not',
  'allowed',
  'prohibit',
  'controlled',
  'narcotic',
  'straight narcotic',
  'part 1',
  'part 2',
  'part 3',
  'benzodiazepine',
  'gift',
]

const COMPARE_TERMS = [
  ' vs ',
  'versus',
  'difference',
  'compare',
  'in contrast',
  'rather than',
]

const FORMULA_TERMS = [
  'relative risk',
  'rrr',
  'nnt',
  'number needed to treat',
  'formula',
  'calculate',
  'calculation',
  'risk reduction',
  '%',
]

const SEQUENCE_TERMS = [
  'first',
  'then',
  'after',
  'before',
  'stage',
  'timeline',
  'season',
  'follow-up',
  'follow up',
  'weeks',
  'months',
  'years',
  'interval',
  'progression',
]

const MECHANISM_TERMS = [
  'mechanism',
  'pathway',
  'mhc',
  'immune',
  'attack',
  'damage',
  'signal',
  'inhibit',
  'block',
  'cytokine',
  'myelin',
  'antibody',
]

const THERAPY_TERMS = [
  'treatment',
  'therapy',
  'regimen',
  'drug',
  'biologic',
  'methotrexate',
  'hydroxychloroquine',
  'immunosuppressant',
  'vaccin',
]

function buildSearchText(item: ReviewQueueItem) {
  return [item.title, item.point_text, item.category, item.concept]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term))
}

export function getStudyCue(item: ReviewQueueItem): StudyCue {
  const text = buildSearchText(item)

  if (includesAny(text, FORMULA_TERMS)) {
    return {
      mode: 'formula-recall',
      label: 'Formula',
      promptText: 'Work the relationship or formula out in your head before you reveal the wording.',
      coverTitle: 'Solve it first.',
      coverText: 'Use the image and topic as cues, then reconstruct the formula or calculation logic from memory.',
      revealLabel: 'Reveal formula',
    }
  }

  if (includesAny(text, COMPARE_TERMS)) {
    return {
      mode: 'compare-recall',
      label: 'Compare',
      promptText: 'Name the one difference that matters most before you reveal the original wording.',
      coverTitle: 'Separate the lookalikes.',
      coverText: 'Recall what makes this concept distinct before you check the answer.',
      revealLabel: 'Reveal difference',
    }
  }

  if (includesAny(text, SEQUENCE_TERMS)) {
    return {
      mode: 'sequence-recall',
      label: 'Sequence',
      promptText: 'Rebuild the order, interval, or progression in your own words before revealing it.',
      coverTitle: 'Run the sequence.',
      coverText: 'Use the illustration as a timeline cue, then say what comes first, next, and later.',
      revealLabel: 'Reveal sequence',
    }
  }

  if (includesAny(text, RULE_TERMS)) {
    return {
      mode: 'rule-recall',
      label: 'Rule',
      promptText: 'Recall the rule, exception, or restriction before you reveal the original point.',
      coverTitle: 'State the rule.',
      coverText: 'Say the core rule and any exception you remember before checking the wording.',
      revealLabel: 'Reveal rule',
    }
  }

  if (includesAny(text, MECHANISM_TERMS)) {
    return {
      mode: 'mechanism-recall',
      label: 'Mechanism',
      promptText: 'Explain the chain of cause and effect before you reveal the original wording.',
      coverTitle: 'Rebuild the chain.',
      coverText: 'Start from the visual cue, then walk through what acts on what and what changes next.',
      revealLabel: 'Reveal mechanism',
    }
  }

  if (includesAny(text, THERAPY_TERMS)) {
    return {
      mode: 'therapy-recall',
      label: 'Therapy',
      promptText: 'Recall what the treatment does, where it fits, and the key caution before revealing it.',
      coverTitle: 'Map the treatment.',
      coverText: 'Use the card to bring back the treatment role and the main takeaway, not every word.',
      revealLabel: 'Reveal treatment',
    }
  }

  return {
    mode: 'core-recall',
    label: 'Recall',
    promptText: 'Bring back the core teaching point in your own words before you reveal the original wording.',
    coverTitle: 'Try recall first.',
    coverText: 'Use the image as a cue, then say the concept out loud or in your head before checking it.',
    revealLabel: 'Reveal answer',
  }
}
