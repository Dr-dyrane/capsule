import { createClient } from '@/lib/supabase/server'
import { generateCardImage } from '@/lib/ai/generate'

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

  try {
    // 2. Generate Image
    const imageUrl = await generateCardImage(point.text, point.category)

    // 3. Download and Upload to Supabase Storage (to persist)
    const imageRes = await fetch(imageUrl)
    const imageBlob = await imageRes.blob()
    
    const cardId = crypto.randomUUID()
    const filePath = `${userId}/${sessionId}/${cardId}.png`

    const { error: uploadError } = await supabase.storage
      .from('cards')
      .upload(filePath, imageBlob, {
        contentType: 'image/png'
      })

    if (uploadError) throw uploadError

    // 4. Create Card record
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .insert({
        id: cardId,
        point_id: pointId,
        session_id: sessionId,
        image_url: filePath,
        title: point.text.split(':')[0], // Simple title extraction
        status: 'complete'
      })
      .select()
      .single()

    if (cardError) throw cardError

    return card
  } catch (error) {
    console.error(error)
    // Create error record if needed or handle via status
    throw error
  }
}
