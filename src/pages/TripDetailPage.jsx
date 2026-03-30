import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCategorySort } from '../context/CategorySortContext'
import CategoryBadge from '../components/shared/CategoryBadge'
import EmptyState from '../components/shared/EmptyState'

export default function TripDetailPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { sortCategories } = useCategorySort()

  const [trip, setTrip] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [reordering, setReordering] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: tripData } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single()

      const { data: tripItems } = await supabase
        .from('trip_items')
        .select(`
          *,
          items (id, name, category, image_url, unit_price, sams_url, sams_product_id)
        `)
        .eq('trip_id', tripId)
        .order('added_at', { ascending: true })

      setTrip(tripData)
      setItems(tripItems || [])
      setLoading(false)
    }
    load()
  }, [tripId])

  const groupedItems = useMemo(() => {
    const groups = {}
    items.forEach(item => {
      const cat = item.items?.category || 'Other'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    })
    const sortedKeys = sortCategories(Object.keys(groups))
    return sortedKeys.map(cat => ({ category: cat, items: groups[cat] }))
  }, [items, sortCategories])

  const grandTotal = items.reduce((sum, i) => {
    const price = i.unit_price ?? i.items?.unit_price ?? 0
    const qty = i.qty ?? 1
    return sum + price * qty
  }, 0)

  async function handleReorder() {
    setReordering(true)
    try {
      // Get or create an active (non-completed) trip
      let { data: activeTrips } = await supabase
        .from('trips')
        .select('id')
        .eq('completed', false)
        .order('created_at', { ascending: false })
        .limit(1)

      let activeTripId = activeTrips?.[0]?.id

      if (!activeTripId) {
        const { data: newTrip } = await supabase
          .from('trips')
          .insert({ name: "Sam's Run" })
          .select()
          .single()
        activeTripId = newTrip.id
      }

      // Get existing items in active trip to avoid duplicates
      const { data: existingItems } = await supabase
        .from('trip_items')
        .select('item_id')
        .eq('trip_id', activeTripId)

      const existingIds = new Set((existingItems || []).map(i => i.item_id))

      // Add each item from this trip that isn't already in the active trip
      const toAdd = items.filter(i => i.items?.id && !existingIds.has(i.items.id))

      if (toAdd.length > 0) {
        const inserts = toAdd.map(i => ({
          trip_id: activeTripId,
          item_id: i.items.id,
          qty: i.qty || 1,
          unit_price: i.items.unit_price ?? i.unit_price ?? null,
          checked: false,
        }))

        await supabase.from('trip_items').insert(inserts)
      }

      navigate('/')
    } catch (err) {
      console.error('Error reordering:', err)
    } finally {
      setReordering(false)
    }
  }

  function formatDate(ts) {
    return new Date(ts).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!trip) {
    return (
      <EmptyState
        icon="&#128533;"
        title="Trip not found"
        subtitle="This trip may have been deleted"
        action={{ label: 'Go Back', onClick: () => navigate('/history') }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate('/history')}
            className="p-1.5 -ml-1.5 rounded-lg active:bg-gray-100"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 leading-tight truncate">{trip.name}</h1>
            <p className="text-xs text-gray-400">{formatDate(trip.created_at)}</p>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold font-mono text-gray-800">
              ${grandTotal.toFixed(2)}
            </p>
            {trip.budget && (
              <p className="text-xs text-gray-400">
                of ${Number(trip.budget).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Re-order button */}
      <div className="px-4 mt-3">
        <button
          onClick={handleReorder}
          disabled={reordering || items.length === 0}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white text-sm font-semibold active:bg-primary-dark disabled:opacity-60"
        >
          {reordering ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          )}
          {reordering ? 'Adding to Trip...' : 'Re-order All Items'}
        </button>
      </div>

      {/* Items by category */}
      <div className="mt-3">
        {items.length === 0 ? (
          <EmptyState
            icon="&#128230;"
            title="No items in this trip"
            subtitle="This trip was completed with no items"
          />
        ) : (
          groupedItems.map(({ category, items: catItems }) => (
            <div key={category} className="mb-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border-y border-gray-100">
                <CategoryBadge category={category} />
                <span className="text-xs text-gray-400">
                  {catItems.length} item{catItems.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="bg-white divide-y divide-gray-50">
                {catItems.map(ti => {
                  const item = ti.items || {}
                  const price = ti.unit_price ?? item.unit_price ?? 0
                  const qty = ti.qty ?? 1
                  const lineTotal = price * qty
                  return (
                    <div key={ti.id} className="flex items-center px-4 py-3 gap-3">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-300 text-lg">&#128722;</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          {qty > 1 ? `${qty} × ` : ''}${price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold font-mono text-gray-700">
                        ${lineTotal.toFixed(2)}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="h-6" />
    </div>
  )
}
