import { User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ProfileClient from '@/components/profile/ProfileClient'

import styles from '../AppScreen.module.css'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch real usage stats (Phase 2 Utility)
  const { count } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })

  const [{ count: publishedCount }, { count: savedCount }] = await Promise.all([
    supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('visibility', 'published')
      .eq('published_by', user.id),
    supabase
      .from('community_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('kind', 'save'),
  ])

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <User size={14} aria-hidden="true" />
          <span>Profile</span>
        </div>
        <h1 className={styles.title}>Account.</h1>
        <p className={styles.copy}>Clinical identity & generation controls.</p>
      </header>

      <ProfileClient
        user={user}
        cardCount={count || 0}
        publishedCount={publishedCount || 0}
        savedCount={savedCount || 0}
      />
    </div>
  )
}
