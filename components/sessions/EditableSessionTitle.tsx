'use client'

import { Check, PencilLine, X } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'

import { updateSessionTitle } from '@/app/actions/process'
import { useFeedback } from '@/components/providers/FeedbackProvider'

import styles from './EditableSessionTitle.module.css'

type EditableSessionTitleProps = {
  sessionId: string
  title: string
  variant?: 'panel' | 'list'
  onSaved?: (payload: { displayTitle: string; customTitle: string | null }) => void
}

export default function EditableSessionTitle({
  sessionId,
  title,
  variant = 'list',
  onSaved,
}: EditableSessionTitleProps) {
  const { showFeedback } = useFeedback()
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(title)
  const [displayTitle, setDisplayTitle] = useState(title)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setDraftTitle(title)
    setDisplayTitle(title)
  }, [title])

  function handleCancel() {
    setDraftTitle(displayTitle)
    setIsEditing(false)
  }

  function handleSave() {
    startTransition(async () => {
      try {
        const result = await updateSessionTitle(sessionId, draftTitle)
        setDisplayTitle(result.displayTitle)
        setDraftTitle(result.displayTitle)
        setIsEditing(false)
        onSaved?.(result)
        showFeedback({
          tone: 'success',
          title: 'Library name updated',
          message: result.customTitle ? 'Your custom title is saved.' : 'The automatic title is restored.',
        })
      } catch (error) {
        showFeedback({
          tone: 'error',
          title: 'Could not save this name',
          message: error instanceof Error ? error.message : 'Try again in a moment.',
        })
      }
    })
  }

  return (
    <div className={styles.root}>
      {!isEditing ? (
        <div className={styles.inlineRow}>
          <p className={`${styles.title} ${variant === 'panel' ? styles.panelTitle : styles.listTitle}`}>{displayTitle}</p>
          <button
            type="button"
            className={styles.trigger}
            onClick={() => setIsEditing(true)}
            aria-label="Edit library name"
            disabled={isPending}
          >
            <PencilLine size={14} />
            <span className={styles.triggerLabel}>Edit name</span>
          </button>
        </div>
      ) : (
        <div className={styles.form}>
          <input
            type="text"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            className={styles.field}
            placeholder="Name this library"
            maxLength={80}
            autoFocus
          />
          <div className={styles.actions}>
            <button type="button" className={styles.saveButton} onClick={handleSave} disabled={isPending}>
              <Check size={14} />
              <span>{isPending ? 'Saving...' : 'Save'}</span>
            </button>
            <button type="button" className={styles.ghostButton} onClick={handleCancel} disabled={isPending}>
              <X size={14} />
              <span>Cancel</span>
            </button>
          </div>
          <p className={styles.helper}>Leave it empty to fall back to the automatic title.</p>
        </div>
      )}
    </div>
  )
}
