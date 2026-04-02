import ProcessingView from '@/components/scan/ProcessingView'

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <ProcessingView sessionId={id} />
}
