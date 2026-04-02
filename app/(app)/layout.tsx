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

      <style jsx>{`
        .app-shell {
          display: flex;
          min-height: 100vh;
        }

        .app-main {
          flex: 1;
          padding: var(--space-24);
          padding-bottom: calc(80px + var(--safe-area-inset-bottom, 0px));
        }

        @media (min-width: 768px) {
          .app-main {
            margin-left: 240px;
            padding-bottom: var(--space-24);
          }
        }

        @media (max-width: 767px) {
          .app-main {
            padding: var(--space-16);
            padding-bottom: 96px;
          }
        }
      `}</style>
    </div>
  )
}
