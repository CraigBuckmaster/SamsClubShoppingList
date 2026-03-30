import BottomNav from './BottomNav'
import OfflineBanner from '../OfflineBanner'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <OfflineBanner />
      <main className="pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
