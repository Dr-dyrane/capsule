import 'server-only'

import { isCommunitySchemaError } from '@/lib/community/schema'
import { isDirectAssetUrl } from '@/lib/storage/asset-paths'
import { createPublicClient } from '@/lib/supabase/public'
import { createClient } from '@/lib/supabase/server'

async function signCardAssetPath(path: string, isPublic: boolean) {
  if (isDirectAssetUrl(path)) {
    return path
  }

  if (isPublic) {
    const publicClient = createPublicClient()
    const { data, error } = await publicClient.storage.from('cards').createSignedUrl(path, 60 * 60)

    if (error) {
      if (isCommunitySchemaError(error)) {
        return null
      }

      throw error
    }

    return data.signedUrl
  }

  const supabase = await createClient()
  const { data, error } = await supabase.storage.from('cards').createSignedUrl(path, 60 * 60)

  if (error) {
    return null
  }

  return data.signedUrl
}

export async function resolveCardImageUrl(cardId: string) {
  const supabase = await createClient()
  const { data: ownedCard } = await supabase
    .from('cards')
    .select('id, image_url, status')
    .eq('id', cardId)
    .eq('status', 'complete')
    .maybeSingle()

  if (ownedCard?.image_url) {
    return signCardAssetPath(ownedCard.image_url, false)
  }

  const publicClient = createPublicClient()
  const { data: publicCard, error } = await publicClient
    .from('community_index')
    .select('image_url')
    .eq('card_id', cardId)
    .maybeSingle()

  if (error) {
    if (isCommunitySchemaError(error)) {
      return null
    }

    throw error
  }

  const typedPublicCard = publicCard as { image_url: string | null } | null

  if (!typedPublicCard?.image_url) {
    return null
  }

  return signCardAssetPath(typedPublicCard.image_url, true)
}

async function resolveOwnedLibraryCoverPath(sessionId: string) {
  const supabase = await createClient()
  const { data: session } = await supabase
    .from('sessions')
    .select('id')
    .eq('id', sessionId)
    .maybeSingle()

  if (!session?.id) {
    return null
  }

  const { data: firstCard } = await supabase
    .from('cards')
    .select('image_url')
    .eq('session_id', sessionId)
    .eq('status', 'complete')
    .order('card_order', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  return firstCard?.image_url ?? null
}

export async function resolveLibraryImageUrl(sessionId: string) {
  const ownedCoverPath = await resolveOwnedLibraryCoverPath(sessionId)

  if (ownedCoverPath) {
    return signCardAssetPath(ownedCoverPath, false)
  }

  const publicClient = createPublicClient()
  const { data: library, error } = await publicClient
    .from('community_library_index')
    .select('cover_image_url')
    .eq('session_id', sessionId)
    .maybeSingle()

  if (error) {
    if (isCommunitySchemaError(error)) {
      return null
    }

    throw error
  }

  const typedLibrary = library as { cover_image_url: string | null } | null

  if (!typedLibrary?.cover_image_url) {
    return null
  }

  return signCardAssetPath(typedLibrary.cover_image_url, true)
}
