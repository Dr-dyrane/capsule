import { Globe } from 'lucide-react'
import {
  fetchCommunityCardsWithUrls,
  getCommunityTemplates,
  getViewerCommunityReactions,
  getViewerCommunityReports,
} from '@/app/actions/community'
import CommunityFeed from '@/components/community/CommunityFeed'
import styles from '../AppScreen.module.css'

export default async function CommunityPage() {
  const { cards, signedUrls } = await fetchCommunityCardsWithUrls(0, 20)
  const templates = await getCommunityTemplates()
  const cardIds = cards.map((card) => card.card_id)
  const [viewerReactions, viewerReports] = await Promise.all([
    getViewerCommunityReactions(cardIds),
    getViewerCommunityReports(cardIds),
  ])

  const initialViewerState = Object.fromEntries(
    cardIds.map((cardId) => [
      cardId,
      {
        liked: viewerReactions[cardId]?.liked ?? false,
        saved: viewerReactions[cardId]?.saved ?? false,
        reported: viewerReports[cardId] ?? false,
      },
    ]),
  )

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <Globe size={14} aria-hidden="true" />
          <span>Community</span>
        </div>
        <h1 className={styles.title}>Shared knowledge.</h1>
        <p className={styles.copy}>Discover visual clinical concepts published by the community.</p>
      </header>

      <CommunityFeed 
        initialCards={cards} 
        initialSignedUrls={signedUrls}
        initialViewerReactions={initialViewerState}
        templates={templates}
      />
    </div>
  )
}
