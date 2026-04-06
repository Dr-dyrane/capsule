import Link from 'next/link'
import { DatabaseZap } from 'lucide-react'
import { notFound } from 'next/navigation'

import StorageMigrationPanel from '@/components/profile/StorageMigrationPanel'
import { getLegacySeedMigrationStatus } from '@/app/actions/admin'
import { createClient } from '@/lib/supabase/server'
import { isCapsuleAdminEmail, syncCurrentUserDirectory } from '@/lib/billing/entitlements'

import shellStyles from '@/app/(app)/AppScreen.module.css'

export default async function StorageAdminPage() {
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

  const status = await getLegacySeedMigrationStatus()

  return (
    <div className={shellStyles.screen}>
      <header className={shellStyles.header}>
        <div className={shellStyles.eyebrow}>
          <DatabaseZap size={14} aria-hidden="true" />
          <span>Storage</span>
        </div>
        <h1 className={shellStyles.title}>Backfill seeded assets to storage.</h1>
        <p className={shellStyles.copy}>
          Move repo-hosted workshop and legacy seed assets out of the app bundle and into Supabase storage.
        </p>
        <Link href="/profile/admin" className={shellStyles.accentLink}>
          Back to admin
        </Link>
      </header>

      <StorageMigrationPanel initialStatus={status} />
    </div>
  )
}
