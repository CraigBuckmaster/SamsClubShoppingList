import BottomNav from './BottomNav'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
