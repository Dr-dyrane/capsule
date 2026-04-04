'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BadgeDollarSign, Bookmark, Flag, Globe, Layers, Loader2, LogOut, Monitor, Sparkles, Stethoscope } from 'lucide-react'
import { motion } from 'framer-motion'

import SettingRow from './SettingRow'
import { updateUserPreferences, signOut, type UserPreferences } from '@/app/actions/user'
import { APP_IMAGE_BLUR_DATA_URL } from '@/lib/ui/image-loading'
import type { UserEntitlementRecord } from '@/lib/types'
import { useFeedback } from '@/components/providers/FeedbackProvider'
import styles from '@/app/(app)/profile/ProfilePage.module.css'

interface ProfileClientProps {
  user: {
    email?: string
    id: string
    user_metadata: {
      avatar_url?: string
      full_name?: string
      preferences?: {
        density?: 'focused' | 'detailed'
        theme?: 'dark' | 'light'
        specialty?: string
        auto_publish?: boolean
      }
    }
  }
  cardCount: number
  publishedCount: number
  savedCount: number
  reportedCount: number
  entitlement: UserEntitlementRecord
  isAdmin: boolean
}

const SPECIALTIES = [
  'General Medicine',
  'Pharmacology',
  'Anatomy',
  'Oncology',
  'Cardiology',
  'Neurology',
  'Pediatrics'
]

