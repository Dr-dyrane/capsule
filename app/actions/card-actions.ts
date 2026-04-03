'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Updates a card's title and category.
 * Useful for refining AI-generated names and maintaining taxonomy.
 */
export async function updateCard(cardId: string, updates: { title?: string; category?: string }) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('cards')
    .update(updates)
    .eq('id', cardId)

  if (error) throw error

  revalidatePath('/cards')
  revalidatePath(`/cards/${cardId}`)
}

/**
 * Deletes a card and its associated image from the storage bucket.
 */
export async function deleteCard(cardId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // 1. Get card to find image path
  const { data: card, error: fetchError } = await supabase
    .from('cards')
    .select('image_url, session_id')
    .eq('id', cardId)
    .single()

  if (fetchError) throw fetchError

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('id')
    .eq('id', card.session_id)
    .eq('user_id', user.id)
    .single()

  if (sessionError || !session) {
    throw new Error('Card not found')
  }

  // 2. Delete image from Storage
  if (card.image_url) {
    const { error: storageError } = await supabase.storage
      .from('cards')
      .remove([card.image_url])
    
    if (storageError) console.error('Storage deletion error:', storageError)
  }

  // 3. Delete card from DB
  const { error: dbError } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId)
    .eq('session_id', card.session_id)

  if (dbError) throw dbError

  revalidatePath('/cards')
  revalidatePath(`/cards/${cardId}`)
  revalidatePath(`/scan/${card.session_id}`)
}

/**
 * Bulk delete implementation for "Selection Mode".
 */
export async function deleteCards(cardIds: string[]) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: cards, error: fetchError } = await supabase
    .from('cards')
    .select('id, image_url, session_id')
    .in('id', cardIds)

  if (fetchError) throw fetchError
  if (!cards || cards.length === 0) {
    throw new Error('No cards found')
  }

  const sessionIds = [...new Set(cards.map((card) => card.session_id).filter(Boolean))]

  const { data: sessions, error: sessionsError } = await supabase
    .from('sessions')
    .select('id')
    .eq('user_id', user.id)
    .in('id', sessionIds)

  if (sessionsError) throw sessionsError

  const authorizedSessionIds = new Set((sessions ?? []).map((session) => session.id))
  const authorizedCards = cards.filter((card) => authorizedSessionIds.has(card.session_id))

  if (authorizedCards.length === 0) {
    throw new Error('No cards found')
  }

  const paths = authorizedCards.map((card) => card.image_url).filter(Boolean)
  
  if (paths.length > 0) {
    await supabase.storage.from('cards').remove(paths)
  }

  const { error: dbError } = await supabase
    .from('cards')
    .delete()
    .in('id', authorizedCards.map((card) => card.id))

  if (dbError) throw dbError

  revalidatePath('/cards')
  authorizedSessionIds.forEach((sessionId) => revalidatePath(`/scan/${sessionId}`))
}
