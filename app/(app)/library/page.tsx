import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false })

  const groups: Record<string, any[]> = {}
  sessions?.forEach(session => {
    const date = new Date(session.created_at).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
    if (!groups[date]) groups[date] = []
    groups[date].push(session)
  })

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header">
        <h1 className="title-large">Library</h1>
        <p className="subhead">History of your notes and generations.</p>
      </header>

      {Object.keys(groups).length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <p className="title-2">Your library is empty</p>
          <Link href="/scan" className="accent-link">Scan your first note</Link>
        </div>
      ) : (
        <div className="library-sections">
          {Object.entries(groups).map(([date, items]) => (
            <section key={date} className="date-group">
              <h2 className="date-title caption">{date}</h2>
              <div className="session-list">
                {items.map((session) => (
                  <Link key={session.id} href={`/scan/${session.id}`} className="session-item surface-1 glass">
                    <div className="session-thumb">
                      <img src={supabase.storage.from('notes').getPublicUrl(session.source_url).data.publicUrl} alt="Note" />
                    </div>
                    <div className="session-info">
                      <p className="body session-name">Note Session</p>
                      <p className="caption">{session.card_count} cards • {session.status}</p>
                    </div>
                    <ChevronRight size={20} className="chevron" />
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
