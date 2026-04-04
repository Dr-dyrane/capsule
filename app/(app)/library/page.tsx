import { Archive } from 'lucide-react'

import { getSavedCommunityCardsWithUrls } from '@/app/actions/community'
import CommunityCard from '@/components/cards/CommunityCard'
import PendingLink from '@/components/ui/PendingLink'
import { createSignedObjectUrlsSafe } from '@/lib/storage/signed-urls'
import { createClient } from '@/lib/supabase/server'
import type { SessionRecord } from '@/lib/types'
import { getUiDensity } from '@/lib/ui/density'
import LibrarySessionList from './LibrarySessionList'

import styles from '../AppScreen.module.css'
import listStyles from './LibraryPage.module.css'

function trimTitle(value: string, maxLength = 56) {
  const normalized = value.replace(/\s+/g, ' ').trim()

  if (normalized.length <= maxLength) {
    return normalized
  }

  const truncated = normalized.slice(0, maxLength).trimEnd()
  const safeBreak = truncated.lastIndexOf(' ')

  return `${(safeBreak > 20 ? truncated.slice(0, safeBreak) : truncated).trimEnd()}...`
}

function toDisplayTitle(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (word === word.toUpperCase() && word.length <= 4) {
        return word
      }

      return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
    })
    .join(' ')
}

function getSessionTags(context: string) {
  const normalized = context.toLowerCase()
  const tags: string[] = []

  const addTag = (condition: boolean, tag: string) => {
    if (condition && !tags.includes(tag)) {
      tags.push(tag)
    }
  }

  addTag(normalized.includes('celiac'), 'Celiac')
  addTag(normalized.includes('vaccine') || normalized.includes('vaccination') || normalized.includes('immunization'), 'Vaccines')
  addTag(
    normalized.includes('immune system') ||
      normalized.includes('immunology') ||
      normalized.includes('mhc ') ||
      normalized.includes('natural killer'),
    'Immunology',
  )
  addTag(normalized.includes('autoimmune'), 'Autoimmune')
  addTag(normalized.includes('rheumatoid arthritis'), 'Rheumatoid Arthritis')
  addTag(normalized.includes('psoriasis'), 'Psoriasis')
  addTag(normalized.includes('multiple sclerosis'), 'Multiple Sclerosis')
  addTag(
    normalized.includes('systemic lupus erythematosus') || /\bsle\b/.test(normalized) || normalized.includes(' lupus'),
    'Lupus',
  )
  addTag(
    normalized.includes('therapy') ||
      normalized.includes('treatment') ||
      normalized.includes('treatments') ||
      normalized.includes('management'),
    'Therapy',
  )

  return tags
}

function getSessionDisplayTitle(session: SessionRecord) {
  const context = session.session_context?.replace(/\s+/g, ' ').trim() ?? ''

  if (!context || context.toLowerCase() === 'medical learning session') {
    return session.remix_source_card_id ? 'Remix Draft' : 'Fresh Capture'
  }

  const tags = getSessionTags(context)
  const diseaseTags = tags.filter((tag) =>
    ['Celiac', 'Rheumatoid Arthritis', 'Psoriasis', 'Multiple Sclerosis', 'Lupus'].includes(tag),
  )
  const topicTags = tags.filter((tag) =>
    ['Vaccines', 'Immunology', 'Autoimmune', 'Therapy'].includes(tag),
  )

  if (tags.includes('Autoimmune') && tags.includes('Therapy')) {
    return 'Autoimmune Therapy'
  }

  if (diseaseTags.length > 0 && topicTags.includes('Therapy')) {
    return trimTitle(`${diseaseTags[0]} Therapy`, 34)
  }

  if (diseaseTags.length > 0 && topicTags.length > 0) {
    const secondaryTag = topicTags.find((tag) => tag !== 'Therapy') ?? topicTags[0]
    return trimTitle(`${diseaseTags[0]} + ${secondaryTag}`, 34)
  }

  if (diseaseTags.length >= 2) {
    return trimTitle(`${diseaseTags[0]} + ${diseaseTags[1]}`, 34)
  }

  if (tags.length > 0) {
    return trimTitle(tags.slice(0, 2).join(' + '), 34)
  }

  const firstSentence = context.split(/(?<=[.!?])\s+/)[0]?.replace(/[.!?]+$/, '') ?? context
  const cleaned = firstSentence
    .replace(/^(the|this|these)\s+(notes?|document|page|capture)\s+(cover|covers|focus on|focuses on)\s+/i, '')
    .replace(/^(key aspects of|overview of|summary of|high-yield review of)\s+/i, '')
    .replace(/^(including|focusing on)\s+/i, '')
    .replace(/\b(and|their|specific details about|drug regimens|management strategies|administration)\b/gi, ' ')

  return trimTitle(toDisplayTitle(cleaned), 34)
}

