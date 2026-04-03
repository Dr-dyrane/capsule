import { redirect } from 'next/navigation'

import { getCommunityCardByIdWithUrl } from '@/app/actions/community'
import ProcessingView from '@/components/scan/ProcessingView'
import { createSignedObjectUrlSafe } from '@/lib/storage/signed-urls'
import { createClient } from '@/lib/supabase/server'

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: session } = await supabase
    .from('sessions')
    .select('id, source_url, remix_source_card_id')
    .eq('id', id)
    .single()

  if (!session) {
    redirect('/library')
  }

  const sourceImageUrl = session.source_url
    ? await createSignedObjectUrlSafe('notes', session.source_url)
    : null

  const remixSource = session.remix_source_card_id
    ? await getCommunityCardByIdWithUrl(session.remix_source_card_id)
    : null

  return <ProcessingView sessionId={id} sourceImageUrl={sourceImageUrl} remixSource={remixSource} />
}
