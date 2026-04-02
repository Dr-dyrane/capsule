'use client'

import { Search, X, ChevronDown, List, LayoutGrid } from 'lucide-react'
import styles from './CardLibrary.module.css'

interface SearchHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string | null
  setSelectedCategory: (cat: string | null) => void
  layout: 'grid' | 'list'
  setLayout: (layout: 'grid' | 'list') => void
  categories: string[]
}

export default function SearchHeader({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  layout,
  setLayout,
  categories,
}: SearchHeaderProps) {
  return (
    <header className={styles.libraryHeader}>
      <div className={styles.searchBar}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by title or concept..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className={styles.clearSearch}>
            <X size={14} />
          </button>
        )}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterChip} ${!selectedCategory ? styles.activeFilter : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.slice(0, 4).map((cat) => (
            <button
              key={cat}
              className={`${styles.filterChip} ${selectedCategory === cat ? styles.activeFilter : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
          {categories.length > 4 && (
             <div className={styles.moreCategories}>
                <ChevronDown size={14} />
             </div>
          )}
        </div>

        <div className={styles.viewToggles}>
          <button
            className={`${styles.viewBtn} ${layout === 'grid' ? styles.activeView : ''}`}
            onClick={() => setLayout('grid')}
            title="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            className={`${styles.viewBtn} ${layout === 'list' ? styles.activeView : ''}`}
            onClick={() => setLayout('list')}
            title="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
