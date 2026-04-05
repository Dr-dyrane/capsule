'use client'

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
import { usePathname } from 'next/navigation'

import styles from './NavigationFeedbackProvider.module.css'

type NavigationFeedbackContextValue = {
  pendingHref: string | null
  beginNavigation: (href: string) => void
  clearNavigation: () => void
}

const NavigationFeedbackContext = createContext<NavigationFeedbackContextValue | null>(null)

export function useNavigationFeedback() {
  const value = useContext(NavigationFeedbackContext)

  if (!value) {
    throw new Error('useNavigationFeedback must be used within NavigationFeedbackProvider')
  }

  return value
}

export default function NavigationFeedbackProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentLocationKey = pathname
  const visiblePendingHref = pendingHref && pendingHref !== currentLocationKey ? pendingHref : null

  const clearNavigation = useCallback(() => {
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current)
      clearTimeoutRef.current = null
    }

    setPendingHref(null)
  }, [])

  const beginNavigation = useCallback(
    (href: string) => {
      if (!href || href === currentLocationKey) {
        return
      }

      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current)
      }

      setPendingHref(href)
      clearTimeoutRef.current = setTimeout(() => {
        setPendingHref(null)
        clearTimeoutRef.current = null
      }, 8000)
    },
    [currentLocationKey],
  )

  useEffect(() => {
    document.body.dataset.routePending = visiblePendingHref ? 'true' : 'false'

    return () => {
      document.body.dataset.routePending = 'false'
    }
  }, [visiblePendingHref])

  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current)
      }
    }
  }, [])

  const value = useMemo(
    () => ({
      pendingHref: visiblePendingHref,
      beginNavigation,
      clearNavigation,
    }),
    [beginNavigation, clearNavigation, visiblePendingHref],
  )

  return (
    <NavigationFeedbackContext.Provider value={value}>
      {children}
      {visiblePendingHref ? (
        <div className={styles.viewport} aria-live="polite" aria-atomic="true">
          <div className={styles.topRail} aria-hidden="true">
            <div className={styles.topBar} />
          </div>
          <div className={styles.pill} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            <span className={styles.copy}>
              <span className={styles.label}>Opening</span>
              <span className={styles.hint}>Loading view</span>
            </span>
          </div>
        </div>
      ) : null}
    </NavigationFeedbackContext.Provider>
  )
}
