import Link from 'next/link'
import { BadgeDollarSign, ChartColumn, DatabaseZap, Shield } from 'lucide-react'
import { notFound } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { isCapsuleAdminEmail, syncCurrentUserDirectory } from '@/lib/billing/entitlements'
import { getAccessAdminSnapshot, getLegacySeedMigrationStatus, getProductAnalyticsSnapshot } from '@/app/actions/admin'

import shellStyles from '@/app/(app)/AppScreen.module.css'
import styles from '@/app/(app)/profile/ProfilePage.module.css'

export default async function AdminHomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  await syncCurrentUserDirectory(supabase, user)

  if (!isCapsuleAdminEmail(user.email)) {
    notFound()
  }

  const [accessSnapshot, storageStatus, analyticsSnapshot] = await Promise.all([
    getAccessAdminSnapshot(),
    getLegacySeedMigrationStatus(),
    getProductAnalyticsSnapshot(),
  ])

  return (
    <div className={shellStyles.screen}>
      <header className={shellStyles.header}>
        <div className={shellStyles.eyebrow}>
          <Shield size={14} aria-hidden="true" />
          <span>Admin</span>
        </div>
        <h1 className={shellStyles.title}>Control room.</h1>
        <p className={shellStyles.copy}>Access, storage, and the manual controls behind funded generation.</p>
      </header>

      <div className={styles.card}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Tools</h3>
          <div className={styles.actions}>
            <Link href="/profile/admin/access" className={styles.actionItem}>
              <BadgeDollarSign size={20} />
              <span>Grant access</span>
            </Link>
            <Link href="/profile/admin/storage" className={styles.actionItem}>
              <DatabaseZap size={20} />
              <span>Legacy asset storage</span>
            </Link>
            <Link href="/profile/admin/analytics" className={styles.actionItem}>
              <ChartColumn size={20} />
              <span>Product analytics</span>
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Status</h3>
          <div className={styles.settingGroup}>
            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <BadgeDollarSign size={18} />
                <span>Recent grants</span>
              </div>
              <span className={styles.countText}>{accessSnapshot.grants.length}</span>
            </div>
            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <DatabaseZap size={18} />
                <span>Seed notes pending</span>
              </div>
              <span className={styles.countText}>{storageStatus.noteCount}</span>
            </div>
            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <DatabaseZap size={18} />
                <span>Seed cards pending</span>
              </div>
              <span className={styles.countText}>{storageStatus.cardCount}</span>
            </div>
            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <ChartColumn size={18} />
                <span>Signals ({analyticsSnapshot.windowDays}d)</span>
              </div>
              <span className={styles.countText}>{analyticsSnapshot.totalEvents}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
