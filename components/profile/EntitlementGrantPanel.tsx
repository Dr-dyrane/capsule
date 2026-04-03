'use client'

import { useMemo, useState, useTransition } from 'react'
import { BadgeDollarSign, Loader2, Mail, Sparkles } from 'lucide-react'

import { grantUserAccess } from '@/app/actions/admin'
import type { EntitlementGrantRecord, FundingSource, UserDirectoryRecord, UserEntitlementRecord } from '@/lib/types'
import styles from '@/app/(app)/profile/ProfilePage.module.css'

type GrantPanelProps = {
  initialTarget: UserDirectoryRecord | null
  initialEntitlement: UserEntitlementRecord | null
  recentGrants: EntitlementGrantRecord[]
}

const PLANS = [
  { value: 'student_free', label: 'Student free' },
  { value: 'sponsored', label: 'Sponsored' },
  { value: 'premium_manual', label: 'Premium manual' },
  { value: 'admin', label: 'Admin' },
] as const

const FUNDING = [
  { value: 'manual', label: 'Manual' },
  { value: 'sponsor', label: 'Sponsor' },
  { value: 'donor', label: 'Donor' },
  { value: 'school', label: 'School' },
  { value: 'student_free', label: 'Student free' },
  { value: 'admin', label: 'Admin' },
] as const

export default function EntitlementGrantPanel({
  initialTarget,
  initialEntitlement,
  recentGrants,
}: GrantPanelProps) {
  const [email, setEmail] = useState(initialTarget?.email ?? '')
  const [plan, setPlan] = useState<(typeof PLANS)[number]['value']>(initialEntitlement?.plan ?? 'premium_manual')
  const [fundingSource, setFundingSource] = useState<FundingSource>(initialEntitlement?.funding_source ?? 'manual')
  const [supportRenders, setSupportRenders] = useState('20')
  const [premiumRenders, setPremiumRenders] = useState('5')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [liveEntitlement, setLiveEntitlement] = useState(initialEntitlement)
  const [isPending, startTransition] = useTransition()

  const latestGrant = useMemo(() => recentGrants[0] ?? null, [recentGrants])

  function handleSubmit() {
    setMessage(null)
    startTransition(async () => {
      try {
        const result = await grantUserAccess({
          email,
          plan,
          fundingSource,
          supportRenders: Number.parseInt(supportRenders || '0', 10),
          premiumRenders: Number.parseInt(premiumRenders || '0', 10),
          notes,
        })

        setLiveEntitlement(
          result
            ? {
                user_id: result.user_id,
                plan: result.plan,
                funding_source: result.funding_source,
                hero_auto_per_note: 1,
                support_renders_remaining: result.support_renders_remaining,
                premium_renders_remaining: result.premium_renders_remaining,
                community_reuse_unlimited: true,
                can_publish: true,
                can_high_quality: result.can_high_quality,
                expires_at: result.expires_at,
              }
            : null,
        )
        setMessage(`Granted ${result?.email}`)
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Grant failed')
      }
    })
  }

  return (
    <div className={styles.card}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Grant</h3>
        <div className={styles.formGrid}>
          <input
            className={styles.input}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="student@school.edu"
            type="email"
          />

          <div className={styles.inlineGrid}>
            <select className={styles.select} value={plan} onChange={(event) => setPlan(event.target.value as (typeof PLANS)[number]['value'])}>
              {PLANS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              className={styles.select}
              value={fundingSource}
              onChange={(event) => setFundingSource(event.target.value as FundingSource)}
            >
              {FUNDING.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inlineGrid}>
            <input
              className={styles.input}
              inputMode="numeric"
              value={supportRenders}
              onChange={(event) => setSupportRenders(event.target.value)}
              placeholder="Support"
            />
            <input
              className={styles.input}
              inputMode="numeric"
              value={premiumRenders}
              onChange={(event) => setPremiumRenders(event.target.value)}
              placeholder="Premium"
            />
          </div>

          <textarea
            className={styles.textarea}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Paid outside app"
          />

          <button type="button" className={styles.primaryAction} disabled={isPending} onClick={handleSubmit}>
            {isPending ? <Loader2 size={18} className={styles.spinner} /> : <BadgeDollarSign size={18} />}
            <span>{isPending ? 'Granting…' : 'Grant access'}</span>
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Live</h3>
        <div className={styles.settingGroup}>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <Mail size={18} />
              <span>{initialTarget?.display_name || email || 'No user loaded'}</span>
            </div>
            <span className={styles.countText}>{liveEntitlement?.plan?.replace('_', ' ') ?? '—'}</span>
          </div>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <Sparkles size={18} />
              <span>Support</span>
            </div>
            <span className={styles.countText}>{liveEntitlement?.support_renders_remaining ?? 0}</span>
          </div>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <Sparkles size={18} />
              <span>Premium</span>
            </div>
            <span className={styles.countText}>{liveEntitlement?.premium_renders_remaining ?? 0}</span>
          </div>
        </div>
        {message ? <p className={styles.helperText}>{message}</p> : null}
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Recent</h3>
        <div className={styles.settingGroup}>
          {(recentGrants.length > 0 ? recentGrants : latestGrant ? [latestGrant] : []).map((grant) => (
            <div key={grant.id} className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <BadgeDollarSign size={18} />
                <span>{grant.plan?.replace('_', ' ') ?? grant.grant_type}</span>
              </div>
              <span className={styles.countText}>+{grant.support_renders} / +{grant.premium_renders}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
