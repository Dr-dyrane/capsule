'use client'

import Link from 'next/link'
import { KeyRound, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'

import RouteRecovery from '@/components/ui/RouteRecovery'
import recoveryStyles from '@/components/ui/RouteRecovery.module.css'

export default function AuthError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <RouteRecovery
      eyebrow={
        <>
          <KeyRound size={14} aria-hidden="true" />
          <span>Access</span>
        </>
      }
      title="Sign in did not open."
      description="Try this step again, or return home and start fresh."
      primaryAction={
        <button type="button" className={recoveryStyles.primaryAction} onClick={() => unstable_retry()}>
          <RotateCcw size={16} aria-hidden="true" />
          <span>Try again</span>
        </button>
      }
      secondaryAction={
        <Link href="/" className={recoveryStyles.secondaryAction}>
          Go home
        </Link>
      }
    />
  )
}
