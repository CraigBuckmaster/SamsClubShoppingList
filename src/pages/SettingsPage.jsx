import StoreLayoutSettings from '../components/settings/StoreLayoutSettings'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

export default function SettingsPage() {
  const { isInstallable, promptInstall } = useInstallPrompt()

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

      {isInstallable && (
        <div className="mt-4">
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">App</p>
          </div>
          <div className="bg-white border-y border-gray-100 px-4 py-4">
            <button
              onClick={promptInstall}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-primary text-white font-semibold text-sm active:bg-primary-dark"
            >
              <span>Install Sam's List</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
              </svg>
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Add to your home screen for quick access
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 px-4">
        <p className="text-xs text-gray-300 text-center">Sam's List · Phase 3 Build</p>
      </div>
    </div>
  )
}
