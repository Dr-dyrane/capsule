'use client'

import { useState, type ComponentType } from 'react'
import { Brain, Camera, Globe, Library, Plus } from 'lucide-react'
import { usePathname } from 'next/navigation'

import AdaptiveSheet from '@/components/ui/AdaptiveSheet'
import PendingLink from '@/components/ui/PendingLink'

import styles from './MobileFab.module.css'

type FabAction = {
  href: string
  label: string
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
}

function getFabActions(pathname: string): FabAction[] {
  if (pathname.startsWith('/scan')) {
    return [
      { href: '/review', label: 'Review', icon: Brain },
      { href: '/library', label: 'Library', icon: Library },
      { href: '/community', label: 'Community', icon: Globe },
    ]
  }

  if (pathname.startsWith('/review')) {
    return [
      { href: '/scan', label: 'Scan', icon: Camera },
      { href: '/library', label: 'Library', icon: Library },
      { href: '/community', label: 'Community', icon: Globe },
    ]
  }

  if (pathname.startsWith('/community')) {
    return [
      { href: '/scan', label: 'Scan', icon: Camera },
      { href: '/review', label: 'Review', icon: Brain },
      { href: '/library', label: 'Library', icon: Library },
    ]
  }

  if (pathname.startsWith('/profile')) {
    return [
      { href: '/scan', label: 'Scan', icon: Camera },
      { href: '/review', label: 'Review', icon: Brain },
      { href: '/community', label: 'Community', icon: Globe },
    ]
  }

  return [
    { href: '/scan', label: 'Scan', icon: Camera },
    { href: '/review', label: 'Review', icon: Brain },
    { href: '/community', label: 'Community', icon: Globe },
  ]
}

export default function MobileFab() {
  const pathname = usePathname()
  const [openPath, setOpenPath] = useState<string | null>(null)
  const actions = getFabActions(pathname)
  const open = openPath === pathname

  return (
    <>
      <button
        type="button"
        className={styles.fab}
        onClick={() => setOpenPath(pathname)}
        aria-label="Open quick actions"
      >
        <Plus size={20} strokeWidth={2.4} aria-hidden="true" />
      </button>

      <AdaptiveSheet open={open} onClose={() => setOpenPath(null)} title="Quick actions" size="compact">
        <div className={styles.actionGrid}>
          {actions.map((action) => {
            const Icon = action.icon

            return (
              <PendingLink
                key={action.href}
                href={action.href}
                className={styles.action}
                onClick={() => setOpenPath(null)}
              >
                <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                <span>{action.label}</span>
              </PendingLink>
            )
          })}
        </div>
      </AdaptiveSheet>
    </>
  )
}
