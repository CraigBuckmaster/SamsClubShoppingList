import { useState } from 'react'
import { useMasterList } from '../hooks/useMasterList'
import { useTrip } from '../hooks/useTrip'
import CategoryBadge from '../components/shared/CategoryBadge'
import EmptyState from '../components/shared/EmptyState'

export default function MasterListPage() {
  const { items, loading } = useMasterList()
  const { addItemToTrip } = useTrip()
  const [search, setSearch] = useState('')
  const [addedIds, setAddedIds] = useState(new Set())

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleAdd(item) {
    await addItemToTrip({ itemData: item, qty: 1 })
    setAddedIds(prev => new Set([...prev, item.id]))
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev)
        next.delete(item.id)
        return next
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-lg font-bold text-gray-900 mb-3">My List</h1>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-gray-50"
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title={search ? 'No items match' : 'Your list is empty'}
          subtitle={search ? 'Try a different search' : 'Items you save will appear here for future trips'}
        />
      ) : (
        <div className="divide-y divide-gray-100 bg-white mt-3">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-11 h-11 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <CategoryBadge category={item.category} />
                  {item.unit_price && (
                    <span className="text-xs font-mono text-gray-500">${Number(item.unit_price).toFixed(2)}</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleAdd(item)}
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                  addedIds.has(item.id)
                    ? 'bg-safe text-white'
                    : 'bg-primary-light text-primary'
                }`}
              >
                {addedIds.has(item.id) ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
