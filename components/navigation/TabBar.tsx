'use client'

import { usePathname } from 'next/navigation'

import PendingLink from '@/components/ui/PendingLink'
import { mobilePrimaryNavigationItems } from './nav-items'
import styles from './TabBar.module.css'

export default function TabBar() {
  const pathname = usePathname()

  return (
    <nav className={styles.tabBar} aria-label="Primary">
      {mobilePrimaryNavigationItems.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        const Icon = tab.icon

        return (
          <PendingLink
            key={tab.name}
            href={tab.href}
            className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={tab.name}
          >
            <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
            <span className={styles.label}>{tab.name}</span>
          </PendingLink>
        )
      })}
    </nav>
  )
}
