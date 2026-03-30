import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CategorySortProvider } from './context/CategorySortContext'
import AppShell from './components/layout/AppShell'
import TripPage from './pages/TripPage'
import MasterListPage from './pages/MasterListPage'
import HistoryPage from './pages/HistoryPage'
import TripDetailPage from './pages/TripDetailPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CategorySortProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<TripPage />} />
            <Route path="/list" element={<MasterListPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:tripId" element={<TripDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppShell>
      </CategorySortProvider>
    </BrowserRouter>
  )
}
