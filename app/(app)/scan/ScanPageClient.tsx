'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Camera, CheckCircle2, CircleAlert, Loader2, Repeat2, ScanLine, Upload, X } from 'lucide-react'

import { uploadNote } from '@/app/actions/upload'

import shellStyles from '../AppScreen.module.css'
import styles from './ScanPage.module.css'

export default function ScanPageClient({
  initialAutoPublish = false,
  remixSource = null,
}: {
  initialAutoPublish?: boolean
  remixSource?: {
    card_id: string
    title: string | null
    signedUrl: string | null
  } | null
}) {
  const [pickerKey, setPickerKey] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadState, setUploadState] = useState<'idle' | 'review' | 'uploading' | 'success'>('idle')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [publish, setPublish] = useState(initialAutoPublish)
  const router = useRouter()

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [selectedFile])

  useEffect(() => {
    setPublish(initialAutoPublish)
  }, [initialAutoPublish])

  function formatFileSize(bytes: number) {
    if (bytes < 1024 * 1024) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function getUploadErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) {
      return error.message
    }

    return 'We could not upload this image. Please try again.'
  }

  function handleSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setUploadState('review')
    setUploadError(null)
  }

  function handleChangeImage() {
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadError(null)
    setUploadState('idle')
    setPublish(initialAutoPublish)
    setPickerKey((current) => current + 1)
  }

  async function handleUpload() {
    if (!selectedFile) return

    setUploadState('uploading')
    setUploadError(null)
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('publish', publish ? 'true' : 'false')
    if (remixSource?.card_id) {
      formData.append('remix_card_id', remixSource.card_id)
    }

    try {
      const session = await uploadNote(formData)
      setUploadState('success')
      router.push(`/scan/${session.id}`)
    } catch (error) {
      console.error(error)
      setUploadError(getUploadErrorMessage(error))
      setUploadState('review')
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

      {remixSource ? (
        <div className={styles.remixPanel}>
          <div className={styles.remixCopy}>
            <div className={styles.badge}>
              <Repeat2 size={14} aria-hidden="true" />
              <span>Remix</span>
            </div>
            <p className={styles.remixTitle}>{remixSource.title || 'Community card reference'}</p>
            <p className={styles.remixText}>Pinned to this session as the reference card for the flow you are about to build.</p>
          </div>
          {remixSource.signedUrl ? (
            <div className={styles.remixThumb}>
              <Image
                src={remixSource.signedUrl}
                alt={remixSource.title || 'Community card reference'}
                fill
                unoptimized
                sizes="96px"
                className={styles.remixThumbImage}
              />
            </div>
          ) : null}
          <Link href="/community" className={styles.remixLink}>
            Back to community
          </Link>
        </div>
      ) : null}

      {uploadState === 'review' && selectedFile && previewUrl ? (
        <section className={styles.reviewPanel}>
          <div className={styles.reviewCopy}>
            <div className={styles.badge}>Ready</div>
            <p className={styles.title}>Check the image first.</p>
            <p className={styles.copy}>If the crop or clarity is off, change it before uploading.</p>
            <div className={styles.meta}>
              <span className={styles.metaChip}>{selectedFile.name}</span>
              <span className={styles.metaChip}>{formatFileSize(selectedFile.size)}</span>
            </div>
            <div className={styles.publishWrapper}>
              <label className={styles.publishToggle}>
                <input
                  type="checkbox"
                  checked={publish}
                  onChange={(e) => setPublish(e.target.checked)}
                />
                Publish to Community
              </label>
            </div>
            <div className={styles.reviewActions}>
              <button type="button" className={styles.primaryAction} onClick={handleUpload}>
                Use image
              </button>
              <button type="button" className={styles.secondaryAction} onClick={handleChangeImage}>
                Change image
              </button>
            </div>
          </div>

          <div className={styles.previewStage}>
            <div className={styles.previewFrame}>
              <button
                type="button"
                className={styles.previewClose}
                onClick={handleChangeImage}
                aria-label="Close image preview"
              >
                <X size={16} />
              </button>
              <Image
                src={previewUrl}
                alt="Selected note preview"
                fill
                unoptimized
                sizes="(max-width: 767px) 100vw, 50vw"
                className={styles.previewImage}
              />
            </div>
          </div>
        </section>
      ) : (
        <div className={styles.grid}>
          <label className={styles.card}>
            <input
              key={`camera-${pickerKey}`}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleSelectFile}
              disabled={uploadState === 'uploading' || uploadState === 'success'}
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
              key={`gallery-${pickerKey}`}
              type="file"
              accept="image/*"
              onChange={handleSelectFile}
              disabled={uploadState === 'uploading' || uploadState === 'success'}
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
      )}

      <div className={styles.supportPanel}>Flat page. Good light. Tight crop.</div>

      {uploadState === 'uploading' || uploadState === 'success' ? (
        <div className={styles.uploadOverlay}>
          <div className={styles.uploadPanel}>
            {uploadState === 'success' ? (
              <CheckCircle2 size={42} />
            ) : (
              <Loader2 className={styles.spinner} size={42} />
            )}
            <p className={styles.uploadTitle}>
              {uploadState === 'success' ? 'Upload complete' : 'Uploading note'}
            </p>
            <p className={styles.uploadCopy}>
              {uploadState === 'success' ? 'Opening your session.' : 'Starting extraction.'}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
