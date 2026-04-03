'use client'

import {
  CheckCircle2,
  CircleAlert,
  Info,
  X,
  type LucideIcon,
} from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import styles from './FeedbackProvider.module.css'

type FeedbackTone = 'success' | 'error' | 'info'

type FeedbackInput = {
  tone?: FeedbackTone
  title: string
  message?: string
  durationMs?: number
}

type FeedbackItem = FeedbackInput & {
  id: string
  tone: FeedbackTone
  durationMs: number
}

type FeedbackContextValue = {
  showFeedback: (feedback: FeedbackInput) => void
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null)

const TONE_ICON: Record<FeedbackTone, LucideIcon> = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
}

export function useFeedback() {
  const value = useContext(FeedbackContext)

  if (!value) {
    throw new Error('useFeedback must be used within FeedbackProvider')
  }

  return value
}

export default function FeedbackProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const idCounterRef = useRef(0)

  const dismissFeedback = useCallback((id: string) => {
    const timeout = timeoutsRef.current.get(id)

    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(id)
    }

    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const showFeedback = useCallback(
    ({ tone = 'info', title, message, durationMs = 3200 }: FeedbackInput) => {
      idCounterRef.current += 1
      const id = `${Date.now()}-${idCounterRef.current}`

      setItems((current) => {
        const nextItem: FeedbackItem = { id, tone, title, message, durationMs }
        return [...current.slice(-2), nextItem]
      })

      const timeout = setTimeout(() => {
        dismissFeedback(id)
      }, durationMs)

      timeoutsRef.current.set(id, timeout)
    },
    [dismissFeedback],
  )

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      timeoutsRef.current.clear()
    }
  }, [])

  const value = useMemo(
    () => ({
      showFeedback,
    }),
    [showFeedback],
  )

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      <div className={styles.viewport} aria-live="polite" aria-atomic="false">
        <div className={styles.stack}>
          {items.map((item) => {
            const Icon = TONE_ICON[item.tone]

            return (
              <section
                key={item.id}
                className={`${styles.item} ${styles[item.tone]}`}
                role={item.tone === 'error' ? 'alert' : 'status'}
              >
                <div className={styles.toneIcon}>
                  <Icon size={18} aria-hidden="true" />
                </div>

                <div className={styles.copy}>
                  <p className={styles.title}>{item.title}</p>
                  {item.message ? <p className={styles.message}>{item.message}</p> : null}
                </div>

                <button
                  type="button"
                  className={styles.dismiss}
                  onClick={() => dismissFeedback(item.id)}
                  aria-label={`Dismiss ${item.title}`}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </section>
            )
          })}
        </div>
      </div>
    </FeedbackContext.Provider>
  )
}
