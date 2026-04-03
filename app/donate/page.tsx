'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import ThemeToggle from '@/components/marketing/ThemeToggle'
import Logo from '@/components/ui/Logo'
import styles from './DonatePage.module.css'

type CardType = 'donate' | 'sponsor' | 'premium'

type DonateCard = {
  type: CardType
  label: string
  displayWord: string
  title: string
  detail: string
  serial: string
  subject: string
}

const CARDS: DonateCard[] = [
  {
    type: 'donate',
    label: 'Give',
    displayWord: 'Open',
    title: 'Sponsor students',
    detail: 'Free student access.',
    serial: '1001',
    subject: 'Capsule donation',
  },
  {
    type: 'sponsor',
    label: 'Fund',
    displayWord: 'Access',
    title: 'Sponsor access',
    detail: 'For schools and cohorts.',
    serial: '2401',
    subject: 'Capsule sponsorship',
  },
  {
    type: 'premium',
    label: 'Upgrade',
    displayWord: 'Premium',
    title: 'Request premium',
    detail: 'For heavy workflows.',
    serial: '9001',
    subject: 'Capsule premium request',
  },
]

export default function DonatePage() {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeCard = CARDS[activeIndex]

  const cardPositions = useMemo(() => {
    return CARDS.map((_, index) => {
      const offset = (index - activeIndex + CARDS.length) % CARDS.length

      if (offset === 0) {
        return styles.cardActive
      }

      if (offset === 1) {
        return styles.cardRight
      }

      if (offset === CARDS.length - 1) {
        return styles.cardLeft
      }

      return styles.cardHidden
    })
  }, [activeIndex])

  function openEmail(subject: string) {
    window.location.assign(`mailto:hello@dyrane.tech?subject=${encodeURIComponent(subject)}`)
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav aria-label="Primary" className={styles.nav}>
          <Link href="/" aria-label="Capsule home" className={styles.brand}>
            <Logo size={40} showText />
          </Link>

          <div className={styles.navActions}>
            <Link href="/community" className={styles.quietLink}>
              Community
            </Link>
            <Link href="/login" className={styles.navButton}>
              Open Capsule
            </Link>
          </div>
        </nav>

        <section aria-labelledby="donate-title" className={styles.stage}>
          <div className={styles.hero}>
            <h1 id="donate-title" className={styles.title}>
              Keep learning open.
            </h1>
          </div>

          <section className={styles.showcase} aria-label="Support options">
            <div className={styles.canvas}>
              <div aria-hidden="true" className={styles.glow} />

              {CARDS.map((card, index) => {
                const isActive = index === activeIndex

                return (
                  <button
                    key={card.type}
                    type="button"
                    className={`${styles.previewCard} ${cardPositions[index]}`}
                    onClick={() => setActiveIndex(index)}
                    aria-pressed={isActive}
                    aria-label={card.title}
                  >
                    <span className={styles.cardStage}>
                      <span className={`${styles.cardFrame} ${styles[`cardFrame${card.type[0].toUpperCase()}${card.type.slice(1)}`]}`}>
                        <span className={styles.cardMeta}>
                          <span className={styles.cardTopRow}>
                            <Logo size={28} className={styles.cardLogo} />
                            <span className={styles.cardLabel}>{card.label}</span>
                          </span>
                          <span aria-hidden="true" className={styles.cardChip}>
                            <span className={styles.cardChipCore} />
                            <span className={styles.cardChipLine} />
                          </span>
                          <span className={styles.cardCenter}>
                            <span className={styles.cardWord}>{card.displayWord}</span>
                          </span>
                          <span className={styles.cardBottomRow}>
                            <span className={styles.cardTitleBlock}>
                              <span className={styles.cardTitle}>{card.title}</span>
                              <span className={styles.cardCaption}>Capsule support</span>
                            </span>
                            <span className={styles.cardNumber}>•••• {card.serial}</span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div className={styles.optionRail}>
              {CARDS.map((card, index) => {
                const isActive = index === activeIndex

                return (
                  <button
                    key={`${card.type}-option`}
                    type="button"
                    className={`${styles.optionButton} ${isActive ? styles.optionButtonActive : ''}`}
                    onClick={() => setActiveIndex(index)}
                    aria-pressed={isActive}
                  >
                    <span className={styles.optionLabel}>{card.label}</span>
                    <span className={styles.optionTitle}>{card.title}</span>
                  </button>
                )
              })}
            </div>

            <div className={styles.actionRow}>
              <p className={styles.selectionText}>{activeCard.detail}</p>
              <button type="button" className={styles.primaryButton} onClick={() => openEmail(activeCard.subject)}>
                Email us
              </button>
            </div>
          </section>
        </section>

        <footer aria-label="Appearance" className={styles.footer}>
          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>
              Back home
            </Link>
            <a href="mailto:hello@dyrane.tech?subject=Capsule%20sponsorship" className={styles.footerLink}>
              Sponsor access
            </a>
            <a href="mailto:hello@dyrane.tech" className={styles.footerLink}>
              hello@dyrane.tech
            </a>
          </div>
          <ThemeToggle />
        </footer>
      </div>
    </main>
  )
}
