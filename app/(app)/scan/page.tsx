import { createClient } from '@/lib/supabase/server'
import { getCommunityCardByIdWithUrl } from '@/app/actions/community'

import ScanPageClient from './ScanPageClient'

export default async function ScanPage({
  searchParams,
}: {
  searchParams?: Promise<{ remix?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const initialAutoPublish = Boolean(user?.user_metadata?.preferences?.auto_publish)
  const params = searchParams ? await searchParams : {}
  const remixSource = params?.remix ? await getCommunityCardByIdWithUrl(params.remix) : null

  return <ScanPageClient initialAutoPublish={initialAutoPublish} remixSource={remixSource} />
}
