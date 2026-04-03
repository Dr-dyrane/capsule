'use client'

import Link from 'next/link'
import { ArchiveX, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'

import RouteRecovery from '@/components/ui/RouteRecovery'
import recoveryStyles from '@/components/ui/RouteRecovery.module.css'

export default function AppError({
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
          <ArchiveX size={14} aria-hidden="true" />
          <span>Workspace</span>
        </>
      }
      title="That screen did not load."
      description="Try the view again, or move to another part of your library while Capsule catches up."
      primaryAction={
        <button type="button" className={recoveryStyles.primaryAction} onClick={() => unstable_retry()}>
          <RotateCcw size={16} aria-hidden="true" />
          <span>Try again</span>
        </button>
      }
      secondaryAction={
        <Link href="/scan" className={recoveryStyles.secondaryAction}>
          Open capture
        </Link>
      }
    />
  )
}
