import { redirect } from 'next/navigation'

import ProcessingView from '@/components/scan/ProcessingView'
import { createSignedObjectUrlSafe } from '@/lib/storage/signed-urls'
import { createClient } from '@/lib/supabase/server'

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: session } = await supabase
    .from('sessions')
    .select('id, source_url')
    .eq('id', id)
    .single()

  if (!session) {
    redirect('/library')
  }

  const sourceImageUrl = session.source_url
    ? await createSignedObjectUrlSafe('notes', session.source_url)
    : null

  return <ProcessingView sessionId={id} sourceImageUrl={sourceImageUrl} />
}
