import { Images } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createSignedObjectUrlsSafe } from '@/lib/storage/signed-urls'
import CardLibrary from '@/components/cards/CardLibrary'
import styles from '../AppScreen.module.css'

export default async function CardsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // 1. Fetch Cards
  const { data: cards } = await supabase
    .from('cards')
    .select('*, points(category)')
    .eq('status', 'complete')
    .order('created_at', { ascending: false })

  // 2. Generate Signed URLs for the initial set
  const completedCards = (cards ?? []).filter(c => c.status === 'complete')
  const signedUrls = await createSignedObjectUrlsSafe(
    'cards',
    completedCards.slice(0, 12).map((card) => card.image_url),
  )

  if (!cards || cards.length === 0) {
    redirect('/community?source=cards')
  }

  // 3. Extract unique categories for filtering
  const categories = Array.from(
    new Set(
      (cards ?? [])
        .map((c) => (Array.isArray(c.points) ? c.points[0]?.category : c.points?.category))
        .filter(Boolean)
    )
  )

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <Images size={14} aria-hidden="true" />
          <span>Library</span>
        </div>
        <h1 className={styles.title}>Visual archive.</h1>
        <p className={styles.copy}>Search, filter, and manage your clinical visual points.</p>
      </header>

      <CardLibrary 
        initialCards={cards ?? []} 
        initialSignedUrls={signedUrls}
        categories={categories as string[]} 
      />
    </div>
  )
}
