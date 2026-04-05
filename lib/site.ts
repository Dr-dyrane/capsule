const DEFAULT_PUBLIC_SITE_URL = 'https://capsule.dyrane.tech'

export function getCanonicalSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_CANONICAL_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    DEFAULT_PUBLIC_SITE_URL
  )
}

export function toCanonicalUrl(path: string) {
  return new URL(path, getCanonicalSiteUrl()).toString()
}

export function getCommunityCardPath(cardId: string) {
  return `/community/${cardId}`
}

export function getCommunityLibraryPath(sessionId: string) {
  return `/community/library/${sessionId}`
}

export function getCommunityCardShareUrl(cardId: string) {
  return toCanonicalUrl(getCommunityCardPath(cardId))
}

export function getCommunityLibraryShareUrl(sessionId: string) {
  return toCanonicalUrl(getCommunityLibraryPath(sessionId))
}

export function getCommunityCardShareImageUrl(cardId: string) {
  return toCanonicalUrl(`/api/share/card/${cardId}`)
}

export function getCommunityLibraryShareImageUrl(sessionId: string) {
  return toCanonicalUrl(`/api/share/library/${sessionId}`)
}
