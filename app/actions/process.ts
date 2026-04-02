'use server'

import { createClient } from '@/lib/supabase/server'
import { extractPointsFromImage } from '@/lib/ai/ocr'
import { createSignedObjectUrl } from '@/lib/storage/signed-urls'

export async function processNote(sessionId: string) {
  const supabase = await createClient()
  
  // 1. Get Session
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .update({ status: 'processing' })
    .eq('id', sessionId)
    .select()
    .single()

  if (sessionError) throw sessionError

  // 2. Create a short-lived signed URL for OCR instead of exposing the note publicly.
  const signedUrl = await createSignedObjectUrl('notes', session.source_url, 60 * 10)

  // 3. Extract Points
  try {
    const result = await extractPointsFromImage(signedUrl)

    // 4. Save Points to DB
    const pointsToInsert = result.points.map((p, index) => ({
      session_id: sessionId,
      text: p.text,
      category: p.category,
      concept: p.concept,
      sort_order: index,
      card_count: p.card_count
    }))

    const { error: pointsError } = await supabase
      .from('points')
      .insert(pointsToInsert)

    if (pointsError) throw pointsError

    // 5. Update Session
    await supabase
      .from('sessions')
      .update({ 
        status: 'generating',
        point_count: result.points.length 
      })
      .eq('id', sessionId)

    return { success: true, count: result.points.length }
  } catch (error) {
    console.error(error)
    await supabase
      .from('sessions')
      .update({ status: 'error' })
      .eq('id', sessionId)
    throw error
  }
}
