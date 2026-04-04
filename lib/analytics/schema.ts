type SupabaseLikeError = {
  code?: string
  message?: string
  details?: string | null
  hint?: string | null
}

const ANALYTICS_SCHEMA_CODES = new Set(['42703', '42P01', 'PGRST200', 'PGRST205'])
const ANALYTICS_SCHEMA_PATTERNS = ['product_events']

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

export function isAnalyticsSchemaError(error: unknown) {
  const candidate = toSupabaseLikeError(error)

  if (!candidate) {
    return false
  }

  if (candidate.code && ANALYTICS_SCHEMA_CODES.has(candidate.code)) {
    return true
  }

  const text = getCombinedErrorText(candidate)
  return ANALYTICS_SCHEMA_PATTERNS.some((pattern) => text.includes(pattern))
}
