import { NextResponse, type NextRequest } from 'next/server'

import { getCommunityCardShareImageSource } from '@/lib/share/public-share'

export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const image = await getCommunityCardShareImageSource(id)

  if (!image?.imageUrl) {
    return new NextResponse('Not found', { status: 404 })
  }

  return NextResponse.redirect(image.imageUrl, { status: 307 })
}
