'use client'

import { useEffect, useSyncExternalStore } from 'react'

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

export default function ThemeToggle() {
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

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle appearance"
      title={`Switch to ${nextLabel.toLowerCase()} mode`}
      className={styles.button}
    >
      <span>{nextLabel}</span>
    </button>
  )
}
