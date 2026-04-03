import type { ReactNode } from 'react'

import styles from './RouteRecovery.module.css'

type RouteRecoveryProps = {
  eyebrow?: ReactNode
  title: string
  description: string
  primaryAction?: ReactNode
  secondaryAction?: ReactNode
}

export default function RouteRecovery({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
}: RouteRecoveryProps) {
  return (
    <div className={styles.shell}>
      <section className={styles.surface}>
        <div className={styles.header}>
          {eyebrow ? <div className={styles.eyebrow}>{eyebrow}</div> : null}

          <div className={styles.copy}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>
          </div>
        </div>

        {primaryAction || secondaryAction ? (
          <div className={styles.actions}>
            {primaryAction}
            {secondaryAction}
          </div>
        ) : null}
      </section>
    </div>
  )
}
