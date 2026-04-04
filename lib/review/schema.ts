type SupabaseLikeError = {
  code?: string
  message?: string
  details?: string | null
  hint?: string | null
}

const REVIEW_SCHEMA_CODES = new Set(['42703', '42P01', 'PGRST200', 'PGRST205'])
const REVIEW_SCHEMA_PATTERNS = [
  'review_items',
  'review_events',
  'community_review_index',
  'next_review_at',
  'last_score',
  'review_count',
  'lapse_count',
  'source_type',
  'point_text',
]

function toSupabaseLikeError(error: unknown): SupabaseLikeError | null {
  if (!error || typeof error !== 'object') {
    return null
  }

  return error as SupabaseLikeError
}

function getCombinedErrorText(error: SupabaseLikeError) {
  return [error.message, error.details, error.hint]
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' ')
    .toLowerCase()
}

export function isReviewSchemaError(error: unknown) {
  const candidate = toSupabaseLikeError(error)

  if (!candidate) {
    return false
  }

  if (candidate.code && REVIEW_SCHEMA_CODES.has(candidate.code)) {
    return true
  }

  const text = getCombinedErrorText(candidate)
  return REVIEW_SCHEMA_PATTERNS.some((pattern) => text.includes(pattern))
}