function formatPlanLabel(plan: string) {
  return plan
    .split('_')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

export default function ProfileClient({
  user,
  cardCount,
  publishedCount,
  savedCount,
  reportedCount,
  entitlement,
  isAdmin,
}: ProfileClientProps) {
  const [isPending, startTransition] = useTransition()

  const initialPrefs = user.user_metadata.preferences || {}
  const displayName = user.user_metadata.full_name || user.email?.split('@')[0] || 'User'
  const avatarUrl = user.user_metadata.avatar_url
  const [density, setDensity] = useState<'focused' | 'detailed'>(initialPrefs.density || 'focused')
  const [theme, setTheme] = useState<'dark' | 'light'>(initialPrefs.theme || 'dark')
  const [specialty, setSpecialty] = useState(initialPrefs.specialty || SPECIALTIES[0])
  const [autoPublish, setAutoPublish] = useState(Boolean(initialPrefs.auto_publish))
  const { showFeedback } = useFeedback()
  const planLabel = formatPlanLabel(entitlement.plan)

  // Theme Sync (Capsule Design Standards)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('capsule-theme', theme)
    window.dispatchEvent(new Event('capsule-theme-change'))
  }, [theme])

  async function handleUpdate(updates: UserPreferences) {
    startTransition(async () => {
      try {
        await updateUserPreferences(updates)
        showFeedback({
          tone: 'success',
          title:
            'theme' in updates
              ? 'Appearance updated'
              : 'auto_publish' in updates
                ? 'Publish default updated'
                : 'density' in updates
                  ? 'Density updated'
                  : 'specialty' in updates
                    ? 'Specialty updated'
                    : 'Saved',
        })
      } catch (err) {
        console.error('Failed to update preferences:', err)
        showFeedback({
          tone: 'error',
          title: 'Could not save that change',
          message: 'Try again in a moment.',
        })
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${styles.card} ${styles.profileCard}`}
    >
      <div className={styles.profileLayout}>
        <aside className={styles.profileSidebar}>
          <header className={styles.header}>
            <div className={styles.avatar}>
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  fill
                  sizes="88px"
                  quality={60}
                  placeholder="blur"
                  blurDataURL={APP_IMAGE_BLUR_DATA_URL}
                />
              ) : (
                user.email?.[0].toUpperCase() || 'U'
              )}
            </div>
            <div className={styles.userInfo}>
              <p className={styles.name}>{displayName}</p>
              <p className={styles.email}>{user.email}</p>
              <div className={styles.headerMeta}>
                <span className={styles.metaPill}>{planLabel}</span>
                <span className={styles.metaPill}>{cardCount} cards</span>
                {isPending ? (
                  <span className={`${styles.metaPill} ${styles.metaPillAccent}`}>
                    <Loader2 size={12} className={styles.spinner} />
                    <span>Saving</span>
                  </span>
                ) : null}
              </div>
            </div>
          </header>

          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Support</span>
              <span className={styles.summaryValue}>{entitlement.support_renders_remaining}</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Premium</span>
              <span className={styles.summaryValue}>{entitlement.premium_renders_remaining}</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Published</span>
              <span className={styles.summaryValue}>{publishedCount}</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Saved</span>
              <span className={styles.summaryValue}>{savedCount}</span>
            </div>
          </div>

          <section className={`${styles.section} ${styles.sectionBlock}`}>
            <h3 className={styles.sectionTitle}>Access</h3>
            <div className={styles.settingGroup}>
              <SettingRow label="Plan" icon={<BadgeDollarSign size={18} />}>
                <span className={styles.countText}>{planLabel}</span>
              </SettingRow>
              <SettingRow label="Support renders" icon={<Layers size={18} />}>
                <span className={styles.countText}>{entitlement.support_renders_remaining} left</span>
              </SettingRow>
              <SettingRow label="Premium renders" icon={<Sparkles size={18} />}>
                <span className={styles.countText}>{entitlement.premium_renders_remaining} left</span>
              </SettingRow>
            </div>
          </section>
        </aside>

        <div className={styles.profileMain}>
          <div className={styles.sectionGrid}>
            <section className={`${styles.section} ${styles.sectionBlock} ${styles.sectionWide}`}>
              <h3 className={styles.sectionTitle}>Visual Engine</h3>
              <div className={styles.settingGroup}>
                <SettingRow label="Generation density" icon={<Layers size={18} />}>
                  <div className={styles.toggleGroup}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${density === 'focused' ? styles.activeToggle : ''}`}
                      onClick={() => {
                        setDensity('focused')
                        handleUpdate({ density: 'focused' })
                      }}
                    >
                      Focused
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${density === 'detailed' ? styles.activeToggle : ''}`}
                      onClick={() => {
                        setDensity('detailed')
                        handleUpdate({ density: 'detailed' })
                      }}
                    >
                      Detailed
                    </button>
                  </div>
                </SettingRow>

                <SettingRow label="Primary specialty" icon={<Stethoscope size={18} />}>
                  <select
                    className={styles.select}
                    value={specialty}
                    onChange={(e) => {
                      const val = e.target.value
                      setSpecialty(val)
                      handleUpdate({ specialty: val })
                    }}
                  >
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </SettingRow>
              </div>
            </section>

            <section className={`${styles.section} ${styles.sectionBlock} ${styles.sectionCommunity}`}>
              <h3 className={styles.sectionTitle}>Community</h3>
              <div className={styles.settingGroup}>
                <SettingRow label="Publish default" icon={<Globe size={18} />}>
                  <div className={styles.toggleGroup}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${!autoPublish ? styles.activeToggle : ''}`}
                      onClick={() => {
                        setAutoPublish(false)
                        handleUpdate({ auto_publish: false })
                      }}
                    >
                      Ask
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${autoPublish ? styles.activeToggle : ''}`}
                      onClick={() => {
                        setAutoPublish(true)
                        handleUpdate({ auto_publish: true })
                      }}
                    >
                      Publish
                    </button>
                  </div>
                </SettingRow>
              </div>
            </section>

            <section className={`${styles.section} ${styles.sectionBlock} ${styles.sectionDisplay}`}>
              <h3 className={styles.sectionTitle}>Display</h3>
              <div className={styles.settingGroup}>
                <SettingRow label="Appearance" icon={<Monitor size={18} />}>
                  <select
                    className={styles.select}
                    value={theme}
                    onChange={(e) => {
                      const val = e.target.value as 'dark' | 'light'
                      setTheme(val)
                      handleUpdate({ theme: val })
                    }}
                  >
                    <option value="dark">Dark Glass</option>
                    <option value="light">Medical Light</option>
                  </select>
                </SettingRow>
              </div>
            </section>

            <section className={`${styles.section} ${styles.sectionBlock} ${styles.sectionArchive}`}>
              <h3 className={styles.sectionTitle}>Medical Archive</h3>
              <div className={styles.settingGroup}>
                <SettingRow label="Stored illustrations" icon={<Layers size={18} />}>
                  <span className={styles.countText}>{cardCount} saved</span>
                </SettingRow>
                <SettingRow label="Published cards" icon={<Globe size={18} />}>
                  <span className={styles.countText}>{publishedCount} live</span>
                </SettingRow>
                <SettingRow label="Saved from community" icon={<Bookmark size={18} />}>
                  <Link href="/community" className={styles.inlineLink}>
                    {savedCount} saved
                  </Link>
                </SettingRow>
                <SettingRow label="Reports on public cards" icon={<Flag size={18} />}>
                  <Link href="/community/reports" className={styles.inlineLink}>
                    {reportedCount} reports
                  </Link>
                </SettingRow>
              </div>
            </section>

            <section className={`${styles.section} ${styles.sectionBlock} ${styles.sectionActions}`}>
              <h3 className={styles.sectionTitle}>Actions</h3>
              <div className={styles.profileActions}>
                <Link href="/community" className={styles.actionItem}>
                  <Sparkles size={20} />
                  <span>Community</span>
                </Link>
                <Link href="/community/reports" className={styles.actionItem}>
                  <Flag size={20} />
                  <span>Reports</span>
                </Link>
                {isAdmin ? (
                  <Link href="/profile/admin" className={styles.actionItem}>
                    <BadgeDollarSign size={20} />
                    <span>Admin</span>
                  </Link>
                ) : null}
                <Link href="/donate" className={styles.actionItem}>
                  <Globe size={20} />
                  <span>Support access</span>
                </Link>
                <form action={signOut} className={styles.actionForm}>
                  <button
                    type="submit"
                    className={`${styles.actionItem} ${styles.destructive}`}
                  >
                    <LogOut size={20} />
                    <span>Sign out</span>
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
