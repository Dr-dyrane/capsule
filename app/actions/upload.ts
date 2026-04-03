'use server'

import { uploadNoteFromFormData } from '@/lib/uploads/upload-note'

export async function uploadNote(formData: FormData) {
  return uploadNoteFromFormData(formData)
}
