import type { EmailOtpType } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

const AUTH_ERROR_MESSAGE = 'We could not complete that sign in link'

function buildAbsoluteRedirect(request: Request, next: string) {
  const { origin } = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  if (isLocalEnv) {
    return `${origin}${next}`
  }

  if (forwardedHost) {
    return `https://${forwardedHost}${next}`
  }

  return `${origin}${next}`
}

function buildLoginRedirect(request: Request, message: string, next: string) {
  const url = new URL('/login', new URL(request.url).origin)
  url.searchParams.set('error', message)

  if (next !== '/scan') {
    url.searchParams.set('next', next)
  }

  return url.toString()
}

export function sanitizeNextPath(candidate?: string | null) {
  if (!candidate) {
    return '/scan'
  }

  if (!candidate.startsWith('/') || candidate.startsWith('//')) {
    return '/scan'
  }

  return candidate
}

export async function handleAuthCallback(request: Request) {
  const { searchParams } = new URL(request.url)
  const next = sanitizeNextPath(searchParams.get('next'))
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const authError = searchParams.get('error_description') ?? searchParams.get('error')

  if (authError) {
    return NextResponse.redirect(buildLoginRedirect(request, authError, next))
  }

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(buildAbsoluteRedirect(request, next))
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    })

    if (!error) {
      return NextResponse.redirect(buildAbsoluteRedirect(request, next))
    }
  }

  return NextResponse.redirect(buildLoginRedirect(request, AUTH_ERROR_MESSAGE, next))
}
