import TabBar from '@/components/navigation/TabBar'
import Sidebar from '@/components/navigation/Sidebar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        {children}
      </main>
      <TabBar />
    </div>
  )
}
