import Image from 'next/image'
import Link from 'next/link'
import { Archive, ChevronRight } from 'lucide-react'

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

  const { data: sessions } = await supabase.from('sessions').select('*').order('created_at', { ascending: false })

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

      {Object.keys(groups).length === 0 ? (
        <div className={styles.panel}>
          <div className={`${styles.panelInner} ${styles.emptyState}`}>
            <p className={styles.emptyTitle}>Your library is empty</p>
            <p className={styles.emptyCopy}>Sessions will appear here.</p>
            <Link href="/scan" className={styles.accentLink}>
              Scan note
            </Link>
          </div>
        </div>
      ) : (
        <div className={listStyles.sections}>
          {Object.entries(groups).map(([date, items]) => (
            <section key={date} className={listStyles.group}>
              <h2 className={listStyles.date}>{date}</h2>
              <div className={listStyles.list}>
                {items.map((session) => (
                  <Link key={session.id} href={`/scan/${session.id}`} className={listStyles.item}>
                    <div className={listStyles.thumb}>
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
                    <div className={listStyles.info}>
                      <p className={listStyles.name}>Note session</p>
                      <p className={listStyles.meta}>
                        {session.card_count} cards <span aria-hidden="true">&middot;</span> {session.status}
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
