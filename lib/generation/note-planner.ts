import type { PointRecord } from '@/lib/types'
import { resolveGenerationStrategy } from '@/lib/ai/strategy'
import type { NoteRole } from './render-policy'

export type PlannedPoint = {
  pointId: string
  role: NoteRole
  clusterKey: string
  score: number
}

export type NotePlan = {
  heroPointId: string | null
  supportPointIds: string[]
  overflowPointIds: string[]
  items: PlannedPoint[]
}

function normalizeKey(value: string | null | undefined) {
  return (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function getClusterKey(point: Pick<PointRecord, 'category' | 'concept' | 'text'>) {
  const category = normalizeKey(point.category)
  const concept = normalizeKey(point.concept)
  if (category) return category
  if (concept) return concept

  const lead = normalizeKey(point.text).split(' ').slice(0, 4).join(' ')
  return lead || 'general'
}

function getConceptWeight(point: Pick<PointRecord, 'concept'>) {
  const concept = normalizeKey(point.concept)
  if (concept.includes('disease')) return 18
  if (concept.includes('regimen')) return 16
  if (concept.includes('drug')) return 14
  if (concept.includes('comparison')) return 13
  if (concept.includes('timeline')) return 12
  if (concept.includes('mechanism')) return 11
  return 10
}

function getKeywordWeight(text: string) {
  const normalized = normalizeKey(text)
  let score = 0

  if (/(management|treatment|therapy|regimen)/.test(normalized)) score += 5
  if (/(risk factor|natural hx|natural history|timeline|stage)/.test(normalized)) score += 4
  if (/(compare|versus|vs|difference|avoid|contraindicat)/.test(normalized)) score += 3
  if (/(first.line|first line|systemic|severe|acute)/.test(normalized)) score += 2

  return score
}

function getTemplateWeight(point: Pick<PointRecord, 'text' | 'category' | 'concept'>) {
  const strategy = resolveGenerationStrategy(point.text, point.category, point.concept)

  if (strategy.templateId === 'cascade') return 6
  if (strategy.templateId === 'protocol-board') return 5
  if (strategy.templateId === 'comparison-board') return 4
  if (strategy.templateId === 'timeline') return 4
  if (strategy.routeLevel === 'level-3') return 3
  if (strategy.routeLevel === 'level-2') return 2

  return 1
}

function scorePoint(point: Pick<PointRecord, 'text' | 'category' | 'concept'>) {
  const wordCount = normalizeKey(point.text).split(' ').filter(Boolean).length
  return getConceptWeight(point) + getKeywordWeight(point.text) + getTemplateWeight(point) + Math.min(wordCount, 22) / 10
}

export function planNotePoints(points: PointRecord[]): NotePlan {
  if (points.length === 0) {
    return {
      heroPointId: null,
      supportPointIds: [],
      overflowPointIds: [],
      items: [],
    }
  }

  const clusterScores = new Map<string, number>()
  const pointScores = points.map((point) => {
    const clusterKey = getClusterKey(point)
    const score = scorePoint(point)
    clusterScores.set(clusterKey, (clusterScores.get(clusterKey) ?? 0) + score + 1)

    return {
      point,
      clusterKey,
      score,
    }
  })

  const ranked = [...pointScores].sort((left, right) => {
    const leftCluster = clusterScores.get(left.clusterKey) ?? 0
    const rightCluster = clusterScores.get(right.clusterKey) ?? 0

    if (rightCluster !== leftCluster) {
      return rightCluster - leftCluster
    }

    if (right.score !== left.score) {
      return right.score - left.score
    }

    return left.point.sort_order - right.point.sort_order
  })

  const hero = ranked[0]
  const support: typeof ranked = []
  const overflow: typeof ranked = []
  const usedClusters = new Set<string>(hero ? [hero.clusterKey] : [])

  for (const candidate of ranked.slice(1)) {
    if (support.length < 3 && (!usedClusters.has(candidate.clusterKey) || support.length < 1)) {
      support.push(candidate)
      usedClusters.add(candidate.clusterKey)
      continue
    }

    overflow.push(candidate)
  }

  const items: PlannedPoint[] = points.map((point) => {
    const rankedPoint = pointScores.find((candidate) => candidate.point.id === point.id)
    const role: NoteRole =
      point.id === hero?.point.id
        ? 'hero'
        : support.some((candidate) => candidate.point.id === point.id)
          ? 'support'
          : 'overflow'

    return {
      pointId: point.id,
      role,
      clusterKey: rankedPoint?.clusterKey ?? 'general',
      score: rankedPoint?.score ?? 0,
    }
  })

  return {
    heroPointId: hero?.point.id ?? null,
    supportPointIds: support.map((candidate) => candidate.point.id),
    overflowPointIds: overflow.map((candidate) => candidate.point.id),
    items,
  }
}
