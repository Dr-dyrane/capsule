import { User } from 'lucide-react'
import { isCommunitySchemaError } from '@/lib/community/schema'
import { createPublicClient } from '@/lib/supabase/public'
import { createClient } from '@/lib/supabase/server'
import ProfileClient from '@/components/profile/ProfileClient'

import styles from '../AppScreen.module.css'

export default async function ProfilePage() {
  const supabase = await createClient()
  const publicClient = createPublicClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch real usage stats (Phase 2 Utility)
  const { count } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })

  const [{ count: publishedCount }, { count: savedCount }, reportedQuery] = await Promise.all([
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
    publicClient
      .from('community_index')
      .select('card_id, report_count')
      .eq('published_by', user.id)
      .gt('report_count', 0),
  ])

  if (reportedQuery.error && !isCommunitySchemaError(reportedQuery.error)) {
    throw reportedQuery.error
  }

  const reportedRows = (reportedQuery.data ?? []) as Array<{ report_count: number | null }>
  const reportedCount = reportedRows.reduce((total, row) => total + (row.report_count ?? 0), 0)

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
        reportedCount={reportedCount}
      />
    </div>
  )
}
