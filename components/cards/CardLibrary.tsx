'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import Link from 'next/link'

import { getSignedCardUrls } from '@/app/actions/assets'
import type { CardRecord } from '@/lib/types'
import CardThumbnail from './CardThumbnail'
import SearchHeader from './SearchHeader'
import styles from './CardLibrary.module.css'

interface CardLibraryProps {
  initialCards: CardRecord[]
  initialSignedUrls: Record<string, string>
  categories: string[]
}

export default function CardLibrary({ initialCards, initialSignedUrls, categories }: CardLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [visibleCount, setVisibleCount] = useState(12)
  const [signedUrlMap, setSignedUrlMap] = useState<Record<string, string>>(initialSignedUrls)

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
      />

      <div className={styles.content}>
        <div className={`${styles.cardGrid} ${styles[layout]}`}>
          {/* Manual Create Trigger (Rule 14: Clear completion) */}
          <Link href="/scan" className={styles.createTrigger}>
            <div className={styles.plusIcon}>
              <Plus size={24} />
            </div>
            <p className={styles.createLabel}>Scan new note</p>
          </Link>

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
                <CardThumbnail card={card} imageUrl={signedUrlMap[card.image_url]} />
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
