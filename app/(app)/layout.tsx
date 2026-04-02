import Link from 'next/link'

import ThemeToggle from '@/components/marketing/ThemeToggle'
import TabBar from '@/components/navigation/TabBar'
import Sidebar from '@/components/navigation/Sidebar'
import Logo from '@/components/ui/Logo'
import styles from './AppShell.module.css'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.shell}>
      <div className={styles.frame}>
      <Sidebar />
        <div className={styles.content}>
          <header className={styles.mobileBar}>
            <Link href="/scan" className={styles.mobileBrand} aria-label="Capsule Workspace">
              <Logo size={32} showText />
            </Link>
            <div className={styles.mobileActions}>
              <Link href="/" className={styles.mobileHome}>
                Home
              </Link>
              <ThemeToggle compact />
            </div>
          </header>
          <main className={styles.main}>{children}</main>
        </div>
      <TabBar />
      </div>
    </div>
  )
}
