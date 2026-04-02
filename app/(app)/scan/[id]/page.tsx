import ProcessingView from '@/components/scan/ProcessingView'

export default async function SessionPage({ params }: { params: { id: string } }) {
  const id = (await params).id
  
  return (
    <div className="page-container">
      <ProcessingView sessionId={id} />
    </div>
  )
}
