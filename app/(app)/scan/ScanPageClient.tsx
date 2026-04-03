'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Camera, CheckCircle2, CircleAlert, Loader2, Repeat2, ScanLine, Upload, X } from 'lucide-react'

import { useFeedback } from '@/components/providers/FeedbackProvider'
import ActivitySteps, { type ActivityStepItem } from '@/components/ui/ActivitySteps'
import { APP_IMAGE_BLUR_DATA_URL } from '@/lib/ui/image-loading'

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
  const [uploadPresentation, setUploadPresentation] = useState<'foreground' | 'background'>('foreground')
  const [readySessionId, setReadySessionId] = useState<string | null>(null)
  const [publish, setPublish] = useState(initialAutoPublish)
  const router = useRouter()
  const { showFeedback } = useFeedback()
  const mountedRef = useRef(true)
  const uploadPresentationRef = useRef<'foreground' | 'background'>('foreground')
  const uploadAbortRef = useRef<AbortController | null>(null)

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

  useEffect(() => {
    uploadPresentationRef.current = uploadPresentation
  }, [uploadPresentation])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

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
    setUploadPresentation('foreground')
    uploadPresentationRef.current = 'foreground'
    setReadySessionId(null)
    setPublish(initialAutoPublish)
    setPickerKey((current) => current + 1)
  }

  async function handleUpload() {
    if (!selectedFile) return

    uploadAbortRef.current?.abort()
    const controller = new AbortController()
    uploadAbortRef.current = controller
    setUploadState('uploading')
    setUploadError(null)
    setUploadPresentation('foreground')
    uploadPresentationRef.current = 'foreground'
    setReadySessionId(null)
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('publish', publish ? 'true' : 'false')
    if (remixSource?.card_id) {
      formData.append('remix_card_id', remixSource.card_id)
    }

    try {
      const response = await fetch('/api/upload-note', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })
      const payload = (await response.json()) as { id?: string; error?: string }

      if (!response.ok || !payload.id) {
        throw new Error(payload.error || 'We could not upload this image. Please try again.')
      }

      if (!mountedRef.current) return

      uploadAbortRef.current = null
      setReadySessionId(payload.id)
      setUploadState('success')
      if (uploadPresentationRef.current === 'foreground') {
        router.push(`/scan/${payload.id}`)
        return
      }

      showFeedback({
        tone: 'success',
        title: 'Session ready',
        message: 'Open it now or leave it in Library for later.',
      })
    } catch (error) {
      if (!mountedRef.current) return

      uploadAbortRef.current = null
      if (error instanceof Error && error.name === 'AbortError') {
        setUploadState('review')
        showFeedback({
          tone: 'info',
          title: 'Upload canceled',
          message: 'Your image was not submitted.',
          durationMs: 2200,
        })
        return
      }

      setUploadError(getUploadErrorMessage(error))
      setUploadState('review')
    }
  }

  function handleBackgroundUpload() {
    setUploadPresentation('background')
    uploadPresentationRef.current = 'background'
    showFeedback({
      tone: 'info',
      title: 'Upload continues in background',
      message: 'You can keep browsing while this finishes.',
      durationMs: 2400,
    })
  }

  function handleCancelUpload() {
    uploadAbortRef.current?.abort()
  }

  const uploadSteps: ActivityStepItem[] = [
    {
      id: 'upload',
      title: 'Send note',
      detail:
        uploadState === 'success'
          ? 'Your image is stored and locked to this session.'
          : 'Uploading the selected image to Capsule.',
      status: uploadState === 'success' ? 'complete' : 'active',
    },
    {
      id: 'session',
      title: 'Start session',
      detail:
        uploadState === 'success'
          ? 'Extraction started and the session is ready.'
          : 'Preparing a private workspace for this capture.',
      status: uploadState === 'success' ? 'complete' : 'pending',
    },
    {
      id: 'open',
      title: 'Open workspace',
      detail:
        uploadState === 'success'
          ? uploadPresentation === 'background'
            ? 'Ready when you want to open it.'
            : 'Taking you into the live processing view.'
          : 'The session opens as soon as setup finishes.',
      status: uploadState === 'success' ? (uploadPresentation === 'background' ? 'pending' : 'active') : 'pending',
    },
  ]

  const showUploadDock = uploadState === 'uploading' || (uploadState === 'success' && Boolean(readySessionId))

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
                sizes="96px"
                quality={60}
                placeholder="blur"
                blurDataURL={APP_IMAGE_BLUR_DATA_URL}
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

      {showUploadDock ? (
        <div className={`${styles.uploadDock} ${uploadPresentation === 'background' ? styles.uploadDockBackground : ''}`}>
          <div className={styles.uploadPanel}>
            <div className={styles.uploadTopRow}>
              {uploadState === 'success' ? (
                <CheckCircle2 size={42} />
              ) : (
                <Loader2 className={styles.spinner} size={42} />
              )}

              {uploadState === 'uploading' && uploadPresentation === 'foreground' ? (
                <div className={styles.uploadTopActions}>
                  <button type="button" className={styles.uploadSecondaryAction} onClick={handleBackgroundUpload}>
                    Continue in background
                  </button>
                  <button type="button" className={styles.uploadSecondaryAction} onClick={handleCancelUpload}>
                    Cancel upload
                  </button>
                </div>
              ) : uploadState === 'uploading' ? (
                <button type="button" className={styles.uploadSecondaryAction} onClick={handleCancelUpload}>
                  Cancel upload
                </button>
              ) : uploadState === 'success' ? (
                <button type="button" className={styles.uploadSecondaryAction} onClick={handleChangeImage}>
                  Dismiss
                </button>
              ) : null}
            </div>

            <p className={styles.uploadTitle}>
              {uploadState === 'success' ? 'Session ready' : 'Uploading note'}
            </p>
            <p className={styles.uploadCopy}>
              {uploadState === 'success'
                ? uploadPresentation === 'background'
                  ? 'Open it now or leave it in Library for later.'
                  : 'Opening your session now.'
                : uploadPresentation === 'background'
                  ? 'This can finish while you keep browsing.'
                  : 'Keeping the handoff visible while setup runs.'}
            </p>
            {uploadState === 'uploading' ? <ActivitySteps items={uploadSteps} compact /> : null}

            {uploadState === 'success' && readySessionId ? (
              <div className={styles.uploadActions}>
                <button type="button" className={styles.primaryAction} onClick={() => router.push(`/scan/${readySessionId}`)}>
                  Open session
                </button>
                <Link href="/library" className={styles.uploadLinkAction}>
                  Open Library
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
