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

      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .page-header {
          margin-bottom: var(--space-40);
        }
        
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: var(--space-24);
        }

        .empty-state {
          text-align: center;
          padding: var(--space-64) 0;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: var(--space-16);
          opacity: 0.5;
        }
        
        @media (max-width: 600px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-12);
          }
        }
      `}</style>
    </div>
  )
}
