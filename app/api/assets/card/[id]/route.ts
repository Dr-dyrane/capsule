import { NextResponse } from 'next/server'

import { proxyImageResponse } from '@/lib/assets/proxy-image'
import { resolveCardImageUrl } from '@/lib/assets/resolve-db-image'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const imageUrl = await resolveCardImageUrl(id)

  if (!imageUrl) {
    return new NextResponse('Not found', {
      status: 404,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  }

  return proxyImageResponse(imageUrl, request.url)
}
