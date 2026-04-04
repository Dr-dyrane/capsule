import Link from 'next/link'
import { ChartColumn } from 'lucide-react'
import { notFound } from 'next/navigation'

import ProductAnalyticsPanel from '@/components/profile/ProductAnalyticsPanel'
import { getProductAnalyticsSnapshot } from '@/app/actions/admin'
import { createClient } from '@/lib/supabase/server'
import { isCapsuleAdminEmail, syncCurrentUserDirectory } from '@/lib/billing/entitlements'

import shellStyles from '@/app/(app)/AppScreen.module.css'

export default async function AnalyticsAdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  await syncCurrentUserDirectory(supabase, user)

  if (!isCapsuleAdminEmail(user.email)) {
    notFound()
  }

  const snapshot = await getProductAnalyticsSnapshot()

  return (
    <div className={shellStyles.screen}>
      <header className={shellStyles.header}>
        <div className={shellStyles.eyebrow}>
          <ChartColumn size={14} aria-hidden="true" />
          <span>Analytics</span>
        </div>
        <h1 className={shellStyles.title}>Product signals.</h1>
        <p className={shellStyles.copy}>Clarification, save, remix, review.</p>
        <Link href="/profile/admin" className={shellStyles.accentLink}>
          Back to admin
        </Link>
      </header>

      <ProductAnalyticsPanel snapshot={snapshot} />
    </div>
  )
}
