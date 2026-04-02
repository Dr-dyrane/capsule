'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { Moon, SunMedium } from 'lucide-react'
import clsx from 'clsx'

import styles from './ThemeToggle.module.css'

type ThemeMode = 'dark' | 'light'

const STORAGE_KEY = 'capsule-theme'
const THEME_EVENT = 'capsule-theme-change'

function resolveTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) {
      callback()
    }
  }
  const handleThemeChange = () => callback()

  mediaQuery.addEventListener('change', handleThemeChange)
  window.addEventListener('storage', handleStorage)
  window.addEventListener(THEME_EVENT, handleThemeChange)

  return () => {
    mediaQuery.removeEventListener('change', handleThemeChange)
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(THEME_EVENT, handleThemeChange)
  }
}

function getSnapshot() {
  return resolveTheme()
}

function getServerSnapshot(): ThemeMode {
  return 'dark'
}

type ThemeToggleProps = {
  compact?: boolean
  className?: string
}

export default function ThemeToggle({ compact = false, className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  function toggleTheme() {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark'

    window.localStorage.setItem(STORAGE_KEY, nextTheme)
    document.documentElement.dataset.theme = nextTheme
    document.documentElement.style.colorScheme = nextTheme
    window.dispatchEvent(new Event(THEME_EVENT))
  }

  const nextLabel = theme === 'dark' ? 'Light' : 'Dark'
  const Icon = theme === 'dark' ? SunMedium : Moon

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle appearance"
      title={`Switch to ${nextLabel.toLowerCase()} mode`}
      className={clsx(styles.button, compact && styles.compact, className)}
    >
      <Icon size={16} aria-hidden="true" />
      <span className={styles.label}>{nextLabel}</span>
    </button>
  )
}
