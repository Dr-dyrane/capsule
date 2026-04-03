import { CheckCircle2, CircleAlert, Loader2 } from 'lucide-react'

import styles from './ActivitySteps.module.css'

export type ActivityStepStatus = 'active' | 'complete' | 'error' | 'pending'

export type ActivityStepItem = {
  id: string
  title: string
  detail: string
  status: ActivityStepStatus
  actionLabel?: string
  onAction?: () => void
}

export default function ActivitySteps({
  items,
  compact = false,
}: {
  items: ActivityStepItem[]
  compact?: boolean
}) {
  return (
    <div className={`${styles.surface} ${compact ? styles.compact : ''}`} role="status" aria-live="polite">
      <ol className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={`${styles.indicator} ${styles[`indicator${item.status[0].toUpperCase()}${item.status.slice(1)}`]}`}>
              {item.status === 'complete' ? (
                <CheckCircle2 size={14} aria-hidden="true" />
              ) : item.status === 'error' ? (
                <CircleAlert size={14} aria-hidden="true" />
              ) : item.status === 'active' ? (
                <Loader2 size={14} className={styles.spinner} aria-hidden="true" />
              ) : (
                <span className={styles.pendingDot} aria-hidden="true" />
              )}
            </div>
            <div className={styles.copy}>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.detail}>{item.detail}</p>
            </div>
            {item.actionLabel && item.onAction ? (
              <button type="button" className={styles.action} onClick={item.onAction}>
                {item.actionLabel}
              </button>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
