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

  // 1. Get card to find image path
  const { data: card, error: fetchError } = await supabase
    .from('cards')
    .select('image_url')
    .eq('id', cardId)
    .single()

  if (fetchError) throw fetchError

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

  if (dbError) throw dbError

  revalidatePath('/cards')
}

/**
 * Bulk delete implementation for "Selection Mode".
 */
export async function deleteCards(cardIds: string[]) {
  const supabase = await createClient()

  const { data: cards, error: fetchError } = await supabase
    .from('cards')
    .select('image_url')
    .in('id', cardIds)

  if (fetchError) throw fetchError

  const paths = (cards ?? []).map(c => c.image_url).filter(Boolean)
  
  if (paths.length > 0) {
    await supabase.storage.from('cards').remove(paths)
  }

  const { error: dbError } = await supabase
    .from('cards')
    .delete()
    .in('id', cardIds)

  if (dbError) throw dbError

  revalidatePath('/cards')
}
