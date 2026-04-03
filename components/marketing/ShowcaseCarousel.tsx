'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'

import { APP_IMAGE_BLUR_DATA_URL } from '@/lib/ui/image-loading'
import styles from './ShowcaseCarousel.module.css'

type ShowcaseCard = {
  src: string
  alt: string
  fallbackSrc?: string
}

type Props = {
  cards: ShowcaseCard[]
}

const SWIPE_THRESHOLD = 36

export default function ShowcaseCarousel({ cards }: Props) {
  const [activeIndex, setActiveIndex] = useState(1)
  const [loadedCards, setLoadedCards] = useState<Record<string, boolean>>({})
  const [failedCards, setFailedCards] = useState<Record<string, boolean>>({})
  const pointerStartX = useRef<number | null>(null)

  function goToIndex(index: number) {
    setActiveIndex((index + cards.length) % cards.length)
  }

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % cards.length)
  }, [cards.length])

  useEffect(() => {
    const timer = setInterval(() => {
      goToNext()
    }, 4000)

    return () => clearInterval(timer)
  }, [goToNext])

  function goToPrevious() {
    setActiveIndex((current) => (current - 1 + cards.length) % cards.length)
  }

  function getPosition(index: number) {
    const offset = (index - activeIndex + cards.length) % cards.length

    if (offset === 0) {
      return styles.center
    }

    if (offset === 1) {
      return styles.right
    }

    if (offset === cards.length - 1) {
      return styles.left
    }

    return styles.hidden
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    pointerStartX.current = event.clientX
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null) {
      return
    }

    const deltaX = event.clientX - pointerStartX.current
    pointerStartX.current = null

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
      return
    }

    if (deltaX < 0) {
      goToNext()
      return
    }

    goToPrevious()
  }

  function handlePointerCancel() {
    pointerStartX.current = null
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToPrevious()
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToNext()
    }
  }

  return (
    <div className={styles.root}>
      <div aria-hidden="true" className={styles.glow} />

      <div
        className={styles.canvas}
        role="region"
        aria-roledescription="carousel"
        aria-label="Learning card examples"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {cards.map((card, index) => {
          const positionClassName = getPosition(index)
          const isActive = index === activeIndex
          const label = isActive ? `${card.alt}, current card` : `Show ${card.alt}`
          const fallbackSrc = card.fallbackSrc ?? card.src
          const showPrimary = card.src === fallbackSrc || (loadedCards[card.src] && !failedCards[card.src])

          return (
            <button
              key={card.src}
              type="button"
              className={`${styles.card} ${positionClassName}`}
              onClick={() => {
                if (!isActive) {
                  goToIndex(index)
                }
              }}
              aria-label={label}
              aria-pressed={isActive}
            >
              <span className={styles.cardStage}>
                <span className={styles.cardFrame}>
                  <Image
                    src={fallbackSrc}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes={
                      isActive
                        ? '(max-width: 1023px) min(100vw - 48px, 36rem), 42vw'
                        : '(max-width: 1023px) 38vw, 24vw'
                    }
                    quality={60}
                    placeholder="blur"
                    blurDataURL={APP_IMAGE_BLUR_DATA_URL}
                    className={`${styles.cardImage} ${styles.fallbackImage} ${showPrimary ? styles.fallbackHidden : ''}`}
                  />
                  <Image
                    src={card.src}
                    alt={card.alt}
                    fill
                    priority={isActive}
                    onLoad={() => {
                      setLoadedCards((current) => {
                        if (current[card.src]) return current
                        return { ...current, [card.src]: true }
                      })
                    }}
                    onError={() => {
                      setFailedCards((current) => {
                        if (current[card.src]) return current
                        return { ...current, [card.src]: true }
                      })
                    }}
                    sizes={
                      isActive
                        ? '(max-width: 1023px) min(100vw - 48px, 36rem), 42vw'
                        : '(max-width: 1023px) 38vw, 24vw'
                    }
                    quality={72}
                    placeholder="blur"
                    blurDataURL={APP_IMAGE_BLUR_DATA_URL}
                    className={`${styles.cardImage} ${styles.primaryImage} ${showPrimary ? styles.primaryReady : ''}`}
                  />
                </span>
              </span>
            </button>
          )
        })}

        <p className={styles.srOnly}>
          Swipe or use the left and right arrow keys to cycle through example cards.
        </p>
      </div>
    </div>
  )
}
