import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CircleAlert, MailCheck } from 'lucide-react'

import AuthEntry from './AuthEntry'
import { sanitizeNextPath } from '@/lib/supabase/auth-callback'
import { createClient } from '@/lib/supabase/server'

import styles from './LoginPage.module.css'

type SearchParamsValue = string | string[] | undefined

type LoginPageProps = {
  searchParams?: Promise<Record<string, SearchParamsValue>>
}

const AUTH_EMAIL_COOKIE = 'capsule_auth_email'

type LoginIssue = {
  title: string
  body: string
}

type AuthMethod = 'password' | 'magic'
type AuthMode = 'signin' | 'signup'
type PendingKind = 'magic_link' | 'confirm_email'

function getStringValue(value: SearchParamsValue) {
  return typeof value === 'string' ? value : undefined
}

function getAuthMethod(value?: string): AuthMethod {
  return value === 'magic' ? 'magic' : 'password'
}

function getAuthMode(value?: string): AuthMode {
  return value === 'signup' ? 'signup' : 'signin'
}

function getPendingKind(value?: string): PendingKind {
  return value === 'confirm_email' ? 'confirm_email' : 'magic_link'
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
}

function buildCallbackUrl(next: string) {
  const url = new URL('/callback', getAppUrl())

  if (next !== '/scan') {
    url.searchParams.set('next', next)
  }

  return url.toString()
}

function getInboxUrl(email?: string) {
  if (!email) {
    return null
  }

  const domain = email.split('@')[1]?.toLowerCase()

  if (!domain) {
    return null
  }

  if (domain.includes('gmail.com') || domain.includes('googlemail.com')) {
    return 'https://mail.google.com/mail/u/0/#inbox'
  }

  if (
    domain.includes('outlook.com') ||
    domain.includes('hotmail.com') ||
    domain.includes('live.com') ||
    domain.includes('msn.com')
  ) {
    return 'https://outlook.live.com/mail/0/inbox'
  }

  if (domain.includes('icloud.com') || domain.includes('me.com') || domain.includes('mac.com')) {
    return 'https://www.icloud.com/mail'
  }

  if (domain.includes('yahoo.com')) {
    return 'https://mail.yahoo.com'
  }

  return null
}

function formatRetryTime(value?: string) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function getLoginIssue(error: string | undefined, errorCode: string | undefined, retryAt: string | undefined) {
  if (!error) {
    return null
  }

  const retryTime = formatRetryTime(retryAt)

  if (errorCode === 'email_rate_limit') {
    return {
      title: 'Try again later',
      body: retryTime ? `Email is cooling down. Retry after ${retryTime}.` : 'Email is cooling down.',
    } satisfies LoginIssue
  }

  if (errorCode === 'otp_cooldown') {
    return {
      title: 'Link already sent',
      body: retryTime ? `Try again after ${retryTime}.` : 'Try the last email or wait a minute.',
    } satisfies LoginIssue
  }

  if (errorCode === 'invalid_password_login') {
    return {
      title: 'Wrong email or password',
      body: 'Try again or use another method.',
    } satisfies LoginIssue
  }

  if (errorCode === 'email_not_confirmed') {
    return {
      title: 'Confirm your email first',
      body: 'Use the link we sent.',
    } satisfies LoginIssue
  }

  if (errorCode === 'weak_password') {
    return {
      title: 'Password too short',
      body: 'Use at least 8 characters.',
    } satisfies LoginIssue
  }

  if (errorCode === 'oauth_exchange_failed') {
    return {
      title: 'Google sign-in did not finish',
      body: 'Try Google again or use email.',
    } satisfies LoginIssue
  }

  return {
    title: 'Sign in did not finish',
    body: 'Try again or use email.',
  } satisfies LoginIssue
}

