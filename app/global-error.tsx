'use client'

import './styles/globals.css'

import Link from 'next/link'
import { Compass, RotateCcw } from 'lucide-react'
import { useEffect, type CSSProperties } from 'react'

import RouteRecovery from '@/components/ui/RouteRecovery'
import recoveryStyles from '@/components/ui/RouteRecovery.module.css'

export default function GlobalError({
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
    <html
      lang="en"
      suppressHydrationWarning
      style={
        {
          ['--font-sans' as string]: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          ['--font-mono' as string]: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
        } as CSSProperties
      }
    >
      <body>
        <RouteRecovery
          eyebrow={
            <>
              <Compass size={14} aria-hidden="true" />
              <span>Capsule</span>
            </>
          }
          title="Capsule hit a problem."
          description="Try again now. If it still does not open, head back to a stable screen."
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
      </body>
    </html>
  )
}
