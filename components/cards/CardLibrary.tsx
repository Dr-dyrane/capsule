'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckSquare, Globe, Lock, Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { getSignedCardUrls } from '@/app/actions/assets'
import { publishCards, unpublishCards } from '@/app/actions/community'
import type { CardRecord } from '@/lib/types'
import type { UiDensityMode } from '@/lib/ui/density'
import { useFeedback } from '@/components/providers/FeedbackProvider'
import AdaptiveSheet from '@/components/ui/AdaptiveSheet'
import PendingLink from '@/components/ui/PendingLink'
import CardThumbnail from './CardThumbnail'
import SearchHeader from './SearchHeader'
import styles from './CardLibrary.module.css'

interface CardLibraryProps {
  initialCards: CardRecord[]
  initialSignedUrls: Record<string, string>
  categories: string[]
  densityMode: UiDensityMode
}

export default function CardLibrary({
  initialCards,
  initialSignedUrls,
  categories,
  densityMode,
}: CardLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [visibleCount, setVisibleCount] = useState(12)
  const [signedUrlMap, setSignedUrlMap] = useState<Record<string, string>>(initialSignedUrls)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([])
  const [bulkSheetAction, setBulkSheetAction] = useState<'published' | 'private' | null>(null)
  const [isBulkPending, startBulkTransition] = useTransition()
  const { showFeedback } = useFeedback()
  const router = useRouter()
  const isFocused = densityMode === 'focused'

  const filteredCards = useMemo(() => {
    return initialCards.filter((card) => {
      const pointData = Array.isArray(card.points) ? card.points[0] : card.points
      const cardCategory = pointData?.category || ''
      const pointText = pointData?.text || ''

      const matchesSearch =
        !searchQuery ||
        card.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cardCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pointText.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = !selectedCategory || cardCategory === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [initialCards, searchQuery, selectedCategory])

  const visibleCards = filteredCards.slice(0, visibleCount)
  const hasMore = visibleCount < filteredCards.length

  // Synchronize signed URLs for new visible cards
  useEffect(() => {
    const missingPaths = visibleCards
      .filter((c) => c.status === 'complete' && !signedUrlMap[c.image_url])
      .map((c) => c.image_url)

    if (missingPaths.length > 0) {
      void getSignedCardUrls(missingPaths).then((urls) => {
        setSignedUrlMap((prev) => ({ ...prev, ...urls }))
      })
    }
  }, [visibleCards, signedUrlMap])

  function handleLoadMore() {
    setVisibleCount((prev) => prev + 12)
  }

  function toggleSelectionMode() {
    setSelectionMode((current) => {
      if (current) {
        setSelectedCardIds([])
      }
      return !current
    })
  }

  function handleToggleCard(cardId: string) {
    setSelectedCardIds((current) =>
      current.includes(cardId)
        ? current.filter((id) => id !== cardId)
        : [...current, cardId],
    )
  }

  function handleSelectAllVisible() {
    setSelectedCardIds(visibleCards.map((card) => card.id))
  }

  function handleClearSelection() {
    setSelectedCardIds([])
  }

  function handleBulkVisibility(nextVisibility: 'published' | 'private') {
    if (selectedCardIds.length === 0) {
      return
    }

    startBulkTransition(async () => {
      try {
        if (nextVisibility === 'published') {
          await publishCards(selectedCardIds)
        } else {
          await unpublishCards(selectedCardIds)
        }

        router.refresh()
        setSelectedCardIds([])
        setSelectionMode(false)
        setBulkSheetAction(null)
        showFeedback({
          tone: 'success',
          title: nextVisibility === 'published' ? 'Cards published' : 'Cards set to private',
          message: `${selectedCardIds.length} ${selectedCardIds.length === 1 ? 'card is' : 'cards are'} updated.`,
        })
      } catch (error) {
        console.error('Bulk visibility update failed:', error)
        showFeedback({
          tone: 'error',
          title: 'Could not update cards',
          message: 'Try again in a moment.',
        })
      }
    })
  }

  return (
    <div className={styles.libraryRoot}>
      <SearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        layout={layout}
        setLayout={setLayout}
        categories={categories}
        densityMode={densityMode}
      />

      <div className={`${styles.selectionBar} ${isFocused && !selectionMode ? styles.selectionBarQuiet : ''}`}>
        <button className={styles.selectionToggle} onClick={toggleSelectionMode}>
          {selectionMode ? <X size={16} /> : <CheckSquare size={16} />}
          <span>{selectionMode ? 'Done' : isFocused ? 'Manage cards' : 'Select cards'}</span>
        </button>

        {selectionMode ? (
          <div className={styles.selectionActions}>
            <span className={styles.selectionCount}>
              {selectedCardIds.length} selected
            </span>
            <button className={styles.selectionLink} onClick={handleSelectAllVisible}>
              Select visible
            </button>
            <button className={styles.selectionLink} onClick={handleClearSelection}>
              Clear
            </button>
            <button
              className={styles.bulkAction}
              onClick={() => setBulkSheetAction('published')}
              disabled={selectedCardIds.length === 0 || isBulkPending}
            >
              <Globe size={14} />
              <span>Publish selected</span>
            </button>
            <button
              className={styles.bulkActionMuted}
              onClick={() => setBulkSheetAction('private')}
              disabled={selectedCardIds.length === 0 || isBulkPending}
            >
              <Lock size={14} />
              <span>Unpublish selected</span>
            </button>
          </div>
        ) : !isFocused ? (
          <p className={styles.selectionHint}>Select a group to publish or make private.</p>
        ) : null}
      </div>

      <AdaptiveSheet
        open={Boolean(bulkSheetAction)}
        onClose={() => {
          if (!isBulkPending) {
            setBulkSheetAction(null)
          }
        }}
        title={bulkSheetAction === 'published' ? 'Publish selected cards?' : 'Move selected cards to private?'}
        description={
          bulkSheetAction === 'published'
            ? 'The selected cards will show up in community.'
            : 'The selected cards will stay visible only to you.'
        }
        eyebrow={
          bulkSheetAction ? (
            <>
              {bulkSheetAction === 'published' ? <Globe size={14} /> : <Lock size={14} />}
              <span>{bulkSheetAction === 'published' ? 'Community' : 'Private archive'}</span>
            </>
          ) : null
        }
        size="compact"
        closeLabel="Close bulk visibility dialog"
        footer={
          <>
            <button
              type="button"
              className={styles.sheetSecondaryAction}
              onClick={() => setBulkSheetAction(null)}
              disabled={isBulkPending}
            >
              Cancel
            </button>
            <button
              type="button"
              className={bulkSheetAction === 'published' ? styles.sheetPrimaryAction : styles.sheetMutedAction}
              onClick={() => {
                if (bulkSheetAction) {
                  handleBulkVisibility(bulkSheetAction)
                }
              }}
              disabled={isBulkPending}
            >
              {isBulkPending
                ? 'Saving...'
                : bulkSheetAction === 'published'
                  ? 'Publish cards'
                  : 'Keep private'}
            </button>
          </>
        }
      >
        <div className={styles.bulkSheetMeta}>
          <p className={styles.bulkSheetLead}>
            {selectedCardIds.length} {selectedCardIds.length === 1 ? 'card' : 'cards'} selected
          </p>
          <p className={styles.bulkSheetCopy}>
            {bulkSheetAction === 'published'
              ? 'Only these cards will go live.'
              : 'You can publish them again any time.'}
          </p>
        </div>
        <div className={styles.bulkSheetLedger}>
          <div className={styles.bulkSheetChip}>Selected {selectedCardIds.length}</div>
          <div className={styles.bulkSheetChip}>
            {bulkSheetAction === 'published' ? 'Next state Live' : 'Next state Private'}
          </div>
        </div>
      </AdaptiveSheet>

      <div className={styles.content}>
        <div className={`${styles.cardGrid} ${styles[layout]}`}>
          {/* Manual Create Trigger (Rule 14: Clear completion) */}
          <PendingLink href="/scan" className={styles.createTrigger}>
            <div className={styles.plusIcon}>
              <Plus size={24} />
            </div>
            <p className={styles.createLabel}>Scan new note</p>
          </PendingLink>

          <AnimatePresence mode="popLayout">
            {visibleCards.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <CardThumbnail
                  card={card}
                  imageUrl={signedUrlMap[card.image_url]}
                  selectionMode={selectionMode}
                  selected={selectedCardIds.includes(card.id)}
                  onToggleSelect={handleToggleCard}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {hasMore && (
          <div className={styles.footer}>
            <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
              Load more cards
            </button>
          </div>
        )}

        {filteredCards.length === 0 && (
          <div className={styles.emptyResults}>
            <p>No cards match your search.</p>
            <button onClick={() => setSearchQuery('')} className={styles.resetBtn}>
              Reset search
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
