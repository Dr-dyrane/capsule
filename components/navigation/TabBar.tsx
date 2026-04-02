'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navigationItems } from './nav-items'
import styles from './TabBar.module.css'

export default function TabBar() {
  const pathname = usePathname()

  return (
    <nav className={styles.tabBar} aria-label="Primary">
      {navigationItems.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        const Icon = tab.icon

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
            <span className={styles.label}>{tab.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
