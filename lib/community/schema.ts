export type CommunityVisibility = 'private' | 'published'

type SupabaseLikeError = {
  code?: string
  message?: string
  details?: string | null
  hint?: string | null
}

const COMMUNITY_SCHEMA_CODES = new Set(['42703', '42P01', 'PGRST200', 'PGRST205'])
const COMMUNITY_SCHEMA_PATTERNS = [
  'profiles',
  'published_by',
  'visibility',
  'published_at',
  'community_template',
  'community_hash',
  'community_index',
  'community_reactions',
  'like_count',
  'save_count',
  'report_count',
  'author_name',
  'category',
  'concept',
  'trend_score',
  'community_reports',
  'remix_source_card_id',
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

export function isCommunitySchemaError(error: unknown) {
  const candidate = toSupabaseLikeError(error)

  if (!candidate) {
    return false
  }

  if (candidate.code && COMMUNITY_SCHEMA_CODES.has(candidate.code)) {
    return true
  }

  const text = getCombinedErrorText(candidate)
  return COMMUNITY_SCHEMA_PATTERNS.some((pattern) => text.includes(pattern))
}

export function getSafeCommunityVisibility(
  visibility: string | null | undefined,
): CommunityVisibility {
  return visibility === 'published' ? 'published' : 'private'
}
