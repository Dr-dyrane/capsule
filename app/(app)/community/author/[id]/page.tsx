import { notFound } from 'next/navigation'
import { User } from 'lucide-react'

import {
  fetchCommunityCardsWithUrls,
  getCommunityAuthorSummary,
  getCommunityFilters,
  getCommunityLibraryCount,
  getCommunityLibrariesWithUrls,
  getViewerCommunityLibraryReactions,
  getViewerCommunityLibraryReports,
  getViewerCommunityReactions,
  getViewerCommunityReports,
} from '@/app/actions/community'
import CommunityBrowser from '@/components/community/CommunityBrowser'
import { createClient } from '@/lib/supabase/server'
import { getUiDensity } from '@/lib/ui/density'
import styles from '../../../AppScreen.module.css'

export default async function CommunityAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const densityMode = getUiDensity(user)
  const author = await getCommunityAuthorSummary(id)

  if (!author) {
    notFound()
  }

  const [{ cards, signedUrls }, { libraries, signedUrls: libraryUrls }, totalLibraryCount] = await Promise.all([
    fetchCommunityCardsWithUrls(0, 20, {
      authorId: id,
      sort: 'recent',
    }),
    getCommunityLibrariesWithUrls(24, id),
    getCommunityLibraryCount(id),
  ])
  const filterMeta = await getCommunityFilters()
  const cardIds = cards.map((card) => card.card_id)
  const libraryIds = libraries.map((library) => library.session_id)
  const [viewerReactions, viewerReports, libraryViewerReactions, libraryViewerReports] = await Promise.all([
    getViewerCommunityReactions(cardIds),
    getViewerCommunityReports(cardIds),
    getViewerCommunityLibraryReactions(libraryIds),
    getViewerCommunityLibraryReports(libraryIds),
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

  const initialLibraryViewerState = Object.fromEntries(
    libraryIds.map((sessionId) => [
      sessionId,
      {
        liked: libraryViewerReactions[sessionId]?.liked ?? false,
        saved: libraryViewerReactions[sessionId]?.saved ?? false,
        reported: libraryViewerReports[sessionId] ?? false,
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

      <CommunityBrowser
        initialCards={cards}
        initialSignedUrls={signedUrls}
        initialViewerReactions={initialViewerState}
        totalCardCount={author.cardCount}
        totalLibraryCount={totalLibraryCount}
        filterMeta={filterMeta}
        initialFilters={{ sort: 'recent', view: 'cards' }}
        libraries={libraries}
        libraryUrls={libraryUrls}
        initialLibraryViewerState={initialLibraryViewerState}
        densityMode={densityMode}
        lockedAuthor={{ id, name: author.username }}
      />
    </div>
  )
}
