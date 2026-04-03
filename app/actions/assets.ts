'use server'

import { createSignedObjectUrlsSafe } from '@/lib/storage/signed-urls'

export async function getSignedCardUrls(paths: string[]) {
  return await createSignedObjectUrlsSafe('cards', paths, 60 * 60)
}

export async function getSignedNoteUrls(paths: string[]) {
  return await createSignedObjectUrlsSafe('notes', paths, 60 * 60)
}
