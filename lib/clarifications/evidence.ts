import 'server-only'

import { v4 as uuidv4 } from 'uuid'

import { createClient } from '@/lib/supabase/server'

const MAX_CLARIFICATION_EVIDENCE_BYTES = 8 * 1024 * 1024

function getSafeFileExtension(file: File) {
  const raw = file.name.split('.').pop()?.trim().toLowerCase()
  if (raw && /^[a-z0-9]+$/i.test(raw)) {
    return raw
  }

  const typeExt = file.type.split('/')[1]?.split('+')[0]?.trim().toLowerCase()
  return typeExt || 'jpg'
}

export function getClarificationEvidenceFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File)) {
    return null
  }

  if (value.size <= 0 || value.name.length === 0) {
    return null
  }

  return value
}

export function ensureClarificationEvidenceFile(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Use an image for evidence.')
  }

  if (file.size <= 0) {
    throw new Error('This image looks empty.')
  }

  if (file.size > MAX_CLARIFICATION_EVIDENCE_BYTES) {
    throw new Error('Use an image under 8 MB.')
  }

  return file
}

export async function uploadClarificationEvidenceFile(userId: string, cardId: string, file: File) {
  const safeFile = ensureClarificationEvidenceFile(file)
  const supabase = await createClient()
  const fileExt = getSafeFileExtension(safeFile)
  const filePath = `${userId}/${cardId}/${uuidv4()}.${fileExt}`

  const { error } = await supabase.storage.from('clarifications').upload(filePath, safeFile)

  if (error) {
    throw error
  }

  return filePath
}

export async function removeClarificationEvidenceFiles(paths: Array<string | null | undefined>) {
  const safePaths = [...new Set(paths.filter((path): path is string => typeof path === 'string' && path.length > 0))]

  if (safePaths.length === 0) {
    return
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.storage.from('clarifications').remove(safePaths)

    if (error) {
      console.error('Failed to remove clarification evidence:', error)
    }
  } catch (error) {
    console.error('Failed to cleanup clarification evidence:', error)
  }
}
