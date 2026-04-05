export type StableDbImageKind = 'card' | 'library'

export function getCardImagePath(cardId: string) {
  return `/api/assets/card/${cardId}`
}

export function getLibraryImagePath(sessionId: string) {
  return `/api/assets/library/${sessionId}`
}

export function getStableDbImagePath(kind: StableDbImageKind, id: string) {
  return kind === 'card' ? getCardImagePath(id) : getLibraryImagePath(id)
}
