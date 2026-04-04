import { Archive } from 'lucide-react'

import { getSavedCommunityCardsWithUrls } from '@/app/actions/community'
import { getDueReviewCount } from '@/app/actions/review'
import CommunityCard from '@/components/cards/CommunityCard'
import { getSessionDisplayTitle } from '@/lib/sessions/display'
import PendingLink from '@/components/ui/PendingLink'
import { createSignedObjectUrlsSafe } from '@/lib/storage/signed-urls'
import { createClient } from '@/lib/supabase/server'
import type { SessionRecord } from '@/lib/types'
import { getUiDensity } from '@/lib/ui/density'
import LibrarySessionList from './LibrarySessionList'

import styles from '../AppScreen.module.css'
import listStyles from './LibraryPage.module.css'

export default async function LibraryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const densityMode = getUiDensity(user)

  const [{ data: sessions }, { cards: savedCards, signedUrls: savedCardUrls }, dueReviewCount] = await Promise.all([
    supabase.from('sessions').select('*').order('created_at', { ascending: false }),
    getSavedCommunityCardsWithUrls(12),
    getDueReviewCount(),
  ])

  const signedNoteUrls = await createSignedObjectUrlsSafe(
    'notes',
    (sessions ?? []).map((session) => session.source_url),
  )

  const sessionItems = (sessions ?? []).map((session) => {
    const typedSession = session as SessionRecord

    return {
      session: typedSession,
      title: getSessionDisplayTitle(typedSession),
      dateLabel: new Date(session.created_at).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
      imageUrl: signedNoteUrls[session.source_url],
    }
  })

  const hasSessions = sessionItems.length > 0
  const hasSavedCards = savedCards.length > 0
  const firstSavedCardId = savedCards[0]?.card_id ?? null

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <Archive size={14} aria-hidden="true" />
          <span>Library</span>
        </div>
        <h1 className={styles.title}>Past sessions.</h1>
        <p className={styles.copy}>{densityMode === 'focused' ? 'Pick up where you left off.' : 'Open any capture.'}</p>
      </header>

      {!hasSessions && !hasSavedCards ? (
        <div className={styles.panel}>
          <div className={`${styles.panelInner} ${styles.emptyState}`}>
            <p className={styles.emptyTitle}>Your library is empty</p>
            <p className={styles.emptyCopy}>Generate your first card or explore what the community has already shared.</p>
            <div className={listStyles.emptyActions}>
              <PendingLink href="/community" className={styles.accentLink}>
                Explore community
              </PendingLink>
              <PendingLink href="/scan" className={listStyles.secondaryLink}>
                Scan note
              </PendingLink>
            </div>
          </div>
        </div>
      ) : (
        <div className={listStyles.sections}>
          {dueReviewCount > 0 ? (
            <section className={listStyles.reviewShortcut}>
              <div>
                <h2 className={listStyles.reviewShortcutTitle}>Review due</h2>
                <p className={listStyles.reviewShortcutCopy}>
                  {dueReviewCount} {dueReviewCount === 1 ? 'card is' : 'cards are'} ready for recall.
                </p>
              </div>
              <PendingLink href="/review" className={styles.accentLink}>
                Review now
              </PendingLink>
            </section>
          ) : null}

          {hasSavedCards && densityMode === 'detailed' ? (
            <section className={listStyles.savedSection}>
              <div className={listStyles.savedHeader}>
                <div>
                  <h2 className={listStyles.savedTitle}>Saved from community</h2>
                  <p className={listStyles.savedCopy}>Cards you kept without regenerating.</p>
                </div>
                <PendingLink href="/community?saved=1" className={listStyles.savedLink}>
                  View saved feed
                </PendingLink>
              </div>

              <div className={listStyles.savedGrid}>
                {savedCards.map((card) => (
                  <CommunityCard
                    key={card.card_id}
                    card={card}
                    imageUrl={card.image_url ? savedCardUrls[card.image_url] : undefined}
                    saved
                    reviewHref={`/review?card=${card.card_id}&entry=card`}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {hasSavedCards && densityMode === 'focused' ? (
            <section className={listStyles.savedShortcut}>
              <div>
                <h2 className={listStyles.savedShortcutTitle}>Saved cards</h2>
                <p className={listStyles.savedShortcutCopy}>
                  Cards you kept from the community.
                </p>
              </div>
              <div className={listStyles.savedShortcutActions}>
                {firstSavedCardId ? (
                  <PendingLink href={`/review?card=${firstSavedCardId}&entry=card`} className={styles.accentLink}>
                    Review saved
                  </PendingLink>
                ) : null}
                <PendingLink href="/community?saved=1" className={listStyles.savedShortcutLink}>
                  Open saved
                </PendingLink>
              </div>
            </section>
          ) : null}

          <LibrarySessionList items={sessionItems} />
        </div>
      )}
    </div>
  )
}
