import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { createDirectAssetUrlMap, isDirectAssetUrl } from './asset-paths'

function isMissingStorageError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false
  }

  const message = 'message' in error && typeof error.message === 'string' ? error.message.toLowerCase() : ''

  return message.includes('bucket not found') || message.includes('object not found')
}

export async function createSignedObjectUrl(
  bucket: 'notes' | 'cards' | 'clarifications',
  path: string,
  expiresIn = 60 * 60,
) {
  if (isDirectAssetUrl(path)) {
    return path
  }

  const supabase = await createClient()
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

  if (error) {
    throw error
  }

  return data.signedUrl
}

export async function createSignedObjectUrlSafe(
  bucket: 'notes' | 'cards' | 'clarifications',
  path: string,
  expiresIn = 60 * 60,
) {
  try {
    return await createSignedObjectUrl(bucket, path, expiresIn)
  } catch (error) {
    if (isMissingStorageError(error)) {
      return null
    }

    throw error
  }
}

export async function createSignedObjectUrls(
  bucket: 'notes' | 'cards' | 'clarifications',
  paths: string[],
  expiresIn = 60 * 60,
) {
  const uniquePaths = [...new Set(paths.filter(Boolean))]

  if (uniquePaths.length === 0) {
    return {} as Record<string, string>
  }

  const directUrls = createDirectAssetUrlMap(uniquePaths)
  const storagePaths = uniquePaths.filter((path) => !isDirectAssetUrl(path))

  if (storagePaths.length === 0) {
    return directUrls
  }

  const supabase = await createClient()
  const { data, error } = await supabase.storage.from(bucket).createSignedUrls(storagePaths, expiresIn)

  if (error) {
    throw error
  }

  return storagePaths.reduce<Record<string, string>>((acc, path, index) => {
    const signedUrl = data?.[index]?.signedUrl
    if (signedUrl) {
      acc[path] = signedUrl
    }
    return acc
  }, directUrls)
}

export async function createSignedObjectUrlsSafe(
  bucket: 'notes' | 'cards' | 'clarifications',
  paths: string[],
  expiresIn = 60 * 60,
) {
  try {
    return await createSignedObjectUrls(bucket, paths, expiresIn)
  } catch (error) {
    if (isMissingStorageError(error)) {
      return {}
    }

    throw error
  }
}
