import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function OfflineBanner() {
  const online = useOnlineStatus()

  if (online) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gray-800 text-white text-center py-2 px-4 text-xs font-medium">
      <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse" />
      You're offline — changes will sync when you reconnect
    </div>
  )
}
