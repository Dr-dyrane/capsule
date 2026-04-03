'use client'

import { usePathname } from 'next/navigation'

import ThemeToggle from '@/components/marketing/ThemeToggle'
import Logo from '@/components/ui/Logo'
import PendingLink from '@/components/ui/PendingLink'
import UserMenu from '@/components/profile/UserMenu'

import { navigationItems } from './nav-items'
import styles from './Sidebar.module.css'

interface SidebarProps {
  user?: {
    username?: string
    avatar_url?: string
    email?: string
  }
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.surface}>
        <PendingLink href="/scan" aria-label="Capsule workspace" className={styles.brand}>
          <span className={styles.brandFull}>
            <Logo size={40} showText />
          </span>
          <span className={styles.brandCompact}>
            <Logo size={40} />
          </span>
        </PendingLink>

        <nav className={styles.nav} aria-label="Primary">
          {navigationItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <PendingLink
                key={item.name}
                href={item.href}
                className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={20} />
                <span className={styles.label}>{item.name}</span>
              </PendingLink>
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
          {user && (
            <>
              <div className={styles.userMenuWrapper}>
                <UserMenu user={user} />
              </div>
              <div className={styles.compactUserMenu}>
                <UserMenu user={user} compact />
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
