import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'
import type { CommunityIndexRecord, PointRecord } from '@/lib/types'

export type CommunityMatch = {
  card_id: string
  title: string | null
  image_url: string
  author_name: string | null
  community_template: string | null
  category: string | null
  concept: string | null
  score: number
}

function normalizeText(value: string | null | undefined) {
  return (value ?? '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

function tokenize(value: string | null | undefined) {
  return new Set(
    normalizeText(value)
      .split(' ')
      .map((token) => token.trim())
      .filter((token) => token.length > 2),
  )
}

function intersectionSize(left: Set<string>, right: Set<string>) {
  let total = 0
  for (const item of left) {
    if (right.has(item)) total += 1
  }

  return total
}

function computeMatchScore(point: Pick<PointRecord, 'text' | 'category' | 'concept'>, candidate: CommunityIndexRecord) {
  const pointTokens = tokenize(`${point.category ?? ''} ${point.concept ?? ''} ${point.text}`)
  const titleTokens = tokenize(candidate.title)
  const categoryTokens = tokenize(`${candidate.category ?? ''} ${candidate.concept ?? ''}`)

  const titleOverlap = intersectionSize(pointTokens, titleTokens)
  const categoryOverlap = intersectionSize(pointTokens, categoryTokens)
  const exactCategoryBoost =
    normalizeText(point.category) && normalizeText(point.category) === normalizeText(candidate.category) ? 0.25 : 0
  const exactConceptBoost =
    normalizeText(point.concept) && normalizeText(point.concept) === normalizeText(candidate.concept) ? 0.2 : 0

  return Number((titleOverlap * 0.16 + categoryOverlap * 0.11 + exactCategoryBoost + exactConceptBoost).toFixed(4))
}

export async function findCommunityMatchesForPoint(
  point: Pick<PointRecord, 'text' | 'category' | 'concept'>,
  limit = 3,
) {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('community_index')
    .select('*')
    .order('trend_score', { ascending: false })
    .limit(120)

  if (error) {
    throw error
  }

  const candidates = (data ?? []) as CommunityIndexRecord[]
  return candidates
    .map((candidate) => ({
      card_id: candidate.card_id,
      title: candidate.title,
      image_url: candidate.image_url,
      author_name: candidate.author_name,
      community_template: candidate.community_template,
      category: candidate.category,
      concept: candidate.concept,
      score: computeMatchScore(point, candidate),
    }))
    .filter((candidate) => candidate.score >= 0.24)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
}

export async function findCommunityMatchesForPoints(
  points: Array<Pick<PointRecord, 'id' | 'text' | 'category' | 'concept'>>,
  limit = 3,
) {
  if (points.length === 0) {
    return new Map<string, CommunityMatch[]>()
  }

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('community_index')
    .select('*')
    .order('trend_score', { ascending: false })
    .limit(120)

  if (error) {
    throw error
  }

  const candidates = (data ?? []) as CommunityIndexRecord[]
  const matchesByPointId = new Map<string, CommunityMatch[]>()

  for (const point of points) {
    const matches = candidates
      .map((candidate) => ({
        card_id: candidate.card_id,
        title: candidate.title,
        image_url: candidate.image_url,
        author_name: candidate.author_name,
        community_template: candidate.community_template,
        category: candidate.category,
        concept: candidate.concept,
        score: computeMatchScore(point, candidate),
      }))
      .filter((candidate) => candidate.score >= 0.24)
      .sort((left, right) => right.score - left.score)
      .slice(0, limit)

    matchesByPointId.set(point.id, matches)
  }

  return matchesByPointId
}
