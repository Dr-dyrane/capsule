import type { ReactNode } from 'react'
import Link from 'next/link'

import ThemeToggle from '@/components/marketing/ThemeToggle'
import Logo from '@/components/ui/Logo'

import styles from './AuthLayout.module.css'

type AuthLayoutProps = {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.nav}>
          <Link href="/" className={styles.brand} aria-label="Go home">
            <Logo size={32} showText />
          </Link>

          <ThemeToggle />
        </header>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
