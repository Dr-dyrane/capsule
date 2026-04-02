'use client'

import { useState } from 'react'
import { ChevronLeft, TriangleAlert } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import styles from './AuthEntry.module.css'

type AuthMethod = 'password' | 'magic'
type AuthMode = 'signin' | 'signup'
type AuthStep = 'entry' | 'password' | 'signup' | 'magic'

type AuthEntryProps = {
  next: string
  callbackUrl: string
  initialMethod?: AuthMethod
  initialMode?: AuthMode
  initialEmail?: string
  signInWithPassword: (formData: FormData) => void
  signUpWithPassword: (formData: FormData) => void
  requestMagicLink: (formData: FormData) => void
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className={styles.googleMark}>
      <path
        d="M17.64 9.2c0-.63-.06-1.23-.16-1.8H9v3.4h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.86 2.7-6.58Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.47-.8 5.96-2.22l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.58-5.06-3.7H.94v2.33A9 9 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.94 10.68A5.4 5.4 0 0 1 3.66 9c0-.58.1-1.14.28-1.68V4.99H.94a9 9 0 0 0 0 8.02l3-2.33Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .94 4.99l3 2.33c.72-2.12 2.7-3.74 5.06-3.74Z"
        fill="#EA4335"
      />
    </svg>
  )
}

function getInitialStep(initialMethod?: AuthMethod, initialMode?: AuthMode): AuthStep {
  if (initialMethod === 'magic') {
    return 'magic'
  }

  if (initialMethod === 'password' && initialMode === 'signup') {
    return 'signup'
  }

  if (initialMethod === 'password' && initialMode === 'signin') {
    return 'password'
  }

  return 'entry'
}

export default function AuthEntry({
  next,
  callbackUrl,
  initialMethod,
  initialMode,
  initialEmail,
  signInWithPassword,
  signUpWithPassword,
  requestMagicLink,
}: AuthEntryProps) {
  const [step, setStep] = useState<AuthStep>(getInitialStep(initialMethod, initialMode))
  const [email, setEmail] = useState(initialEmail ?? '')
  const [entryError, setEntryError] = useState<string | null>(null)
  const [oauthError, setOauthError] = useState<string | null>(null)
  const [isGooglePending, setIsGooglePending] = useState(false)

  async function handleGoogleAuth() {
    setOauthError(null)
    setIsGooglePending(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
      },
    })

    if (error) {
      setOauthError('Google is not ready here.')
      setIsGooglePending(false)
      return
    }

    if (data.url) {
      window.location.assign(data.url)
      return
    }

    setOauthError('Google did not open. Use email.')
    setIsGooglePending(false)
  }

  function normalizeEmail() {
    return email.trim().toLowerCase()
  }

  function goToStep(nextStep: AuthStep) {
    const normalizedEmail = normalizeEmail()

    if (!normalizedEmail) {
      setEntryError('Enter your email.')
      return
    }

    setEmail(normalizedEmail)
    setEntryError(null)
    setStep(nextStep)
  }

  function returnToEntry() {
    setEntryError(null)
    setStep('entry')
  }

  function handleEntrySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!event.currentTarget.reportValidity()) {
      return
    }

    goToStep('password')
  }

  function renderStepHeader(title: string) {
    return (
      <div className={styles.stepHeader}>
        <button type="button" className={styles.backButton} onClick={returnToEntry}>
          <ChevronLeft size={16} aria-hidden="true" />
          <span>Back</span>
        </button>
        <p className={styles.stepTitle}>{title}</p>
        <button type="button" className={styles.emailChip} onClick={returnToEntry}>
          {normalizeEmail()}
        </button>
      </div>
    )
  }

  return (
    <div className={styles.stack}>
      {step === 'entry' ? (
        <>
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isGooglePending}
            className={styles.googleButton}
          >
            <GoogleMark />
            <span>{isGooglePending ? 'Opening Google...' : 'Continue with Google'}</span>
          </button>

          <div className={styles.divider}>
            <span>or email</span>
          </div>

          <form onSubmit={handleEntrySubmit} className={styles.entryForm}>
            <label className={styles.label} htmlFor="entry-email">
              Email
            </label>
            <input
              id="entry-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className={styles.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            {entryError ? (
              <div className={styles.inlineError} role="alert">
                <TriangleAlert size={16} aria-hidden="true" />
                <span>{entryError}</span>
              </div>
            ) : null}

            {oauthError ? (
              <div className={styles.inlineError} role="alert">
                <TriangleAlert size={16} aria-hidden="true" />
                <span>{oauthError}</span>
              </div>
            ) : null}

            <button type="submit" className={styles.primaryAction}>
              Continue
            </button>
          </form>

          <div className={styles.inlineLinks}>
            <button type="button" className={styles.inlineSwitch} onClick={() => goToStep('signup')}>
              Create account
            </button>
            <button type="button" className={styles.inlineSwitch} onClick={() => goToStep('magic')}>
              Magic link
            </button>
          </div>
        </>
      ) : null}

      {step === 'password' ? (
        <div className={styles.stepPane}>
          {renderStepHeader('Password')}

          <form action={signInWithPassword} className={styles.form}>
            <input type="hidden" name="email" value={normalizeEmail()} />
            <input type="hidden" name="next" value={next} />

            <label className={styles.label} htmlFor="password-field">
              Password
            </label>
            <input
              id="password-field"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              required
              className={styles.input}
            />

            <button type="submit" className={styles.primaryAction}>
              Sign in
            </button>
          </form>

          <div className={styles.inlineLinks}>
            <button type="button" className={styles.inlineSwitch} onClick={() => setStep('signup')}>
              Create account
            </button>
            <button type="button" className={styles.inlineSwitch} onClick={() => setStep('magic')}>
              Magic link
            </button>
          </div>
        </div>
      ) : null}

      {step === 'signup' ? (
        <div className={styles.stepPane}>
          {renderStepHeader('Create account')}

          <form action={signUpWithPassword} className={styles.form}>
            <input type="hidden" name="email" value={normalizeEmail()} />
            <input type="hidden" name="next" value={next} />

            <label className={styles.label} htmlFor="signup-password-field">
              Password
            </label>
            <input
              id="signup-password-field"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              required
              className={styles.input}
            />

            <button type="submit" className={styles.primaryAction}>
              Create account
            </button>
          </form>

          <div className={styles.inlineLinks}>
            <button type="button" className={styles.inlineSwitch} onClick={() => setStep('password')}>
              Sign in
            </button>
            <button type="button" className={styles.inlineSwitch} onClick={() => setStep('magic')}>
              Magic link
            </button>
          </div>
        </div>
      ) : null}

      {step === 'magic' ? (
        <div className={styles.stepPane}>
          {renderStepHeader('Magic link')}

          <form action={requestMagicLink} className={styles.form}>
            <input type="hidden" name="email" value={normalizeEmail()} />
            <input type="hidden" name="next" value={next} />
            <input type="hidden" name="source" value="request" />

            <button type="submit" className={styles.primaryAction}>
              Send link
            </button>
          </form>

          <div className={styles.inlineLinks}>
            <button type="button" className={styles.inlineSwitch} onClick={() => setStep('password')}>
              Password
            </button>
            <button type="button" className={styles.inlineSwitch} onClick={() => setStep('signup')}>
              Create account
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
