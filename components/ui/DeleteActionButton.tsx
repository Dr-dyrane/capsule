'use client'

import { Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { deleteCard } from '@/app/actions/card-actions'
import { deleteSession } from '@/app/actions/process'

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
  className,
  onDeleted,
}: {
  targetId: string
  targetType: DeleteTargetType
  redirectTo?: string
  compactOnMobile?: boolean
  className?: string
  onDeleted?: () => void
}) {
  const router = useRouter()
  const [isConfirming, setIsConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  const ariaLabel = isConfirming ? `Confirm delete ${targetType}` : `Delete ${targetType}`

  function handleClick() {
    if (!isConfirming) {
      setIsConfirming(true)
      return
    }

    startTransition(async () => {
      try {
        await DELETE_ACTIONS[targetType](targetId)
        onDeleted?.()
        setIsConfirming(false)

        if (redirectTo) {
          router.replace(redirectTo)
          return
        }

        router.refresh()
      } catch (error) {
        console.error(`Delete ${targetType} failed:`, error)
        setIsConfirming(false)
      }
    })
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${compactOnMobile ? styles.compactOnMobile : ''} ${
        isConfirming ? styles.confirm : ''
      } ${className ?? ''}`}
      onClick={handleClick}
      disabled={isPending}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {isPending ? <Loader2 size={16} className={styles.spinner} /> : <Trash2 size={16} />}
      <span className={styles.label}>{isConfirming ? 'Confirm' : 'Delete'}</span>
    </button>
  )
}
