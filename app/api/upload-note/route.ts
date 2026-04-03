import { NextResponse } from 'next/server'

import { uploadNoteFromFormData } from '@/lib/uploads/upload-note'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const session = await uploadNoteFromFormData(formData)

    return NextResponse.json(session)
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'We could not upload this image. Please try again.'
    const status = message.toLowerCase().includes('sign-in') ? 401 : 400

    return NextResponse.json({ error: message }, { status })
  }
}
