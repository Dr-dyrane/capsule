import Image from 'next/image'
import Link from 'next/link'
import { Archive, ChevronRight } from 'lucide-react'

import { getSavedCommunityCardsWithUrls } from '@/app/actions/community'
import CommunityCard from '@/components/cards/CommunityCard'
import { createSignedObjectUrlsSafe } from '@/lib/storage/signed-urls'
import { createClient } from '@/lib/supabase/server'
import type { SessionRecord } from '@/lib/types'

import styles from '../AppScreen.module.css'
import listStyles from './LibraryPage.module.css'

export default async function LibraryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const [{ data: sessions }, { cards: savedCards, signedUrls: savedCardUrls }] = await Promise.all([
    supabase.from('sessions').select('*').order('created_at', { ascending: false }),
    getSavedCommunityCardsWithUrls(12),
  ])

  const signedNoteUrls = await createSignedObjectUrlsSafe(
    'notes',
    (sessions ?? []).map((session) => session.source_url),
  )

  const groups: Record<string, SessionRecord[]> = {}
  sessions?.forEach((session) => {
    const typedSession = session as SessionRecord
    const date = new Date(session.created_at).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })

    if (!groups[date]) groups[date] = []
    groups[date].push(typedSession)
  })

  const hasSessions = Object.keys(groups).length > 0
  const hasSavedCards = savedCards.length > 0

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <Archive size={14} aria-hidden="true" />
          <span>Library</span>
        </div>
        <h1 className={styles.title}>Past sessions.</h1>
        <p className={styles.copy}>Open any capture.</p>
      </header>

      {!hasSessions && !hasSavedCards ? (
        <div className={styles.panel}>
          <div className={`${styles.panelInner} ${styles.emptyState}`}>
            <p className={styles.emptyTitle}>Your library is empty</p>
            <p className={styles.emptyCopy}>Generate your first card or explore what the community has already shared.</p>
            <div className={listStyles.emptyActions}>
              <Link href="/community" className={styles.accentLink}>
                Explore community
              </Link>
              <Link href="/scan" className={listStyles.secondaryLink}>
                Scan note
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className={listStyles.sections}>
          {hasSavedCards ? (
            <section className={listStyles.savedSection}>
              <div className={listStyles.savedHeader}>
                <div>
                  <h2 className={listStyles.savedTitle}>Saved from community</h2>
                  <p className={listStyles.savedCopy}>Cards you kept without regenerating.</p>
                </div>
                <Link href="/community?saved=1" className={listStyles.savedLink}>
                  View saved feed
                </Link>
              </div>

              <div className={listStyles.savedGrid}>
                {savedCards.map((card) => (
                  <CommunityCard
                    key={card.card_id}
                    card={card}
                    imageUrl={card.image_url ? savedCardUrls[card.image_url] : undefined}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {Object.entries(groups).map(([date, items]) => (
            <section key={date} className={listStyles.group}>
              <h2 className={listStyles.date}>{date}</h2>
              <div className={listStyles.list}>
                {items.map((session) => (
                  <Link key={session.id} href={`/scan/${session.id}`} className={listStyles.item}>
                    <div className={listStyles.thumb}>
                      <div className={listStyles.thumbFrame}>
                        {signedNoteUrls[session.source_url] ? (
                          <Image
                            src={signedNoteUrls[session.source_url]}
                            alt="Uploaded note"
                            fill
                            unoptimized
                            sizes="56px"
                          />
                        ) : (
                          <div className={listStyles.thumbFallback}>Note</div>
                        )}
                      </div>
                      <div className={listStyles.thumbLabel}>Original note</div>
                    </div>
                    <div className={listStyles.info}>
                      <p className={listStyles.name}>Note session</p>
                      <p className={listStyles.meta}>
                        {session.card_count} cards <span aria-hidden="true">&middot;</span> {session.status}
                        {session.remix_source_card_id ? (
                          <>
                            <span aria-hidden="true">&middot;</span> Remix
                          </>
                        ) : null}
                      </p>
                    </div>
                    <ChevronRight size={18} className={listStyles.chevron} />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
