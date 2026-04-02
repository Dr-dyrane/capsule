'use server'

import { createClient } from '@/lib/supabase/server'
import { generateCardImage } from '@/lib/ai/generate'
import type { PointRecord } from '@/lib/types'

export async function generateCard(pointId: string) {
  const supabase = await createClient()

  // 1. Get Point details
  const { data: point, error: pointError } = await supabase
    .from('points')
    .select('*, sessions(user_id)')
    .eq('id', pointId)
    .single()

  if (pointError) throw pointError

  const sessionId = point.session_id
  const userId = point.sessions.user_id
  const cardId = crypto.randomUUID()
  const filePath = `${userId}/${sessionId}/${cardId}.png`

  const { error: placeholderError } = await supabase
    .from('cards')
    .insert({
      id: cardId,
      point_id: pointId,
      session_id: sessionId,
      image_url: filePath,
      title: point.text.split(':')[0].trim(),
      status: 'generating',
      card_order: point.sort_order ?? 1,
    })

  if (placeholderError) throw placeholderError

  try {
    // 2. Generate Image
    const imageUrl = await generateCardImage(point.text, point.category)

    // 3. Download and Upload to Supabase Storage (to persist)
    const imageRes = await fetch(imageUrl)
    if (!imageRes.ok) {
      throw new Error(`Failed to fetch generated image: ${imageRes.status}`)
    }
    const imageBlob = await imageRes.blob()

    const { error: uploadError } = await supabase.storage
      .from('cards')
      .upload(filePath, imageBlob, {
        contentType: 'image/png'
      })

    if (uploadError) throw uploadError

    // 4. Finalize Card record
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .update({
        image_url: filePath,
        status: 'complete',
      })
      .eq('id', cardId)
      .select()
      .single()

    if (cardError) throw cardError

    return card
  } catch (error) {
    console.error(error)
    await supabase
      .from('cards')
      .update({ status: 'error' })
      .eq('id', cardId)
    throw error
  }
}

export async function generateSessionCards(sessionId: string) {
  const supabase = await createClient()

  const { data: points, error: pointsError } = await supabase
    .from('points')
    .select('*')
    .eq('session_id', sessionId)
    .order('sort_order', { ascending: true })

  if (pointsError) throw pointsError

  const typedPoints = (points ?? []) as PointRecord[]

  try {
    for (const point of typedPoints) {
      const { data: existingCard } = await supabase
        .from('cards')
        .select('id')
        .eq('point_id', point.id)
        .maybeSingle()

      if (existingCard) continue

      await generateCard(point.id)
    }

    const { count } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId)
      .eq('status', 'complete')

    await supabase
      .from('sessions')
      .update({
        status: 'complete',
        card_count: count ?? 0,
      })
      .eq('id', sessionId)

    return { success: true, count: count ?? 0 }
  } catch (error) {
    console.error(error)
    await supabase
      .from('sessions')
      .update({ status: 'error' })
      .eq('id', sessionId)

    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Generation failed',
    }
  }
}
