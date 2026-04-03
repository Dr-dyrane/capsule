import { notFound } from 'next/navigation'
import { User } from 'lucide-react'

import {
  fetchCommunityCardsWithUrls,
  getCommunityAuthorSummary,
  getCommunityFilters,
  getViewerCommunityReactions,
  getViewerCommunityReports,
} from '@/app/actions/community'
import CommunityFeed from '@/components/community/CommunityFeed'
import styles from '../../../AppScreen.module.css'

export default async function CommunityAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const author = await getCommunityAuthorSummary(id)

  if (!author) {
    notFound()
  }

  const { cards, signedUrls } = await fetchCommunityCardsWithUrls(0, 20, {
    authorId: id,
    sort: 'recent',
  })
  const filterMeta = await getCommunityFilters()
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
          <User size={14} aria-hidden="true" />
          <span>Author</span>
        </div>
        <h1 className={styles.title}>{author.username}</h1>
        <p className={styles.copy}>
          {author.cardCount} published cards <span aria-hidden="true">&middot;</span> {author.likeCount} likes{' '}
          <span aria-hidden="true">&middot;</span> {author.saveCount} saves
        </p>
      </header>

      <CommunityFeed
        initialCards={cards}
        initialSignedUrls={signedUrls}
        initialViewerReactions={initialViewerState}
        filterMeta={filterMeta}
        initialFilters={{ sort: 'recent' }}
        lockedAuthor={{ id, name: author.username }}
      />
    </div>
  )
}
