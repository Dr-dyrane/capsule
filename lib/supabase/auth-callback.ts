import type { EmailOtpType } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

const AUTH_ERROR_MESSAGE = 'Sign in did not finish.'
const GOOGLE_AUTH_ERROR_MESSAGE = 'Google sign-in did not finish.'

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

function buildLoginRedirect({
  request,
  message,
  next,
  errorCode,
}: {
  request: Request
  message: string
  next: string
  errorCode?: string
}) {
  const url = new URL('/login', new URL(request.url).origin)
  url.searchParams.set('error', message)

  if (next !== '/scan') {
    url.searchParams.set('next', next)
  }

  if (errorCode) {
    url.searchParams.set('error_code', errorCode)
  }

  return url.toString()
}

function isOAuthExchangeFailure(message?: string | null) {
  if (!message) {
    return false
  }

  const normalized = message.toLowerCase()

  return (
    normalized.includes('unable to exchange external code') ||
    (normalized.includes('exchange') && normalized.includes('oauth')) ||
    (normalized.includes('exchange') && normalized.includes('code'))
  )
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
    const errorCode = isOAuthExchangeFailure(authError) ? 'oauth_exchange_failed' : 'auth_callback_failed'
    const message = errorCode === 'oauth_exchange_failed' ? GOOGLE_AUTH_ERROR_MESSAGE : AUTH_ERROR_MESSAGE

    return NextResponse.redirect(
      buildLoginRedirect({
        request,
        message,
        next,
        errorCode,
      }),
    )
  }

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(buildAbsoluteRedirect(request, next))
    }

    const errorCode = isOAuthExchangeFailure(error.message) ? 'oauth_exchange_failed' : 'auth_callback_failed'
    const message = errorCode === 'oauth_exchange_failed' ? GOOGLE_AUTH_ERROR_MESSAGE : AUTH_ERROR_MESSAGE

    return NextResponse.redirect(
      buildLoginRedirect({
        request,
        message,
        next,
        errorCode,
      }),
    )
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

  return NextResponse.redirect(
    buildLoginRedirect({
      request,
      message: AUTH_ERROR_MESSAGE,
      next,
      errorCode: 'auth_callback_failed',
    }),
  )
}
