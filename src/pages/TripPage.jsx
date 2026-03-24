import { useState, useMemo, useEffect, useRef } from 'react'
import { useTrip } from '../hooks/useTrip'
import { useBudget } from '../hooks/useBudget'
import { useCategorySort } from '../context/CategorySortContext'
import { useMasterList } from '../hooks/useMasterList'
import { usePriceFetch } from '../hooks/usePriceFetch'
import BudgetBar from '../components/trip/BudgetBar'
import CategoryGroup from '../components/trip/CategoryGroup'
import AddItemFAB from '../components/trip/AddItemFAB'
import AddItemSheet from '../components/additem/AddItemSheet'
import ItemDrawer from '../components/items/ItemDrawer'
import EmptyState from '../components/shared/EmptyState'

export default function TripPage() {
  const { trip, tripItems, loading, addItemToTrip, toggleChecked, updateTripItem, removeTripItem, updateTrip, reload } = useTrip()
  const { items: masterItems } = useMasterList()
  const budgetData = useBudget(trip, tripItems)
  const { sortCategories } = useCategorySort()
  const { refreshStale, refreshAll } = usePriceFetch()

  const [showAddSheet, setShowAddSheet] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [budgetInput, setBudgetInput] = useState('')
  const [isRefreshingAll, setIsRefreshingAll] = useState(false)
  const [refreshDone, setRefreshDone] = useState(false)
  const autoRefreshedRef = useRef(false)

  useEffect(() => {
    if (!loading && tripItems.length > 0 && !autoRefreshedRef.current) {
      autoRefreshedRef.current = true
      refreshStale(tripItems).then(updated => {
        if (Object.keys(updated).length > 0) reload()
      })
    }
  }, [loading, tripItems.length])

  const groupedItems = useMemo(() => {
    const groups = {}
    tripItems.forEach(item => {
      const cat = item.items?.category || 'Other'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    })
    Object.keys(groups).forEach(cat => {
      groups[cat].sort((a, b) => {
        if (a.checked === b.checked) return 0
        return a.checked ? 1 : -1
      })
    })
    const sortedKeys = sortCategories(Object.keys(groups))
    return sortedKeys.map(cat => ({ category: cat, items: groups[cat] }))
  }, [tripItems, sortCategories])

  async function handleAddItem(itemData, qty) {
    await addItemToTrip({ itemData, qty })
  }

  async function handleSaveEdit(tripItemId, updates) {
    const tripUpdates = {}
    if (updates.qty !== undefined) tripUpdates.qty = updates.qty
    if (updates.unit_price !== undefined) tripUpdates.unit_price = updates.unit_price
    if (Object.keys(tripUpdates).length > 0) {
      await updateTripItem(tripItemId, tripUpdates)
    }
  }

  async function handleRefreshAll() {
    setIsRefreshingAll(true)
    setRefreshDone(false)
    await refreshAll(tripItems)
    await reload()
    setIsRefreshingAll(false)
    setRefreshDone(true)
    setTimeout(() => setRefreshDone(false), 2000)
  }

  async function handleSaveBudget() {
    const val = parseFloat(budgetInput)
    if (!isNaN(val) && val > 0) await updateTrip({ budget: val })
    setShowBudgetEdit(false)
  }

  const itemsWithUrl = tripItems.filter(i => i.items?.sams_url)
  const itemsWithNoPrice = tripItems.filter(i => !i.unit_price && !i.items?.unit_price)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Active Trip</p>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{trip?.name || "Sam's Run"}</h1>
          </div>
          <div className="flex items-center gap-2">
            {itemsWithUrl.length > 0 && (
              <button
                onClick={handleRefreshAll}
                disabled={isRefreshingAll}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${refreshDone ? 'bg-safe/10 text-safe' : 'bg-gray-100 text-gray-600 active:bg-gray-200'} disabled:opacity-60`}
              >
                {isRefreshingAll ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : refreshDone ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                )}
                {isRefreshingAll ? 'Refreshing...' : refreshDone ? 'Updated' : 'Refresh'}
              </button>
            )}
            <button
              onClick={() => { setBudgetInput(trip?.budget || ''); setShowBudgetEdit(true) }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 active:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {trip?.budget ? `$${Number(trip.budget).toFixed(0)} budget` : 'Budget'}
            </button>
          </div>
        </div>
        <BudgetBar budgetData={budgetData} />
      </header>

      {itemsWithNoPrice.length > 0 && (
        <div className="mx-4 mt-3 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
          <span className="text-lg">&#128172;</span>
          <p className="text-xs text-amber-700">
            {itemsWithNoPrice.length} item{itemsWithNoPrice.length > 1 ? 's have' : ' has'} no price - tap to edit
          </p>
        </div>
      )}

      <div className="mt-3">
        {tripItems.length === 0 ? (
          <EmptyState
            icon="&#128722;"
            title="Your trip is empty"
            subtitle="Tap + to search Sam's Club or add from your list"
          />
        ) : (
          groupedItems.map(({ category, items }) => (
            <CategoryGroup
              key={category}
              category={category}
              items={items}
              onToggle={toggleChecked}
              onRemove={removeTripItem}
              onEdit={setEditingItem}
            />
          ))
        )}
        <div className="h-6" />
      </div>

      <AddItemFAB onClick={() => setShowAddSheet(true)} />

      {showAddSheet && (
        <AddItemSheet
          onClose={() => setShowAddSheet(false)}
          onAdd={handleAddItem}
          masterItems={masterItems}
        />
      )}

      {editingItem && (
        <ItemDrawer
          tripItem={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveEdit}
          onRemove={removeTripItem}
        />
      )}

      {showBudgetEdit && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowBudgetEdit(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 px-5 pt-6 pb-10 shadow-2xl">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Set Trip Budget</h3>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
              <input
                type="number"
                value={budgetInput}
                onChange={e => setBudgetInput(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3.5 text-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                autoFocus
              />
            </div>
            <button
              onClick={handleSaveBudget}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold active:bg-primary-dark"
            >
              Save Budget
            </button>
          </div>
        </>
      )}
    </div>
  )
}
