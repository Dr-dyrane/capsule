'use client'

import styles from '@/app/(app)/profile/ProfilePage.module.css'

interface SettingRowProps {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
}

export default function SettingRow({ label, icon, children }: SettingRowProps) {
  return (
    <div className={styles.settingItem}>
      <div className={styles.settingLabel}>
        {icon}
        <span>{label}</span>
      </div>
      <div className={styles.settingControl}>
        {children}
      </div>
    </div>
  )
}
