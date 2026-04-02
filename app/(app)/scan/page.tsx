'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadNote } from '@/app/actions/upload'
import { Camera, CircleAlert, Loader2, ScanLine, Upload } from 'lucide-react'

import shellStyles from '../AppScreen.module.css'
import styles from './ScanPage.module.css'

export default function ScanPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const router = useRouter()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
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
        <h1 className={shellStyles.title}>Scan a page into a clean card flow.</h1>
        <p className={shellStyles.copy}>
          One note in. Structured points and quick-scan cards out.
        </p>
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
            <p className={styles.copy}>Use your camera for a fast one-page capture.</p>
            <div className={styles.meta}>
              <span className={styles.metaChip}>One sheet at a time</span>
              <span className={styles.metaChip}>Best on good light</span>
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
            <p className={styles.copy}>Choose an image you already captured and keep moving.</p>
            <div className={styles.meta}>
              <span className={styles.metaChip}>Photos or screenshots</span>
              <span className={styles.metaChip}>Works with notes pages</span>
            </div>
          </div>
        </label>
      </div>

      <div className={styles.supportPanel}>
        Clean single-page photos work best. Keep the page flat, bright, and easy to crop at a glance.
      </div>

      {isUploading && (
        <div className={styles.uploadOverlay}>
          <div className={styles.uploadPanel}>
            <Loader2 className={styles.spinner} size={42} />
            <p className={styles.uploadTitle}>Uploading note</p>
            <p className={styles.uploadCopy}>We’re starting the extraction flow now.</p>
          </div>
        </div>
      )}
    </div>
  )
}
