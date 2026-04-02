'use server'

import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function uploadNote(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const fileExt = file.name.split('.').pop()
  const sessionId = uuidv4()
  const filePath = `${user.id}/${sessionId}/source.${fileExt}`

  // 1. Upload to Storage
  const { error: uploadError } = await supabase.storage
    .from('notes')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  // 2. Create Session Record
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      id: sessionId,
      user_id: user.id,
      source_url: filePath,
      status: 'processing'
    })
    .select()
    .single()

  if (sessionError) throw sessionError

  return session
}