export default async function LibraryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const densityMode = getUiDensity(user)

  const [{ data: sessions }, { cards: savedCards, signedUrls: savedCardUrls }] = await Promise.all([
    supabase.from('sessions').select('*').order('created_at', { ascending: false }),
    getSavedCommunityCardsWithUrls(12),
  ])

  const signedNoteUrls = await createSignedObjectUrlsSafe(
    'notes',
    (sessions ?? []).map((session) => session.source_url),
  )

  const sessionItems = (sessions ?? []).map((session) => {
    const typedSession = session as SessionRecord

    return {
      session: typedSession,
      title: getSessionDisplayTitle(typedSession),
      dateLabel: new Date(session.created_at).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
      imageUrl: signedNoteUrls[session.source_url],
    }
  })

  const hasSessions = sessionItems.length > 0
  const hasSavedCards = savedCards.length > 0

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <Archive size={14} aria-hidden="true" />
          <span>Library</span>
        </div>
        <h1 className={styles.title}>Past sessions.</h1>
        <p className={styles.copy}>{densityMode === 'focused' ? 'Pick up where you left off.' : 'Open any capture.'}</p>
      </header>

      {!hasSessions && !hasSavedCards ? (
        <div className={styles.panel}>
          <div className={`${styles.panelInner} ${styles.emptyState}`}>
            <p className={styles.emptyTitle}>Your library is empty</p>
            <p className={styles.emptyCopy}>Generate your first card or explore what the community has already shared.</p>
            <div className={listStyles.emptyActions}>
              <PendingLink href="/community" className={styles.accentLink}>
                Explore community
              </PendingLink>
              <PendingLink href="/scan" className={listStyles.secondaryLink}>
                Scan note
              </PendingLink>
            </div>
          </div>
        </div>
      ) : (
        <div className={listStyles.sections}>
          {hasSavedCards && densityMode === 'detailed' ? (
            <section className={listStyles.savedSection}>
              <div className={listStyles.savedHeader}>
                <div>
                  <h2 className={listStyles.savedTitle}>Saved from community</h2>
                  <p className={listStyles.savedCopy}>Cards you kept without regenerating.</p>
                </div>
                <PendingLink href="/community?saved=1" className={listStyles.savedLink}>
                  View saved feed
                </PendingLink>
              </div>

              <div className={listStyles.savedGrid}>
                {savedCards.map((card) => (
                  <CommunityCard
                    key={card.card_id}
                    card={card}
                    imageUrl={card.image_url ? savedCardUrls[card.image_url] : undefined}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {hasSavedCards && densityMode === 'focused' ? (
            <section className={listStyles.savedShortcut}>
              <div>
                <h2 className={listStyles.savedShortcutTitle}>Saved cards</h2>
                <p className={listStyles.savedShortcutCopy}>
                  Cards you kept from the community.
                </p>
              </div>
              <PendingLink href="/community?saved=1" className={listStyles.savedShortcutLink}>
                Open saved
              </PendingLink>
            </section>
          ) : null}

          <LibrarySessionList items={sessionItems} />
        </div>
      )}
    </div>
  )
}
