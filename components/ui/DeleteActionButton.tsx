'use client'

import { Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { deleteCard } from '@/app/actions/card-actions'
import { deleteSession } from '@/app/actions/process'
import { useFeedback } from '@/components/providers/FeedbackProvider'

import AdaptiveSheet from './AdaptiveSheet'
import styles from './DeleteActionButton.module.css'

type DeleteTargetType = 'card' | 'session'

const DELETE_ACTIONS: Record<DeleteTargetType, (targetId: string) => Promise<unknown>> = {
  card: deleteCard,
  session: deleteSession,
}

export default function DeleteActionButton({
  targetId,
  targetType,
  redirectTo,
  compactOnMobile = false,
  iconOnly = false,
  className,
  onDeleted,
}: {
  targetId: string
  targetType: DeleteTargetType
  redirectTo?: string
  compactOnMobile?: boolean
  iconOnly?: boolean
  className?: string
  onDeleted?: () => void
}) {
  const router = useRouter()
  const { showFeedback } = useFeedback()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const noun = targetType === 'session' ? 'session' : 'card'
  const title = targetType === 'session' ? 'Delete this session?' : 'Delete this card?'
  const description =
    targetType === 'session'
      ? 'This removes the source note, generated cards, and session history.'
      : 'This removes the card from your archive. The original session stays available.'
  const ariaLabel = `Delete ${noun}`

  function handleDelete() {
    startTransition(async () => {
      setErrorMessage(null)

      try {
        await DELETE_ACTIONS[targetType](targetId)
        onDeleted?.()
        setIsDialogOpen(false)
        showFeedback({
          tone: 'success',
          title: targetType === 'session' ? 'Capture removed' : 'Card removed',
          message:
            targetType === 'session'
              ? 'The note and linked cards are gone.'
              : 'The card was removed from your archive.',
        })

        if (redirectTo) {
          router.replace(redirectTo)
          return
        }

        router.refresh()
      } catch (error) {
        console.error(`Delete ${targetType} failed:`, error)
        setErrorMessage(`Could not delete this ${noun}. Try again.`)
        showFeedback({
          tone: 'error',
          title: `Could not delete ${noun}`,
          message: 'Try again in a moment.',
        })
      }
    })
  }

  return (
    <>
      <button
        type="button"
        className={`${styles.button} ${compactOnMobile ? styles.compactOnMobile : ''} ${iconOnly ? styles.iconOnly : ''} ${className ?? ''}`.trim()}
        onClick={() => {
          setErrorMessage(null)
          setIsDialogOpen(true)
        }}
        disabled={isPending}
        aria-label={ariaLabel}
        title={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={isDialogOpen ? 'true' : undefined}
      >
        {isPending ? <Loader2 size={16} className={styles.spinner} /> : <Trash2 size={16} />}
        <span className={styles.label}>Delete</span>
      </button>

      <AdaptiveSheet
        open={isDialogOpen}
        onClose={() => {
          if (!isPending) {
            setIsDialogOpen(false)
          }
        }}
        title={title}
        description={description}
        eyebrow={
          <>
            <Trash2 size={14} />
            <span>Remove</span>
          </>
        }
        size="compact"
        closeLabel={`Close ${noun} dialog`}
        footer={
          <>
            <button
              type="button"
              className={styles.dialogAction}
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.dialogConfirm}
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : `Delete ${noun}`}
            </button>
          </>
        }
      >
        <div className={styles.dialogMeta}>
          <p className={styles.dialogLead}>
            {targetType === 'session' ? 'Delete the full capture.' : 'Delete this saved card.'}
          </p>
          <p className={styles.dialogCopy}>
            {targetType === 'session'
              ? 'Published copies and generated card views linked to this note will disappear too.'
              : 'You can still reopen the source session and generate again later if needed.'}
          </p>
        </div>
        {errorMessage ? (
          <div className={styles.dialogError} role="alert">
            {errorMessage}
          </div>
        ) : null}
      </AdaptiveSheet>
    </>
  )
}
