import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import type { SessionRecord } from '@/lib/types'
import { createSignedObjectUrls } from '@/lib/storage/signed-urls'

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false })

  const signedNoteUrls = await createSignedObjectUrls(
    'notes',
    (sessions ?? []).map((session) => session.source_url),
  )

  const groups: Record<string, SessionRecord[]> = {}
  sessions?.forEach((session) => {
    const typedSession = session as SessionRecord
    const date = new Date(session.created_at).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
    if (!groups[date]) groups[date] = []
    groups[date].push(typedSession)
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
                      <Image
                        src={signedNoteUrls[session.source_url]}
                        alt="Uploaded note"
                        fill
                        unoptimized
                        sizes="50px"
                      />
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
