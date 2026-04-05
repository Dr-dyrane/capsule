import 'server-only'

import { isCommunitySchemaError } from '@/lib/community/schema'
import { isDirectAssetUrl } from '@/lib/storage/asset-paths'
import { createPublicClient } from '@/lib/supabase/public'
import type { CommunityIndexRecord, CommunityLibraryIndexRecord } from '@/lib/types'

type CommunityCardShareRecord = Pick<
  CommunityIndexRecord,
  'card_id' | 'title' | 'concept' | 'category' | 'author_name' | 'image_url'
>

type CommunityLibraryShareRecord = Pick<
  CommunityLibraryIndexRecord,
  'session_id' | 'title' | 'concept' | 'category' | 'author_name' | 'cover_image_url' | 'card_count'
>

async function createPublicSignedUrl(bucket: 'cards', path: string, expiresIn = 60 * 60 * 24 * 7) {
  if (isDirectAssetUrl(path)) {
    return path
  }

  const publicClient = createPublicClient()
  const { data, error } = await publicClient.storage.from(bucket).createSignedUrl(path, expiresIn)

  if (error) {
    if (isCommunitySchemaError(error)) {
      return null
    }

    throw error
  }

  return data.signedUrl
}

export async function getCommunityCardShareRecord(cardId: string) {
  const publicClient = createPublicClient()
  const { data, error } = await publicClient
    .from('community_index')
    .select('card_id, title, concept, category, author_name, image_url')
    .eq('card_id', cardId)
    .maybeSingle()

  if (error) {
    if (isCommunitySchemaError(error)) {
      return null
    }

    throw error
  }

  return (data ?? null) as CommunityCardShareRecord | null
}

export async function getCommunityCardShareImageSource(cardId: string) {
  const card = await getCommunityCardShareRecord(cardId)

  if (!card?.image_url) {
    return null
  }

  const imageUrl = await createPublicSignedUrl('cards', card.image_url)

  if (!imageUrl) {
    return null
  }

  return {
    card,
    imageUrl,
  }
}

export async function getCommunityLibraryShareRecord(sessionId: string) {
  const publicClient = createPublicClient()
  const { data, error } = await publicClient
    .from('community_library_index')
    .select('session_id, title, concept, category, author_name, cover_image_url, card_count')
    .eq('session_id', sessionId)
    .maybeSingle()

  if (error) {
    if (isCommunitySchemaError(error)) {
      return null
    }

    throw error
  }

  return (data ?? null) as CommunityLibraryShareRecord | null
}

export async function getCommunityLibraryShareImageSource(sessionId: string) {
  const library = await getCommunityLibraryShareRecord(sessionId)

  if (!library) {
    return null
  }

  let assetPath: string | null = library.cover_image_url || null

  if (!assetPath) {
    const publicClient = createPublicClient()
    const { data: firstCard, error } = await publicClient
      .from('community_index')
      .select('image_url')
      .eq('session_id', sessionId)
      .order('published_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (error) {
      if (isCommunitySchemaError(error)) {
        return null
      }

      throw error
    }

    assetPath = ((firstCard as { image_url?: string | null } | null)?.image_url ?? null)
  }

  if (!assetPath) {
    return null
  }

  const imageUrl = await createPublicSignedUrl('cards', assetPath)

  if (!imageUrl) {
    return null
  }

  return {
    library,
    imageUrl,
  }
}
