'use client'

import Link from 'next/link'
import { CheckCircle2, DatabaseZap, Loader2, MoveRight } from 'lucide-react'
import { useState, useTransition } from 'react'

import { migrateLegacySeedAssetsToStorage } from '@/app/actions/admin'
import styles from '@/app/(app)/profile/ProfilePage.module.css'

type MigrationStatus = {
  noteCount: number
  cardCount: number
  isPending: boolean
}

export default function StorageMigrationPanel({
  initialStatus,
}: {
  initialStatus: MigrationStatus
}) {
  const [status, setStatus] = useState(initialStatus)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleMigrate() {
    setMessage(null)
    startTransition(async () => {
      try {
        const result = await migrateLegacySeedAssetsToStorage()
        setStatus({ noteCount: 0, cardCount: 0, isPending: false })
        setMessage(`Moved ${result.migratedNotes} note images and ${result.migratedCards} card images into storage.`)
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Asset migration failed.')
      }
    })
  }

  return (
    <div className={styles.card}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Seed Asset Backfill</h3>
        <div className={styles.settingGroup}>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <DatabaseZap size={18} />
              <span>Pending note files</span>
            </div>
            <span className={styles.countText}>{status.noteCount}</span>
          </div>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <DatabaseZap size={18} />
              <span>Pending card images</span>
            </div>
            <span className={styles.countText}>{status.cardCount}</span>
          </div>
        </div>
      </section>

      <div className={styles.actions}>
        {status.isPending ? (
          <button type="button" className={styles.actionItem} onClick={handleMigrate} disabled={isPending}>
            {isPending ? <Loader2 size={20} className={styles.spinner} /> : <MoveRight size={20} />}
            <span>{isPending ? 'Migrating...' : 'Backfill seeded assets to storage'}</span>
          </button>
        ) : (
          <div className={styles.actionItem}>
            <CheckCircle2 size={20} />
            <span>Seeded assets are already storage-backed.</span>
          </div>
        )}

        <Link href="/community" className={styles.actionItem}>
          <MoveRight size={20} />
          <span>Open community feed</span>
        </Link>
      </div>

      {message ? (
        <p className={styles.email}>{message}</p>
      ) : null}
    </div>
  )
}
