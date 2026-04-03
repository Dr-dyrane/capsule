'use client'

import Link from 'next/link'
import { useCallback, useDeferredValue, useEffect, useRef, useState } from 'react'
import { Globe, Loader2, Search, TrendingUp, X, LayoutGrid, List } from 'lucide-react'

import {
  fetchCommunityCardsWithUrls,
  getViewerCommunityReactions,
  getViewerCommunityReports,
  reportCommunityCard,
  toggleCommunityReaction,
  type CommunityCardRecord,
} from '@/app/actions/community'
import type { CommunityReactionKind, CommunitySort, CommunityViewerState } from '@/lib/types'
import CommunityCard from '@/components/cards/CommunityCard'
import styles from './CommunityFeed.module.css'

interface CommunityFeedProps {
  initialCards: CommunityCardRecord[]
  initialSignedUrls: Record<string, string>
  initialViewerReactions: Record<string, CommunityViewerState>
  templates: string[]
}

export default function CommunityFeed({
  initialCards,
  initialSignedUrls,
  initialViewerReactions,
  templates,
}: CommunityFeedProps) {
  const [cards, setCards] = useState<CommunityCardRecord[]>(initialCards)
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>(initialSignedUrls)
  const [viewerReactions, setViewerReactions] = useState<Record<string, CommunityViewerState>>(initialViewerReactions)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(initialCards.length === 20)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [sort, setSort] = useState<CommunitySort>('recent')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [savedOnly, setSavedOnly] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const hydratedRef = useRef(false)
  const deferredSearch = useDeferredValue(searchQuery)

  const mergeViewerState = useCallback(async (cardIds: string[]) => {
    const ids = [...new Set(cardIds.filter(Boolean))]
    if (ids.length === 0) return

    try {
      const [nextReactions, nextReports] = await Promise.all([
        getViewerCommunityReactions(ids),
        getViewerCommunityReports(ids),
      ])
      setViewerReactions((current) => ({
        ...current,
        ...Object.fromEntries(
          ids.map((id) => [
            id,
            {
              liked: nextReactions[id]?.liked ?? current[id]?.liked ?? false,
              saved: nextReactions[id]?.saved ?? current[id]?.saved ?? false,
              reported: nextReports[id] ?? current[id]?.reported ?? false,
            },
          ]),
        ),
      }))
    } catch (error) {
      console.error('Failed to load viewer community state', error)
    }
  }, [])

  const loadPage = useCallback(
    async (nextPage: number, mode: 'replace' | 'append') => {
      setIsLoading(true)

      try {
        const normalizedSearch = deferredSearch.trim()
        const { cards: nextCards, signedUrls: nextUrls } = await fetchCommunityCardsWithUrls(nextPage, 20, {
          search: normalizedSearch,
          template: selectedTemplate,
          sort,
          savedOnly,
        })

        const nextIds = nextCards.map((card) => card.card_id)
        await mergeViewerState(nextIds)

        setSignedUrls((current) => (mode === 'append' ? { ...current, ...nextUrls } : nextUrls))
        setHasMore(nextCards.length === 20)
        setPage(nextPage)

        if (mode === 'append') {
          setCards((current) => {
            const seen = new Set(current.map((card) => card.card_id))
            return [...current, ...nextCards.filter((card) => !seen.has(card.card_id))]
          })
        } else {
          setCards(nextCards)
        }
      } catch (error) {
        console.error('Failed to fetch community cards', error)
      } finally {
        setIsLoading(false)
      }
    },
    [deferredSearch, mergeViewerState, selectedTemplate, sort, savedOnly],
  )

  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true
      return
    }

    const timer = window.setTimeout(() => {
      void loadPage(0, 'replace')
    }, 160)

    return () => window.clearTimeout(timer)
  }, [deferredSearch, selectedTemplate, sort, savedOnly, loadPage])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    await loadPage(page + 1, 'append')
  }, [hasMore, isLoading, loadPage, page])

  const lastCardRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return

    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasMore) {
        void loadMore()
      }
    })

    if (node) observerRef.current.observe(node)
  }, [hasMore, isLoading, loadMore])

  async function handleToggleReaction(cardId: string, kind: CommunityReactionKind) {
    const key = kind === 'like' ? 'liked' : 'saved'
    const countKey = kind === 'like' ? 'like_count' : 'save_count'
    const currentState = viewerReactions[cardId] ?? { liked: false, saved: false, reported: false }
    const nextActive = !currentState[key]

    setViewerReactions((current) => ({
      ...current,
      [cardId]: {
        ...currentState,
        [key]: nextActive,
      },
    }))

    setCards((current) =>
      current.map((card) =>
        card.card_id === cardId
          ? {
              ...card,
              [countKey]: Math.max(0, card[countKey] + (nextActive ? 1 : -1)),
            }
          : card,
      ),
    )

    try {
      await toggleCommunityReaction(cardId, kind)
      if (kind === 'save' && savedOnly && !nextActive) {
        setCards((current) => current.filter((card) => card.card_id !== cardId))
      }
    } catch (error) {
      console.error(`Failed to toggle ${kind}`, error)
      setViewerReactions((current) => ({
        ...current,
        [cardId]: currentState,
      }))
      setCards((current) =>
        current.map((card) =>
          card.card_id === cardId
            ? {
                ...card,
                [countKey]: Math.max(0, card[countKey] + (nextActive ? -1 : 1)),
              }
            : card,
        ),
      )
    }
  }

  async function handleReport(cardId: string) {
    const currentState = viewerReactions[cardId] ?? { liked: false, saved: false, reported: false }
    if (currentState.reported) {
      return
    }

    setViewerReactions((current) => ({
      ...current,
      [cardId]: {
        ...currentState,
        reported: true,
      },
    }))

    try {
      await reportCommunityCard(cardId)
    } catch (error) {
      console.error('Failed to report card', error)
      setViewerReactions((current) => ({
        ...current,
        [cardId]: currentState,
      }))
    }
  }

  const showingFilters = Boolean(searchQuery.trim() || selectedTemplate || savedOnly || sort === 'trending')

  if (cards.length === 0) {
    return (
      <div className={styles.feed}>
        <div className={styles.toolbar}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search community cards..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.empty}>
          <Globe size={48} className={styles.emptyIcon} />
          <h2>{showingFilters ? 'No cards match this view' : 'Nothing published yet'}</h2>
          <p>
            {showingFilters
              ? 'Clear the filters or try another search.'
              : 'Be the first to share a clean learning card with the community.'}
          </p>
          <div className={styles.emptyActions}>
            {showingFilters ? (
              <button
                type="button"
                className={styles.resetButton}
                onClick={() => {
                  setSearchQuery('')
                  setSelectedTemplate(null)
                  setSort('recent')
                  setSavedOnly(false)
                }}
              >
                Reset filters
              </button>
            ) : (
              <>
                <Link href="/scan" className={styles.primaryLink}>
                  Scan note
                </Link>
                <Link href="/cards" className={styles.secondaryLink}>
                  Open archive
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.feed}>
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className={styles.searchInput}
          />
          {searchQuery ? (
            <button type="button" onClick={() => setSearchQuery('')} className={styles.clearSearch}>
              <X size={14} />
            </button>
          ) : null}
        </div>

        <div className={styles.controls}>
          <div className={styles.filterRow}>
            <button
              type="button"
              className={`${styles.filterChip} ${selectedTemplate === null ? styles.activeFilter : ''}`}
              onClick={() => setSelectedTemplate(null)}
            >
              All
            </button>
            {templates.slice(0, 5).map((template) => (
              <button
                key={template}
                type="button"
                className={`${styles.filterChip} ${selectedTemplate === template ? styles.activeFilter : ''}`}
                onClick={() => setSelectedTemplate(template)}
              >
                {template.replace(/-/g, ' ')}
              </button>
            ))}
            <button
              type="button"
              className={`${styles.filterChip} ${savedOnly ? styles.activeFilter : ''}`}
              onClick={() => setSavedOnly((current) => !current)}
            >
              Saved
            </button>
          </div>

          <div className={styles.sortRow}>
            <button
              type="button"
              className={`${styles.sortChip} ${sort === 'recent' ? styles.activeSort : ''}`}
              onClick={() => setSort('recent')}
            >
              Recent
            </button>
            <button
              type="button"
              className={`${styles.sortChip} ${sort === 'trending' ? styles.activeSort : ''}`}
              onClick={() => setSort('trending')}
            >
              <TrendingUp size={14} />
              <span>Trending</span>
            </button>
          </div>

          <div className={styles.viewToggles}>
            <button
              type="button"
              className={`${styles.viewBtn} ${layout === 'grid' ? styles.activeView : ''}`}
              onClick={() => setLayout('grid')}
              title="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              className={`${styles.viewBtn} ${layout === 'list' ? styles.activeView : ''}`}
              onClick={() => setLayout('list')}
              title="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className={`${styles.grid} ${layout === 'list' ? styles.list : ''}`}>
        {cards.map((card, index) => {
          const isLast = index === cards.length - 1
          const viewerState = viewerReactions[card.card_id] ?? { liked: false, saved: false, reported: false }

          return (
            <div key={card.card_id} ref={isLast ? lastCardRef : null}>
              <CommunityCard
                card={card}
                imageUrl={card.image_url ? signedUrls[card.image_url] : undefined}
                layout={layout}
                liked={viewerState.liked}
                saved={viewerState.saved}
                reported={viewerState.reported ?? false}
                onToggleLike={() => handleToggleReaction(card.card_id, 'like')}
                onToggleSave={() => handleToggleReaction(card.card_id, 'save')}
                onReport={() => handleReport(card.card_id)}
              />
            </div>
          )
        })}
      </div>

      {isLoading ? (
        <div className={styles.loaderWrap}>
          <Loader2 size={24} className={styles.spinner} />
        </div>
      ) : null}
    </div>
  )
}
