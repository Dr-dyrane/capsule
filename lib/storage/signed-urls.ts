import 'server-only'

import { createClient } from '@/lib/supabase/server'

export async function createSignedObjectUrl(
  bucket: 'notes' | 'cards',
  path: string,
  expiresIn = 60 * 60,
) {
  const supabase = await createClient()
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

  if (error) {
    throw error
  }

  return data.signedUrl
}

export async function createSignedObjectUrls(
  bucket: 'notes' | 'cards',
  paths: string[],
  expiresIn = 60 * 60,
) {
  const uniquePaths = [...new Set(paths.filter(Boolean))]

  if (uniquePaths.length === 0) {
    return {} as Record<string, string>
  }

  const supabase = await createClient()
  const { data, error } = await supabase.storage.from(bucket).createSignedUrls(uniquePaths, expiresIn)

  if (error) {
    throw error
  }

  return uniquePaths.reduce<Record<string, string>>((acc, path, index) => {
    const signedUrl = data?.[index]?.signedUrl
    if (signedUrl) {
      acc[path] = signedUrl
    }
    return acc
  }, {})
}
