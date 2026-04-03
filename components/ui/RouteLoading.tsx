import styles from './RouteLoading.module.css'

type AppRouteLoadingProps = {
  mode?: 'browse' | 'detail' | 'library' | 'session'
}

function Block({ className }: { className?: string }) {
  return <div className={`${styles.shine} ${className ?? ''}`.trim()} aria-hidden="true" />
}

function CardSkeleton() {
  return (
    <div className={styles.cardSkeleton}>
      <Block className={styles.cardMedia} />
      <div className={styles.cardBody}>
        <div className={styles.cardCopyGroup}>
          <Block className={`${styles.metaLine} ${styles.metaLineWide}`} />
          <Block className={`${styles.metaLine} ${styles.metaLineMedium}`} />
        </div>
        <div className={styles.cardActions}>
          <Block className={styles.actionPill} />
          <Block className={styles.actionPill} />
        </div>
      </div>
    </div>
  )
}

function LibraryRowSkeleton() {
  return (
    <div className={styles.listRow}>
      <Block className={styles.rowThumb} />
      <div className={styles.rowBody}>
        <Block className={`${styles.metaLine} ${styles.metaLineWide}`} />
        <Block className={`${styles.metaLine} ${styles.metaLineMedium}`} />
      </div>
    </div>
  )
}

export function MarketingRouteLoading() {
  return (
    <main className={styles.marketingPage}>
      <div className={styles.marketingShell}>
        <div className={styles.marketingNav}>
          <Block className={styles.brandBlock} />
          <div className={styles.navActions}>
            <Block className={styles.navPill} />
            <Block className={`${styles.navPill} ${styles.navPillWide}`} />
          </div>
        </div>

        <section className={styles.hero}>
          <div className={styles.titleStack}>
            <Block className={styles.lineLarge} />
            <Block className={styles.lineLarge} />
            <Block className={styles.lineMedium} />
          </div>
          <Block className={styles.buttonPill} />
        </section>

        <section className={styles.showcase}>
          <Block className={styles.showcaseCard} />
          <Block className={`${styles.showcaseCard} ${styles.showcaseCardCenter}`} />
          <Block className={styles.showcaseCard} />
        </section>
      </div>
    </main>
  )
}

export function AuthRouteLoading() {
  return (
    <main className={styles.authPage}>
      <div className={styles.authShell}>
        <div className={styles.authNav}>
          <Block className={styles.brandBlock} />
          <Block className={styles.navPill} />
        </div>

        <section className={`${styles.authCard} ${styles.shine}`}>
          <Block className={styles.lineLarge} />
          <Block className={styles.lineSmall} />
          <Block className={styles.input} />
          <Block className={styles.input} />
          <Block className={styles.buttonPill} />
        </section>
      </div>
    </main>
  )
}

export function AppRouteLoading({ mode = 'browse' }: AppRouteLoadingProps) {
  if (mode === 'detail') {
    return (
      <div className={styles.appShell}>
        <div className={styles.appHeader}>
          <Block className={styles.eyebrow} />
          <Block className={styles.lineLarge} />
          <Block className={styles.lineMedium} />
        </div>

        <div className={styles.detail}>
          <div className={styles.detailHero}>
            <Block className={styles.detailMedia} />
            <div className={styles.metaGroup}>
              <Block className={`${styles.metaLine} ${styles.metaLineWide}`} />
              <Block className={`${styles.metaLine} ${styles.metaLineMedium}`} />
              <Block className={`${styles.metaLine} ${styles.metaLineShort}`} />
            </div>
          </div>
          <div className={styles.metaGroup}>
            <Block className={`${styles.metaLine} ${styles.metaLineWide}`} />
            <Block className={`${styles.metaLine} ${styles.metaLineMedium}`} />
            <Block className={`${styles.metaLine} ${styles.metaLineShort}`} />
          </div>
          <Block className={styles.panelShort} />
        </div>
      </div>
    )
  }

  if (mode === 'library') {
    return (
      <div className={styles.appShell}>
        <div className={styles.appHeader}>
          <Block className={styles.eyebrow} />
          <Block className={styles.lineLarge} />
          <Block className={styles.lineMedium} />
        </div>

        <div className={styles.list}>
          <LibraryRowSkeleton />
          <LibraryRowSkeleton />
          <LibraryRowSkeleton />
        </div>
      </div>
    )
  }

  if (mode === 'session') {
    return (
      <div className={styles.appShell}>
        <div className={styles.appHeader}>
          <Block className={styles.eyebrow} />
          <Block className={styles.lineLarge} />
          <Block className={styles.lineMedium} />
        </div>

        <div className={styles.detail}>
          <Block className={styles.panelShort} />
          <Block className={styles.panel} />
          <div className={styles.grid}>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.appShell}>
      <div className={styles.appHeader}>
        <Block className={styles.eyebrow} />
        <Block className={styles.lineLarge} />
        <Block className={styles.lineMedium} />
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchRow}>
          <Block className={styles.searchBar} />
          <Block className={styles.filterPill} />
        </div>
        <div className={styles.filterRail}>
          <Block className={styles.chip} />
          <Block className={`${styles.chip} ${styles.chipShort}`} />
          <Block className={styles.chip} />
        </div>
      </div>

      <div className={styles.grid}>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}
