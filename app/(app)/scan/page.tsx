'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, CircleAlert, Loader2, ScanLine, Upload } from 'lucide-react'

import { uploadNote } from '@/app/actions/upload'

import shellStyles from '../AppScreen.module.css'
import styles from './ScanPage.module.css'

export default function ScanPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const router = useRouter()

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const session = await uploadNote(formData)
      router.push(`/scan/${session.id}`)
    } catch (error) {
      console.error(error)
      setUploadError('Upload failed. Please try again.')
      setIsUploading(false)
    }
  }

  return (
    <div className={shellStyles.screen}>
      <header className={shellStyles.header}>
        <div className={shellStyles.eyebrow}>
          <ScanLine size={14} aria-hidden="true" />
          <span>Capture</span>
        </div>
        <h1 className={shellStyles.title}>Scan one page into cards.</h1>
        <p className={shellStyles.copy}>One note in. Clean points out.</p>
      </header>

      {uploadError ? (
        <div className={styles.errorBanner} role="alert">
          <CircleAlert size={18} aria-hidden="true" />
          <span>{uploadError}</span>
        </div>
      ) : null}

      <div className={styles.grid}>
        <label className={styles.card}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleUpload}
            disabled={isUploading}
            className={styles.input}
          />
          <div className={styles.topRow}>
            <div className={`${styles.iconWrap} ${styles.accentIcon}`}>
              <Camera size={32} strokeWidth={2.5} />
            </div>
            <div className={styles.badge}>Recommended</div>
          </div>
          <div className={styles.body}>
            <p className={styles.title}>Take photo</p>
            <p className={styles.copy}>Fastest way to start.</p>
            <div className={styles.meta}>
              <span className={styles.metaChip}>One page</span>
              <span className={styles.metaChip}>Good light</span>
            </div>
          </div>
        </label>

        <label className={styles.card}>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className={styles.input}
          />
          <div className={styles.topRow}>
            <div className={styles.iconWrap}>
              <Upload size={32} strokeWidth={2.5} />
            </div>
            <div className={styles.badge}>Gallery</div>
          </div>
          <div className={styles.body}>
            <p className={styles.title}>Upload file</p>
            <p className={styles.copy}>Use a photo you already have.</p>
            <div className={styles.meta}>
              <span className={styles.metaChip}>Photos</span>
              <span className={styles.metaChip}>Screenshots</span>
            </div>
          </div>
        </label>
      </div>

      <div className={styles.supportPanel}>Flat page. Good light. Tight crop.</div>

      {isUploading ? (
        <div className={styles.uploadOverlay}>
          <div className={styles.uploadPanel}>
            <Loader2 className={styles.spinner} size={42} />
            <p className={styles.uploadTitle}>Uploading note</p>
            <p className={styles.uploadCopy}>Starting extraction.</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
