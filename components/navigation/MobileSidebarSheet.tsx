'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BadgeDollarSign, ChevronRight, LogOut, User } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { signOut } from '@/app/actions/user'
import ThemeToggle from '@/components/marketing/ThemeToggle'
import UserMenu from '@/components/profile/UserMenu'
import AdaptiveSheet from '@/components/ui/AdaptiveSheet'
import PendingLink from '@/components/ui/PendingLink'
import { APP_IMAGE_BLUR_DATA_URL } from '@/lib/ui/image-loading'

import { navigationItems } from './nav-items'
import styles from './MobileSidebarSheet.module.css'

type MobileSidebarSheetProps = {
  user: {
    username?: string
    avatar_url?: string
    email?: string
  }
}

export default function MobileSidebarSheet({ user }: MobileSidebarSheetProps) {
  const pathname = usePathname()
  const [openPath, setOpenPath] = useState<string | null>(null)
  const open = openPath === pathname

  return (
    <>
      <UserMenu
        user={user}
        compact
        onClick={() => setOpenPath(pathname)}
        ariaLabel="Open workspace menu"
      />

      <AdaptiveSheet
        open={open}
        onClose={() => setOpenPath(null)}
        title="Workspace"
        size="compact"
        placement="side"
        eyebrow={<span>Capsule</span>}
      >
        <div className={styles.profileBlock}>
          <PendingLink href="/profile" className={styles.profileCard} onClick={() => setOpenPath(null)}>
            <div className={styles.profileIdentity}>
              <div className={styles.profileAvatar} aria-hidden="true">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt=""
                    fill
                    sizes="44px"
                    quality={60}
                    placeholder="blur"
                    blurDataURL={APP_IMAGE_BLUR_DATA_URL}
                  />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className={styles.profileCopy}>
                <span className={styles.profileName}>{user.username || user.email?.split('@')[0] || 'Account'}</span>
                <span className={styles.profileLabel}>{user.email}</span>
              </div>
            </div>
            <ChevronRight size={18} aria-hidden="true" />
          </PendingLink>
        </div>

        <section className={styles.section}>
          <div className={styles.navGrid}>
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)

              return (
                <PendingLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpenPath(null)}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span className={styles.navTitle}>{item.name}</span>
                </PendingLink>
              )
            })}
          </div>
        </section>

        <section className={styles.utilitySection}>
          <div className={styles.utilityCard}>
            <ThemeToggle className={styles.themeToggle} />
          </div>
          <PendingLink href="/donate" className={styles.utilityLink} onClick={() => setOpenPath(null)}>
            <BadgeDollarSign size={18} aria-hidden="true" />
            <span>Sponsor access</span>
          </PendingLink>
          <form action={signOut}>
            <button type="submit" className={styles.signOutButton}>
              <LogOut size={18} aria-hidden="true" />
              <span>Sign out</span>
            </button>
          </form>
        </section>
      </AdaptiveSheet>
    </>
  )
}
