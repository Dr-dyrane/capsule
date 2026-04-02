import Link from 'next/link'
import { Images } from 'lucide-react'

import CardThumbnail from '@/components/cards/CardThumbnail'
import { createSignedObjectUrlsSafe } from '@/lib/storage/signed-urls'
import { createClient } from '@/lib/supabase/server'

import styles from '../AppScreen.module.css'

export default async function CardsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: cards } = await supabase
    .from('cards')
    .select('*')
    .order('created_at', { ascending: false })

  const signedUrls = await createSignedObjectUrlsSafe(
    'cards',
    (cards ?? []).filter((card) => card.status === 'complete').map((card) => card.image_url),
  )

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <Images size={14} aria-hidden="true" />
          <span>Cards</span>
        </div>
        <h1 className={styles.title}>All cards.</h1>
        <p className={styles.copy}>Queued, building, ready.</p>
      </header>

      {!cards || cards.length === 0 ? (
        <div className={styles.panel}>
          <div className={`${styles.panelInner} ${styles.emptyState}`}>
            <p className={styles.emptyTitle}>No cards yet</p>
            <p className={styles.emptyCopy}>Scan a note to start.</p>
            <Link href="/scan" className={styles.accentLink}>
              Scan note
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.list} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {cards.map((card) => (
            <CardThumbnail key={card.id} card={card} imageUrl={signedUrls[card.image_url]} />
          ))}
        </div>
      )}
    </div>
  )
}
