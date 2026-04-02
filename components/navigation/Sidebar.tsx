'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home } from 'lucide-react'

import ThemeToggle from '@/components/marketing/ThemeToggle'
import Logo from '@/components/ui/Logo'

import { navigationItems } from './nav-items'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.surface}>
        <Link href="/scan" aria-label="Capsule workspace" className={styles.brand}>
          <Logo size={40} showText />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} />
              <span className={styles.label}>{item.name}</span>
            </Link>
          )
          })}
        </nav>

        <div className={styles.footer}>
          <div className={styles.footerMeta}>Workspace</div>
          <div className={styles.fullToggle}>
            <ThemeToggle />
          </div>
          <div className={styles.compactToggle}>
            <ThemeToggle compact />
          </div>
          <Link href="/" className={styles.homeLink}>
            <Home size={16} aria-hidden="true" />
            <span className={styles.homeCopy}>Home</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
