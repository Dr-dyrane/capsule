import {
  Activity,
  Bookmark,
  Brain,
  ChartColumn,
  ImagePlus,
  MessageSquareMore,
  Repeat2,
  ShieldAlert,
} from 'lucide-react'

import type { AdminAnalyticsSnapshot } from '@/app/actions/admin'
import styles from '@/app/(app)/profile/ProfilePage.module.css'
import panelStyles from './ProductAnalyticsPanel.module.css'

const EVENT_LABELS: Record<string, string> = {
  clarification_panel_viewed: 'Clarification opened',
  clarification_created: 'Clarification posted',
  clarification_reply_created: 'Reply posted',
  clarification_resolved: 'Clarification resolved',
  clarification_evidence_attached: 'Evidence attached',
  community_card_saved: 'Card saved',
  community_card_remix_started: 'Remix started',
  review_item_scored: 'Review scored',
}

function formatRelativeTime(value: string) {
  const date = new Date(value)
  const deltaSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const absSeconds = Math.abs(deltaSeconds)

  if (absSeconds < 60) {
    return 'now'
  }

  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

  if (absSeconds < 3600) {
    return rtf.format(Math.round(deltaSeconds / 60), 'minute')
  }

  if (absSeconds < 86400) {
    return rtf.format(Math.round(deltaSeconds / 3600), 'hour')
  }

  return rtf.format(Math.round(deltaSeconds / 86400), 'day')
}

function getRecentLabel(eventName: string) {
  return EVENT_LABELS[eventName] ?? eventName.replace(/_/g, ' ')
}

export default function ProductAnalyticsPanel({
  snapshot,
}: {
  snapshot: AdminAnalyticsSnapshot
}) {
  if (!snapshot.supported) {
    return (
      <div className={styles.card}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Signals</h3>
          <div className={styles.settingGroup}>
            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <ChartColumn size={18} />
                <span>Analytics not live yet</span>
              </div>
              <span className={styles.countText}>0</span>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Window</h3>
        <div className={panelStyles.metricGrid}>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <Activity size={18} />
              <span>Events</span>
            </div>
            <span className={styles.countText}>{snapshot.totalEvents}</span>
          </div>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <ChartColumn size={18} />
              <span>Active users</span>
            </div>
            <span className={styles.countText}>{snapshot.activeUsers}</span>
          </div>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <MessageSquareMore size={18} />
              <span>Clarification authors</span>
            </div>
            <span className={styles.countText}>{snapshot.clarificationAuthors}</span>
          </div>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <ShieldAlert size={18} />
              <span>Cards touched</span>
            </div>
            <span className={styles.countText}>{snapshot.cardsTouched}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Clarified follow-on</h3>
        <div className={panelStyles.metricGrid}>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <Bookmark size={18} />
              <span>Saved</span>
            </div>
            <span className={styles.countText}>{snapshot.clarifiedActions.saves}</span>
          </div>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <Repeat2 size={18} />
              <span>Remixed</span>
            </div>
            <span className={styles.countText}>{snapshot.clarifiedActions.remixes}</span>
          </div>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <Brain size={18} />
              <span>Reviewed</span>
            </div>
            <span className={styles.countText}>{snapshot.clarifiedActions.reviews}</span>
          </div>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <ShieldAlert size={18} />
              <span>Unresolved correction actions</span>
            </div>
            <span className={styles.countText}>{snapshot.unresolvedCorrectionFollowOnCount}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Event counts</h3>
        <div className={styles.settingGroup}>
          {snapshot.eventCounts.map((item) => (
            <div key={item.eventName} className={styles.settingItem}>
              <div className={styles.settingLabel}>
                {item.eventName === 'clarification_evidence_attached' ? <ImagePlus size={18} /> : <ChartColumn size={18} />}
                <span>{EVENT_LABELS[item.eventName]}</span>
              </div>
              <span className={styles.countText}>{item.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Recent</h3>
        <div className={panelStyles.recentList}>
          {snapshot.recentEvents.length === 0 ? (
            <p className={styles.helperText}>No events in the last {snapshot.windowDays} days.</p>
          ) : (
            snapshot.recentEvents.map((event) => (
              <div key={event.id} className={panelStyles.recentItem}>
                <div className={panelStyles.recentMain}>
                  <span className={panelStyles.recentTitle}>{getRecentLabel(event.eventName)}</span>
                  {event.detail ? <span className={panelStyles.recentDetail}>{event.detail}</span> : null}
                </div>
                <div className={panelStyles.recentMeta}>
                  <span className={styles.countText}>{formatRelativeTime(event.createdAt)}</span>
                  {event.cardId ? (
                    <span className={panelStyles.recentCard}>#{event.cardId.slice(0, 8)}</span>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
