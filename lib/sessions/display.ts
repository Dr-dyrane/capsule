import type { SessionRecord } from '@/lib/types'

function trimTitle(value: string, maxLength = 56) {
  const normalized = value.replace(/\s+/g, ' ').trim()

  if (normalized.length <= maxLength) {
    return normalized
  }

  const truncated = normalized.slice(0, maxLength).trimEnd()
  const safeBreak = truncated.lastIndexOf(' ')

  return `${(safeBreak > 20 ? truncated.slice(0, safeBreak) : truncated).trimEnd()}...`
}

function toDisplayTitle(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (word === word.toUpperCase() && word.length <= 4) {
        return word
      }

      return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
    })
    .join(' ')
}

function getSessionTags(context: string) {
  const normalized = context.toLowerCase()
  const tags: string[] = []

  const addTag = (condition: boolean, tag: string) => {
    if (condition && !tags.includes(tag)) {
      tags.push(tag)
    }
  }

  addTag(normalized.includes('celiac'), 'Celiac')
  addTag(normalized.includes('vaccine') || normalized.includes('vaccination') || normalized.includes('immunization'), 'Vaccines')
  addTag(
    normalized.includes('immune system') ||
      normalized.includes('immunology') ||
      normalized.includes('mhc ') ||
      normalized.includes('natural killer'),
    'Immunology',
  )
  addTag(normalized.includes('autoimmune'), 'Autoimmune')
  addTag(normalized.includes('rheumatoid arthritis'), 'Rheumatoid Arthritis')
  addTag(normalized.includes('psoriasis'), 'Psoriasis')
  addTag(normalized.includes('multiple sclerosis'), 'Multiple Sclerosis')
  addTag(
    normalized.includes('systemic lupus erythematosus') || /\bsle\b/.test(normalized) || normalized.includes(' lupus'),
    'Lupus',
  )
  addTag(
    normalized.includes('therapy') ||
      normalized.includes('treatment') ||
      normalized.includes('treatments') ||
      normalized.includes('management'),
    'Therapy',
  )

  return tags
}

export function getSessionDisplayTitle(
  session: Pick<SessionRecord, 'session_context' | 'remix_source_card_id' | 'custom_title'>,
) {
  const customTitle = session.custom_title?.replace(/\s+/g, ' ').trim() ?? ''

  if (customTitle) {
    return trimTitle(customTitle, 56)
  }

  const context = session.session_context?.replace(/\s+/g, ' ').trim() ?? ''

  if (!context || context.toLowerCase() === 'medical learning session') {
    return session.remix_source_card_id ? 'Remix Draft' : 'Fresh Capture'
  }

  const tags = getSessionTags(context)
  const diseaseTags = tags.filter((tag) =>
    ['Celiac', 'Rheumatoid Arthritis', 'Psoriasis', 'Multiple Sclerosis', 'Lupus'].includes(tag),
  )
  const topicTags = tags.filter((tag) =>
    ['Vaccines', 'Immunology', 'Autoimmune', 'Therapy'].includes(tag),
  )

  if (tags.includes('Autoimmune') && tags.includes('Therapy')) {
    return 'Autoimmune Therapy'
  }

  if (diseaseTags.length > 0 && topicTags.includes('Therapy')) {
    return trimTitle(`${diseaseTags[0]} Therapy`, 34)
  }

  if (diseaseTags.length > 0 && topicTags.length > 0) {
    const secondaryTag = topicTags.find((tag) => tag !== 'Therapy') ?? topicTags[0]
    return trimTitle(`${diseaseTags[0]} + ${secondaryTag}`, 34)
  }

  if (diseaseTags.length >= 2) {
    return trimTitle(`${diseaseTags[0]} + ${diseaseTags[1]}`, 34)
  }

  if (tags.length > 0) {
    return trimTitle(tags.slice(0, 2).join(' + '), 34)
  }

  const firstSentence = context.split(/(?<=[.!?])\s+/)[0]?.replace(/[.!?]+$/, '') ?? context
  const cleaned = firstSentence
    .replace(/^(the|this|these)\s+(notes?|document|page|capture)\s+(cover|covers|focus on|focuses on)\s+/i, '')
    .replace(/^(key aspects of|overview of|summary of|high-yield review of)\s+/i, '')
    .replace(/^(including|focusing on)\s+/i, '')
    .replace(/\b(and|their|specific details about|drug regimens|management strategies|administration)\b/gi, ' ')

  return trimTitle(toDisplayTitle(cleaned), 34)
}

export function getCommunityLibraryDisplayTitle({
  title,
  category,
  concept,
}: {
  title?: string | null
  category?: string | null
  concept?: string | null
}) {
  if (title?.trim()) {
    return trimTitle(title, 34)
  }

  if (category && concept) {
    return trimTitle(`${category} + ${concept}`, 34)
  }

  if (category) {
    return trimTitle(category, 34)
  }

  if (concept) {
    return trimTitle(concept, 34)
  }

  return 'Saved library'
}
