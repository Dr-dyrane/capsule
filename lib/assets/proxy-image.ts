import 'server-only'

import { NextResponse } from 'next/server'

const DEFAULT_CACHE_CONTROL = 'public, max-age=300, s-maxage=300, stale-while-revalidate=86400'

function buildImageHeaders(upstream: Response) {
  const headers = new Headers()
  const contentType = upstream.headers.get('content-type') || 'image/png'

  headers.set('Content-Type', contentType)
  headers.set('Cache-Control', upstream.headers.get('cache-control') || DEFAULT_CACHE_CONTROL)

  const etag = upstream.headers.get('etag')
  if (etag) {
    headers.set('ETag', etag)
  }

  const lastModified = upstream.headers.get('last-modified')
  if (lastModified) {
    headers.set('Last-Modified', lastModified)
  }

  return headers
}

export async function proxyImageResponse(imageUrl: string, requestUrl: string) {
  const resolvedImageUrl = imageUrl.startsWith('/')
    ? new URL(imageUrl, requestUrl).toString()
    : imageUrl

  const upstream = await fetch(resolvedImageUrl, {
    redirect: 'follow',
    cache: 'no-store',
  })

  if (!upstream.ok || !upstream.body) {
    return new NextResponse('Not found', {
      status: upstream.status || 404,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  }

  const contentType = upstream.headers.get('content-type') || ''

  if (!contentType.startsWith('image/')) {
    return new NextResponse('Invalid image', {
      status: 502,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: buildImageHeaders(upstream),
  })
}
