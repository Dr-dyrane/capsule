export type ShowcaseCandidate = {
  src: string
  alt: string
  template?: string | null
  authorId?: string | null
}

export function curateShowcaseCards(candidates: ShowcaseCandidate[], limit: number = 6) {
  const selected: ShowcaseCandidate[] = []
  const seenTemplates = new Set<string>()
  const seenAuthors = new Set<string>()

  for (const candidate of candidates) {
    const templateKey = candidate.template || 'mechanism-board'
    const authorKey = candidate.authorId || 'unknown-author'

    if (seenTemplates.has(templateKey) || seenAuthors.has(authorKey)) {
      continue
    }

    selected.push(candidate)
    seenTemplates.add(templateKey)
    seenAuthors.add(authorKey)

    if (selected.length >= limit) {
      return selected
    }
  }

  for (const candidate of candidates) {
    if (selected.some((entry) => entry.src === candidate.src)) {
      continue
    }

    selected.push(candidate)

    if (selected.length >= limit) {
      break
    }
  }

  return selected
}
