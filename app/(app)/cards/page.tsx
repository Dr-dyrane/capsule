import { createClient } from '@/lib/supabase/server'
import CardThumbnail from '@/components/cards/CardThumbnail'

export default async function CardsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: cards } = await supabase
    .from('cards')
    .select('*')
    .eq('status', 'complete')
    .order('created_at', { ascending: false })

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header">
        <h1 className="title-large">Cards</h1>
        <p className="subhead">Your collection of medical knowledge.</p>
      </header>

      {!cards || cards.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗂️</div>
          <p className="title-2">No cards yet</p>
          <p className="subhead">Scan your first note to generate cards.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {cards.map((card) => (
            <CardThumbnail key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  )
}
