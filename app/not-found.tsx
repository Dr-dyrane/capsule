import Link from 'next/link'
import { Compass, House } from 'lucide-react'

import RouteRecovery from '@/components/ui/RouteRecovery'
import recoveryStyles from '@/components/ui/RouteRecovery.module.css'

export default function NotFound() {
  return (
    <RouteRecovery
      eyebrow={
        <>
          <Compass size={14} aria-hidden="true" />
          <span>Not found</span>
        </>
      }
      title="This page is not here."
      description="The link may be old, or the page may have moved. Open a live part of Capsule instead."
      primaryAction={
        <Link href="/" className={recoveryStyles.primaryAction}>
          <House size={16} aria-hidden="true" />
          <span>Go home</span>
        </Link>
      }
      secondaryAction={
        <Link href="/login" className={recoveryStyles.secondaryAction}>
          Open sign in
        </Link>
      }
    />
  )
}
