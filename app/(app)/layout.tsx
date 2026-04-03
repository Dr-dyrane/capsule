import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

import { registerGeneratingSessionsForCurrentUser } from '@/lib/generation/run-manager'
import ThemeToggle from '@/components/marketing/ThemeToggle'
import TabBar from '@/components/navigation/TabBar'
import Sidebar from '@/components/navigation/Sidebar'
import Logo from '@/components/ui/Logo'
import UserMenu from '@/components/profile/UserMenu'
import styles from './AppShell.module.css'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await registerGeneratingSessionsForCurrentUser()
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userData = user ? {
    email: user.email,
    username: user.user_metadata?.full_name,
    avatar_url: user.user_metadata?.avatar_url
  } : undefined

  return (
    <div className={styles.shell}>
      <div className={styles.frame}>
      <Sidebar user={userData} />
        <div className={styles.content}>
          <header className={styles.mobileBar}>
            <Link href="/scan" className={styles.mobileBrand} aria-label="Capsule Workspace">
              <span className={styles.mobileBrandFull}>
                <Logo size={32} showText />
              </span>
              <span className={styles.mobileBrandCompact}>
                <Logo size={32} />
              </span>
            </Link>
            <div className={styles.mobileActions}>
              {userData && (
                <div className={styles.mobileUserMenu}>
                  <UserMenu user={userData} compact />
                </div>
              )}
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
