'use server'

import { createSignedObjectUrls } from '@/lib/storage/signed-urls'

export async function getSignedCardUrls(paths: string[]) {
  return await createSignedObjectUrls('cards', paths, 60 * 60)
}
