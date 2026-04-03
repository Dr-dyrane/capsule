export function isDirectAssetUrl(path: string | null | undefined) {
  if (!path) {
    return false
  }

  return (
    path.startsWith('/') ||
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:')
  )
}

export function createDirectAssetUrlMap(paths: string[]) {
  return [...new Set(paths.filter(Boolean))].reduce<Record<string, string>>((acc, path) => {
    if (isDirectAssetUrl(path)) {
      acc[path] = path
    }

    return acc
  }, {})
}

export function toExternalAssetUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path
  }

  if (path.startsWith('/')) {
    return new URL(path, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').toString()
  }

  return path
}
