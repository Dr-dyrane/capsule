'use server'

import { isCommunitySchemaError } from '@/lib/community/schema'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024

function getSafeFileExtension(file: File) {
  const raw = file.name.split('.').pop()?.trim().toLowerCase()
  if (raw && /^[a-z0-9]+$/i.test(raw)) {
    return raw
  }

  const typeExt = file.type.split('/')[1]?.split('+')[0]?.trim().toLowerCase()
  return typeExt || 'jpg'
}

function toUploadErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (message.includes('community publishing is not available')) {
      return 'Upload worked, but community publishing is not available yet.'
    }

    if (message.includes('bucket not found')) {
      return 'Storage is unavailable right now. Please try again in a moment.'
    }

    if (message.includes('row-level security') || message.includes('unauthorized')) {
      return 'Your sign-in expired. Sign in again and retry.'
    }

    if (message.includes('duplicate')) {
      return 'This image already exists. Choose another image or try again.'
    }

    if (message.includes('payload too large') || message.includes('too large')) {
      return 'This image is too large. Use one under 15 MB.'
    }

    return error.message
  }

  return 'We could not upload this image. Please try again.'
}

export async function uploadNote(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) throw new Error('Choose an image to continue.')
  if (!file.type.startsWith('image/')) throw new Error('Only image uploads are supported right now.')
  if (file.size <= 0) throw new Error('This image looks empty. Try another capture.')
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('This image is too large. Use one under 15 MB.')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const fileExt = getSafeFileExtension(file)
  const sessionId = uuidv4()
  const filePath = `${user.id}/${sessionId}/source.${fileExt}`
  const remixCardId = formData.get('remix_card_id')
  const normalizedRemixCardId =
    typeof remixCardId === 'string' && remixCardId.trim().length > 0
      ? remixCardId.trim()
      : null

  try {
    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from('notes')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // 2. Create Session Record
    const wantsPublish = formData.get('publish') === 'true'
    const baseSession = {
      id: sessionId,
      user_id: user.id,
      source_url: filePath,
      status: 'processing',
      remix_source_card_id: normalizedRemixCardId,
    }

    let session:
      | {
          id: string
        }
      | null = null

    const initialInsert = await supabase
      .from('sessions')
      .insert({
        ...baseSession,
        visibility: wantsPublish ? 'published' : 'private',
      })
      .select()
      .single()

    if (initialInsert.error) {
      if (!isCommunitySchemaError(initialInsert.error)) {
        throw initialInsert.error
      }

      const fallbackInsert = await supabase
        .from('sessions')
        .insert({
          id: sessionId,
          user_id: user.id,
          source_url: filePath,
          status: 'processing',
        })
        .select()
        .single()

      if (fallbackInsert.error) throw fallbackInsert.error
      session = fallbackInsert.data
    } else {
      session = initialInsert.data
    }

    if (!session) {
      throw new Error('We could not create the session. Please try again.')
    }

    return session
  } catch (error) {
    throw new Error(toUploadErrorMessage(error))
  }
}
