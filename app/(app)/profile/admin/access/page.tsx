import Link from 'next/link'
import { BadgeDollarSign } from 'lucide-react'
import { notFound } from 'next/navigation'

import EntitlementGrantPanel from '@/components/profile/EntitlementGrantPanel'
import { getAccessAdminSnapshot } from '@/app/actions/admin'
import { createClient } from '@/lib/supabase/server'
import { isCapsuleAdminEmail, syncCurrentUserDirectory } from '@/lib/billing/entitlements'

import shellStyles from '@/app/(app)/AppScreen.module.css'

export default async function AccessAdminPage() {
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

  const snapshot = await getAccessAdminSnapshot()

  return (
    <div className={shellStyles.screen}>
      <header className={shellStyles.header}>
        <div className={shellStyles.eyebrow}>
          <BadgeDollarSign size={14} aria-hidden="true" />
          <span>Access</span>
        </div>
        <h1 className={shellStyles.title}>Grant generation.</h1>
        <p className={shellStyles.copy}>Manual balances for paid, sponsored, or premium users.</p>
        <Link href="/profile/admin" className={shellStyles.accentLink}>
          Back to admin
        </Link>
      </header>

      <EntitlementGrantPanel
        initialTarget={snapshot.target}
        initialEntitlement={snapshot.entitlement}
        recentGrants={snapshot.grants}
      />
    </div>
  )
}
