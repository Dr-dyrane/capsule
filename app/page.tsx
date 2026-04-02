import Link from 'next/link'

import ShowcaseCarousel from '@/components/marketing/ShowcaseCarousel'
import ThemeToggle from '@/components/marketing/ThemeToggle'
import styles from './MarketingPage.module.css'

const showcaseCards = [
  {
    src: '/demo/multiple-myeloma-learning-card.png',
    alt: 'Multiple myeloma learning card example',
  },
  {
    src: '/demo/acute-myeloid-leukemia-learning-card.png',
    alt: 'Acute myeloid leukemia learning card example',
  },
  {
    src: '/demo/tumor-lysis-syndrome-learning-card-v4.png',
    alt: 'Tumor lysis syndrome learning card example',
  },
]

export default function MarketingPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav aria-label="Primary" className={styles.nav}>
          <Link href="/" aria-label="Capsule home" className={styles.brand}>
            Capsule
          </Link>

          <div className={styles.navActions}>
            <Link href="#showcase" className={`${styles.quietNavLink} ${styles.examplesLink}`}>
              Examples
            </Link>
            <Link href="/login" className={styles.navButton}>
              Log in
            </Link>
          </div>
        </nav>

        <section aria-labelledby="marketing-title" className={styles.stage}>
          <div className={styles.hero}>
            <h1 id="marketing-title" className={styles.title}>
              Scan notes into cards.
            </h1>

            <Link href="/login" className={styles.primaryButton}>
              Get Started
            </Link>
          </div>

          <div id="showcase" className={styles.showcase}>
            <ShowcaseCarousel cards={showcaseCards} />
          </div>
        </section>

        <footer aria-label="Appearance" className={styles.footer}>
          <ThemeToggle />
        </footer>
      </div>
    </main>
  )
}
