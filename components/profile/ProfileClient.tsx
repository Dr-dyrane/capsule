'use client'

import { useState, useTransition, useEffect } from 'react'
import { LogOut, Monitor, Layers, Eye, ShieldCheck, Database, Stethoscope, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

import SettingRow from './SettingRow'
import { updateUserPreferences, signOut } from '@/app/actions/user'
import styles from '@/app/(app)/profile/ProfilePage.module.css'

interface ProfileClientProps {
  user: {
    email?: string
    id: string
    user_metadata: {
      preferences?: {
        density?: 'focused' | 'detailed'
        theme?: 'dark' | 'light'
        specialty?: string
      }
    }
  }
  cardCount: number
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

export default function ProfileClient({ user, cardCount }: ProfileClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const initialPrefs = user.user_metadata.preferences || {}
  const [density, setDensity] = useState<'focused' | 'detailed'>(initialPrefs.density || 'focused')
  const [theme, setTheme] = useState<'dark' | 'light'>(initialPrefs.theme || 'dark')
  const [specialty, setSpecialty] = useState(initialPrefs.specialty || SPECIALTIES[0])

  // Theme Sync (Capsule Design Standards)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('capsule-theme', theme)
    window.dispatchEvent(new Event('capsule-theme-change'))
  }, [theme])

  async function handleUpdate(updates: any) {
    startTransition(async () => {
      try {
        await updateUserPreferences(updates)
      } catch (err) {
        console.error('Failed to update preferences:', err)
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
          {user.email?.[0].toUpperCase() || 'U'}
        </div>
        <div className={styles.userInfo}>
          <p className={styles.name}>{user.email?.split('@')[0]}</p>
          <p className={styles.email}>{user.email}</p>
          {isPending && <Loader2 size={12} className={styles.spinner} />}
        </div>
      </header>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Medical Archive</h3>
        <div className={styles.settingGroup}>
          <SettingRow label="Stored Illustrations" icon={<Database size={18} />}>
            <span className={styles.countText}>{cardCount} saved</span>
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
        <h3 className={styles.sectionTitle}>Display</h3>
        <div className={styles.settingGroup}>
          <SettingRow label="Appearance" icon={<Monitor size={18} />}>
            <select 
              className={styles.select}
              value={theme}
              onChange={(e) => {
                const val = e.target.value as any
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
