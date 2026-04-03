'use client'

import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

import styles from './MobileBottomSheet.module.css'

type MobileBottomSheetProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function MobileBottomSheet({ open, onClose, title, children }: MobileBottomSheetProps) {
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) {
    return null
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={styles.sheet}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.handle} aria-hidden="true" />

        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close filters">
            <X size={18} />
          </button>
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