function buildLoginRedirect({
  next,
  error,
  errorCode,
  retryAt,
  sent,
  method,
  mode,
  sentKind,
  email,
}: {
  next: string
  error: string
  errorCode?: string
  retryAt?: string
  sent?: boolean
  method?: AuthMethod
  mode?: AuthMode
  sentKind?: PendingKind
  email?: string
}) {
  const params = new URLSearchParams()
  params.set('error', error)

  if (next !== '/scan') {
    params.set('next', next)
  }

  if (errorCode) {
    params.set('error_code', errorCode)
  }

  if (retryAt) {
    params.set('retry_at', retryAt)
  }

  if (sent) {
    params.set('sent', '1')
  }

  if (method && method !== 'password') {
    params.set('method', method)
  }

  if (mode && mode !== 'signin') {
    params.set('mode', mode)
  }

  if (sentKind && sentKind !== 'magic_link') {
    params.set('sent_kind', sentKind)
  }

  if (email) {
    params.set('email', email)
  }

  return `/login?${params.toString()}`
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {}
  const next = sanitizeNextPath(getStringValue(params.next))
  const error = getStringValue(params.error)
  const errorCode = getStringValue(params.error_code)
  const retryAt = getStringValue(params.retry_at)
  const sent = getStringValue(params.sent) === '1'
  const methodParam = getStringValue(params.method)
  const modeParam = getStringValue(params.mode)
  const method = methodParam ? getAuthMethod(methodParam) : undefined
  const mode = modeParam ? getAuthMode(modeParam) : undefined
  const sentKind = getPendingKind(getStringValue(params.sent_kind))
  const emailParam = getStringValue(params.email)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect(next)
  }

  async function requestMagicLink(formData: FormData) {
    'use server'

    const email = String(formData.get('email') ?? '').trim().toLowerCase()
    const requestedNext = sanitizeNextPath(String(formData.get('next') ?? '/scan'))
    const source = String(formData.get('source') ?? 'request')
    const cookieStore = await cookies()

    if (!email) {
      redirect(
        buildLoginRedirect({
          next: requestedNext,
          error: 'Enter your email to continue',
          method: 'magic',
          sent: source === 'resend',
          email,
        }),
      )
    }

    const serverSupabase = await createClient()
    const { error: signInError } = await serverSupabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: buildCallbackUrl(requestedNext),
      },
    })

    if (signInError) {
      console.error(signInError)
      const message = signInError.message.toLowerCase()

      if (message.includes('email rate limit exceeded')) {
        redirect(
          buildLoginRedirect({
            next: requestedNext,
            error: 'Magic links are temporarily cooling down for this project.',
            errorCode: 'email_rate_limit',
            retryAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            method: 'magic',
            sent: source === 'resend',
            email,
          }),
        )
      }

      if (message.includes('security purposes') || message.includes('60 seconds')) {
        redirect(
          buildLoginRedirect({
            next: requestedNext,
            error: 'A magic link was already requested for this email.',
            errorCode: 'otp_cooldown',
            retryAt: new Date(Date.now() + 60 * 1000).toISOString(),
            method: 'magic',
            sent: source === 'resend',
            email,
          }),
        )
      }

      redirect(
        buildLoginRedirect({
          next: requestedNext,
          error: 'We could not send your magic link just now.',
          method: 'magic',
          sent: source === 'resend',
          email,
        }),
      )
    }

    cookieStore.set(AUTH_EMAIL_COOKIE, email, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 15,
    })

    redirect(
      `/login?sent=1&sent_kind=magic_link&method=magic&next=${encodeURIComponent(requestedNext)}`,
    )
  }

  async function signInWithPassword(formData: FormData) {
    'use server'

    const email = String(formData.get('email') ?? '').trim().toLowerCase()
    const password = String(formData.get('password') ?? '')
    const requestedNext = sanitizeNextPath(String(formData.get('next') ?? '/scan'))

    if (!email || !password) {
      redirect(
        buildLoginRedirect({
          next: requestedNext,
          error: 'Enter both your email and password to continue.',
          method: 'password',
          mode: 'signin',
          email,
        }),
      )
    }

    const serverSupabase = await createClient()
    const { error: signInError } = await serverSupabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      console.error(signInError)
      const message = signInError.message.toLowerCase()

      if (message.includes('email not confirmed')) {
        redirect(
          buildLoginRedirect({
            next: requestedNext,
            error: 'Confirm your email before signing in with a password.',
            errorCode: 'email_not_confirmed',
            method: 'password',
            mode: 'signin',
            email,
          }),
        )
      }

      redirect(
        buildLoginRedirect({
          next: requestedNext,
          error: 'That email and password combination did not work.',
          errorCode: 'invalid_password_login',
          method: 'password',
          mode: 'signin',
          email,
        }),
      )
    }

    redirect(requestedNext)
  }

  async function signUpWithPassword(formData: FormData) {
    'use server'

    const email = String(formData.get('email') ?? '').trim().toLowerCase()
    const password = String(formData.get('password') ?? '')
    const requestedNext = sanitizeNextPath(String(formData.get('next') ?? '/scan'))
    const cookieStore = await cookies()

    if (!email || !password) {
      redirect(
        buildLoginRedirect({
          next: requestedNext,
          error: 'Enter your email and choose a password to create an account.',
          method: 'password',
          mode: 'signup',
          email,
        }),
      )
    }

    if (password.length < 8) {
      redirect(
        buildLoginRedirect({
          next: requestedNext,
          error: 'Use at least 8 characters for your password.',
          errorCode: 'weak_password',
          method: 'password',
          mode: 'signup',
          email,
        }),
      )
    }

    const serverSupabase = await createClient()
    const { data, error: signUpError } = await serverSupabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: buildCallbackUrl(requestedNext),
      },
    })

    if (signUpError) {
      console.error(signUpError)
      const message = signUpError.message.toLowerCase()

      if (message.includes('email rate limit exceeded')) {
        redirect(
          buildLoginRedirect({
            next: requestedNext,
            error: 'Confirmation emails are temporarily cooling down for this project.',
            errorCode: 'email_rate_limit',
            retryAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            method: 'password',
            mode: 'signup',
            email,
          }),
        )
      }

      if (message.includes('password')) {
        redirect(
          buildLoginRedirect({
            next: requestedNext,
            error: signUpError.message,
            errorCode: 'weak_password',
            method: 'password',
            mode: 'signup',
            email,
          }),
        )
      }

      redirect(
        buildLoginRedirect({
          next: requestedNext,
          error: 'We could not create the account just now.',
          method: 'password',
          mode: 'signup',
          email,
        }),
      )
    }

    if (data.session) {
      redirect(requestedNext)
    }

    cookieStore.set(AUTH_EMAIL_COOKIE, email, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 15,
    })

    redirect(
      `/login?sent=1&sent_kind=confirm_email&mode=signup&next=${encodeURIComponent(requestedNext)}`,
    )
  }

  async function resendConfirmationEmail(formData: FormData) {
    'use server'

    const email = String(formData.get('email') ?? '').trim().toLowerCase()
    const requestedNext = sanitizeNextPath(String(formData.get('next') ?? '/scan'))

    if (!email) {
      redirect(
        buildLoginRedirect({
          next: requestedNext,
          error: 'Use another email if this one is no longer available.',
          method: 'password',
          mode: 'signup',
          sent: true,
          sentKind: 'confirm_email',
        }),
      )
    }

    const serverSupabase = await createClient()
    const { error: resendError } = await serverSupabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: buildCallbackUrl(requestedNext),
      },
    })

    if (resendError) {
      console.error(resendError)
      const message = resendError.message.toLowerCase()

      if (message.includes('email rate limit exceeded')) {
        redirect(
          buildLoginRedirect({
            next: requestedNext,
            error: 'Confirmation emails are temporarily cooling down for this project.',
            errorCode: 'email_rate_limit',
            retryAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            method: 'password',
            mode: 'signup',
            sent: true,
            sentKind: 'confirm_email',
          }),
        )
      }

      redirect(
        buildLoginRedirect({
          next: requestedNext,
          error: 'We could not resend the confirmation email just now.',
          method: 'password',
          mode: 'signup',
          sent: true,
          sentKind: 'confirm_email',
        }),
      )
    }

    redirect(
      `/login?sent=1&sent_kind=confirm_email&mode=signup&next=${encodeURIComponent(requestedNext)}`,
    )
  }

  async function clearPendingState(formData: FormData) {
    'use server'

    const requestedNext = sanitizeNextPath(String(formData.get('next') ?? '/scan'))
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_EMAIL_COOKIE)

    redirect(`/login?next=${encodeURIComponent(requestedNext)}`)
  }

  const cookieStore = await cookies()
  const pendingEmail = cookieStore.get(AUTH_EMAIL_COOKIE)?.value ?? emailParam
  const inboxUrl = getInboxUrl(pendingEmail)
  const loginIssue = getLoginIssue(error, errorCode, retryAt)

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.panelGlow} aria-hidden="true" />

        <div className={styles.header}>
          {sent ? (
            <>
              <h1 className={styles.title}>
                {sentKind === 'confirm_email' ? 'Confirm email' : 'Check email'}
              </h1>
              <p className={styles.copy}>
                {pendingEmail ? (
                  <>
                    Link sent to <span className={styles.email}>{pendingEmail}</span>.
                  </>
                ) : (
                  'Link sent.'
                )}
              </p>
            </>
          ) : (
            <>
              <h1 className={styles.title}>Sign in</h1>
              <p className={styles.copy}>Google or email.</p>
            </>
          )}
        </div>

        {loginIssue ? (
          <div className={styles.errorPanel} role="alert">
            <div className={styles.errorBanner}>
              <CircleAlert size={18} aria-hidden="true" />
              <div className={styles.errorContent}>
                <p className={styles.errorTitle}>{loginIssue.title}</p>
                <p className={styles.errorBody}>{loginIssue.body}</p>
              </div>
            </div>

            <div className={styles.errorActions}>
              {inboxUrl ? (
                <a href={inboxUrl} target="_blank" rel="noreferrer" className={styles.secondaryAction}>
                  Open inbox
                </a>
              ) : null}

              {pendingEmail ? (
                <form action={clearPendingState} className={styles.inlineForm}>
                  <input type="hidden" name="next" value={next} />
                  <button type="submit" className={styles.ghostAction}>
                    Use another email
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        ) : null}

        {sent ? (
          <div className={styles.pendingState}>
            <div className={styles.pendingBadge}>
              <MailCheck size={18} aria-hidden="true" />
              <span>Email sent</span>
            </div>

            <div className={styles.pendingActions}>
              {inboxUrl ? (
                <a href={inboxUrl} target="_blank" rel="noreferrer" className={styles.primaryAction}>
                  Open inbox
                </a>
              ) : null}

              {sentKind === 'confirm_email' ? (
                <form action={resendConfirmationEmail} className={styles.inlineForm}>
                  <input type="hidden" name="email" value={pendingEmail ?? ''} />
                  <input type="hidden" name="next" value={next} />
                  <button type="submit" className={styles.secondaryAction}>
                    Send again
                  </button>
                </form>
              ) : (
                <form action={requestMagicLink} className={styles.inlineForm}>
                  <input type="hidden" name="email" value={pendingEmail ?? ''} />
                  <input type="hidden" name="next" value={next} />
                  <input type="hidden" name="source" value="resend" />
                  <button type="submit" className={styles.secondaryAction}>
                    Send again
                  </button>
                </form>
              )}

              <form action={clearPendingState} className={styles.inlineForm}>
                <input type="hidden" name="next" value={next} />
                <button type="submit" className={styles.ghostAction}>
                  Use another email
                </button>
              </form>
            </div>
          </div>
        ) : (
          <AuthEntry
            next={next}
            callbackUrl={buildCallbackUrl(next)}
            initialMethod={method}
            initialMode={mode}
            initialEmail={emailParam}
            signInWithPassword={signInWithPassword}
            signUpWithPassword={signUpWithPassword}
            requestMagicLink={requestMagicLink}
          />
        )}
      </section>
    </main>
  )
}
