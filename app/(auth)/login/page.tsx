import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ArrowLeft, CircleAlert, MailCheck, RefreshCw, Sparkles } from 'lucide-react'

import ThemeToggle from '@/components/marketing/ThemeToggle'
import { sanitizeNextPath } from '@/lib/supabase/auth-callback'
import { createClient } from '@/lib/supabase/server'

import styles from './LoginPage.module.css'

type SearchParamsValue = string | string[] | undefined

type LoginPageProps = {
  searchParams?: Promise<Record<string, SearchParamsValue>>
}

const AUTH_EMAIL_COOKIE = 'capsule_auth_email'

function getStringValue(value: SearchParamsValue) {
  return typeof value === 'string' ? value : undefined
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

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {}
  const next = sanitizeNextPath(getStringValue(params.next))
  const error = getStringValue(params.error)
  const sent = getStringValue(params.sent) === '1'

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
    const cookieStore = await cookies()

    if (!email) {
      redirect(`/login?error=${encodeURIComponent('Enter your email to continue')}&next=${encodeURIComponent(requestedNext)}`)
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
      redirect(
        `/login?error=${encodeURIComponent('We could not send your magic link')}&next=${encodeURIComponent(requestedNext)}`
      )
    }

    cookieStore.set(AUTH_EMAIL_COOKIE, email, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 15,
    })

    redirect(`/login?sent=1&next=${encodeURIComponent(requestedNext)}`)
  }

  async function clearPendingState(formData: FormData) {
    'use server'

    const requestedNext = sanitizeNextPath(String(formData.get('next') ?? '/scan'))
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_EMAIL_COOKIE)

    redirect(`/login?next=${encodeURIComponent(requestedNext)}`)
  }

  const cookieStore = await cookies()
  const pendingEmail = cookieStore.get(AUTH_EMAIL_COOKIE)?.value
  const inboxUrl = getInboxUrl(pendingEmail)

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav aria-label="Auth navigation" className={styles.nav}>
          <Link href="/" className={styles.homeLink}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Home</span>
          </Link>

          <ThemeToggle />
        </nav>

        <section className={styles.stage}>
          <div className={styles.panel}>
            <div className={styles.panelGlow} aria-hidden="true" />

            <div className={styles.header}>
              <div className={styles.eyebrow}>
                <Sparkles size={14} aria-hidden="true" />
                <span>Magic link sign in</span>
              </div>

              {sent ? (
                <>
                  <h1 className={styles.title}>Check your email</h1>
                  <p className={styles.copy}>
                    We sent a secure sign-in link
                    {pendingEmail ? (
                      <>
                        {' '}
                        to <span className={styles.email}>{pendingEmail}</span>
                      </>
                    ) : null}
                    . This tab is ready. Open the link from your inbox and Capsule will finish the sign in.
                  </p>
                </>
              ) : (
                <>
                  <h1 className={styles.title}>Sign in to Capsule</h1>
                  <p className={styles.copy}>
                    One link, one tap, and you are back inside your notes.
                  </p>
                </>
              )}
            </div>

            {error ? (
              <div className={styles.errorBanner} role="alert">
                <CircleAlert size={18} aria-hidden="true" />
                <span>{error}</span>
              </div>
            ) : null}

            {sent ? (
              <div className={styles.pendingState}>
                <div className={styles.pendingBadge}>
                  <MailCheck size={18} aria-hidden="true" />
                  <span>Waiting for your magic link</span>
                </div>

                <div className={styles.pendingActions}>
                  {inboxUrl ? (
                    <Link href={inboxUrl} target="_blank" rel="noreferrer" className={styles.primaryAction}>
                      Open inbox
                    </Link>
                  ) : null}

                  <form action={requestMagicLink} className={styles.inlineForm}>
                    <input type="hidden" name="email" value={pendingEmail ?? ''} />
                    <input type="hidden" name="next" value={next} />
                    <button type="submit" className={styles.secondaryAction}>
                      <RefreshCw size={16} aria-hidden="true" />
                      <span>Resend link</span>
                    </button>
                  </form>

                  <form action={clearPendingState} className={styles.inlineForm}>
                    <input type="hidden" name="next" value={next} />
                    <button type="submit" className={styles.ghostAction}>
                      Use another email
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <form action={requestMagicLink} className={styles.form}>
                <label className={styles.label} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className={styles.input}
                />
                <input type="hidden" name="next" value={next} />
                <button type="submit" className={styles.primaryAction}>
                  Email me a magic link
                </button>
              </form>
            )}

            <div className={styles.footerNote}>
              <span className={styles.footerDot} aria-hidden="true" />
              <span>Secure, passwordless access with Supabase Auth.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
