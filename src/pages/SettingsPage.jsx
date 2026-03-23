import StoreLayoutSettings from '../components/settings/StoreLayoutSettings'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-lg font-bold text-gray-900">Settings</h1>
      </header>

      <div className="mt-4">
        <div className="px-4 mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Store Layout</p>
        </div>
        <div className="bg-white border-y border-gray-100 py-4">
          <StoreLayoutSettings />
        </div>
      </div>

      <div className="mt-4 px-4">
        <p className="text-xs text-gray-300 text-center">Sam's List · Phase 2 Build</p>
      </div>
    </div>
  )
}
