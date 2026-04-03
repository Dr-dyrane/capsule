'use client'

import { useEffect, useId, useRef, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'
import { X } from 'lucide-react'

import styles from './AdaptiveSheet.module.css'

type AdaptiveSheetProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  eyebrow?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  closeLabel?: string
  size?: 'compact' | 'regular' | 'wide'
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(root: HTMLElement | null) {
  if (!root) return []

  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true',
  )
}

export default function AdaptiveSheet({
  open,
  onClose,
  title,
  description,
  eyebrow,
  children,
  footer,
  closeLabel,
  size = 'regular',
}: AdaptiveSheetProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const frame = window.requestAnimationFrame(() => {
      const [firstFocusable] = getFocusableElements(panelRef.current)
      firstFocusable?.focus()
    })

    return () => {
      document.body.style.overflow = previousOverflow
      window.cancelAnimationFrame(frame)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function handleWindowKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleWindowKeyDown)
    return () => window.removeEventListener('keydown', handleWindowKeyDown)
  }, [onClose, open])

  function handlePanelKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Tab') return

    const focusableElements = getFocusableElements(panelRef.current)
    if (focusableElements.length === 0) {
      event.preventDefault()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  if (!open) {
    return null
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div className={styles.viewport}>
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          className={`${styles.panel} ${styles[size]}`}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={handlePanelKeyDown}
        >
          <div className={styles.handle} aria-hidden="true" />

          <div className={styles.header}>
            <div className={styles.titleStack}>
              {eyebrow ? <div className={styles.eyebrow}>{eyebrow}</div> : null}
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              {description ? (
                <p id={descriptionId} className={styles.description}>
                  {description}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label={closeLabel ?? `Close ${title}`}
            >
              <X size={18} />
            </button>
          </div>

          {children ? <div className={styles.content}>{children}</div> : null}
          {footer ? <div className={styles.footer}>{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}
