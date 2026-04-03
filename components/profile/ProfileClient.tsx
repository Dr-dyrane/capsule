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
      className={styles.card}
    >
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
          {isPending && <Loader2 size={12} className={styles.spinner} />}
        </div>
      </header>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Access</h3>
        <div className={styles.settingGroup}>
          <SettingRow label="Plan" icon={<BadgeDollarSign size={18} />}>
            <span className={styles.countText}>{entitlement.plan.replace('_', ' ')}</span>
          </SettingRow>
          <SettingRow label="Support renders" icon={<Layers size={18} />}>
            <span className={styles.countText}>{entitlement.support_renders_remaining} left</span>
          </SettingRow>
          <SettingRow label="Premium renders" icon={<Sparkles size={18} />}>
            <span className={styles.countText}>{entitlement.premium_renders_remaining} left</span>
          </SettingRow>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Medical Archive</h3>
        <div className={styles.settingGroup}>
          <SettingRow label="Stored Illustrations" icon={<Layers size={18} />}>
            <span className={styles.countText}>{cardCount} saved</span>
          </SettingRow>
          <SettingRow label="Published Cards" icon={<Globe size={18} />}>
            <span className={styles.countText}>{publishedCount} live</span>
          </SettingRow>
          <SettingRow label="Saved from Community" icon={<Bookmark size={18} />}>
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

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Visual Engine</h3>
        <div className={styles.settingGroup}>
          <SettingRow label="Generation Density" icon={<Layers size={18} />}>
            <div className={styles.toggleGroup}>
              <button 
                className={`${styles.toggleBtn} ${density === 'focused' ? styles.activeToggle : ''}`}
                onClick={() => {
                  setDensity('focused')
                  handleUpdate({ density: 'focused' })
                }}
              >
                Focused
              </button>
              <button 
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
          
          <SettingRow label="Primary Specialty" icon={<Stethoscope size={18} />}>
            <select 
              className={styles.select}
              value={specialty}
              onChange={(e) => {
                const val = e.target.value
                setSpecialty(val)
                handleUpdate({ specialty: val })
              }}
            >
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </SettingRow>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Community</h3>
        <div className={styles.settingGroup}>
          <SettingRow label="Publish default" icon={<Globe size={18} />}>
            <div className={styles.toggleGroup}>
              <button
                className={`${styles.toggleBtn} ${!autoPublish ? styles.activeToggle : ''}`}
                onClick={() => {
                  setAutoPublish(false)
                  handleUpdate({ auto_publish: false })
                }}
              >
                Ask
              </button>
              <button
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

      <section className={styles.section}>
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

      <div className={styles.actions}>
        <Link href="/community" className={styles.actionItem}>
          <Sparkles size={20} />
          <span>Explore community</span>
        </Link>
        <Link href="/community/reports" className={styles.actionItem}>
          <Flag size={20} />
          <span>Review reports</span>
        </Link>
        {isAdmin ? (
          <Link href="/profile/admin" className={styles.actionItem}>
            <BadgeDollarSign size={20} />
            <span>Admin tools</span>
          </Link>
        ) : null}
        <Link href="/donate" className={styles.actionItem}>
          <Globe size={20} />
          <span>Support students</span>
        </Link>
        <form action={signOut}>
          <button 
            type="submit" 
            className={`${styles.actionItem} ${styles.destructive}`}
          >
            <LogOut size={20} />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </motion.div>
  )
}
