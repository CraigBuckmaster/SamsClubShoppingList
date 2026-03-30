import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import EmptyState from '../components/shared/EmptyState'

export default function HistoryPage() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('trips')
        .select(`*, trip_items(id, qty, unit_price, checked)`)
        .eq('completed', true)
        .order('created_at', { ascending: false })

      setTrips(data || [])
      setLoading(false)
    }
    load()
  }, [])

  function tripTotal(trip) {
    return (trip.trip_items || []).reduce((sum, i) => {
      return sum + (i.unit_price || 0) * (i.qty || 1)
    }, 0)
  }

  function formatDate(ts) {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-lg font-bold text-gray-900">Trip History</h1>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : trips.length === 0 ? (
        <EmptyState
          icon="&#128336;"
          title="No completed trips yet"
          subtitle="Complete your first trip to see it here"
        />
      ) : (
        <div className="mt-3 divide-y divide-gray-100 bg-white">
          {trips.map(trip => {
            const total = tripTotal(trip)
            const itemCount = trip.trip_items?.length || 0
            return (
              <button
                key={trip.id}
                onClick={() => navigate(`/history/${trip.id}`)}
                className="w-full text-left px-4 py-4 active:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{trip.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(trip.created_at)}</p>
                    <p className="text-xs text-gray-400">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-base font-semibold font-mono text-gray-800">
                        ${total.toFixed(2)}
                      </p>
                      {trip.budget && (
                        <p className="text-xs text-gray-400">
                          of ${Number(trip.budget).toFixed(2)} budget
                        </p>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
