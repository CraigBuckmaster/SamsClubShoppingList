import { useState, useEffect } from 'react'
import CategoryDropdown from '../shared/CategoryDropdown'
import PriceDisplay from './PriceDisplay'
import PriceHistory from './PriceHistory'
import { usePriceFetch } from '../../hooks/usePriceFetch'
import { supabase } from '../../lib/supabase'

export default function ItemDrawer({ tripItem, onClose, onSave, onRemove }) {
  const item = tripItem?.items || {}

  const [form, setForm] = useState({
    name:       '',
    category:   'Other',
    qty:        1,
    unit_price: '',
    notes:      '',
    sams_url:   '',
  })
  const [refreshedPrice, setRefreshedPrice] = useState(null)

  const { fetchPrice, isFetching, getError } = usePriceFetch()

  useEffect(() => {
    if (tripItem) {
      setForm({
        name:       item.name       || '',
        category:   item.category   || 'Other',
        qty:        tripItem.qty    || 1,
        unit_price: tripItem.unit_price ?? item.unit_price ?? '',
        notes:      item.notes      || '',
        sams_url:   item.sams_url   || '',
      })
      setRefreshedPrice(null)
    }
  }, [tripItem])

  if (!tripItem) return null

  const displayPrice = refreshedPrice ?? (tripItem.unit_price ?? item.unit_price)
  const isFetchingThis = isFetching(item.id)
  const fetchError     = getError(item.id)

  async function handleRefreshPrice() {
    if (!item.id || !item.sams_url) return
    const newPrice = await fetchPrice(item)
    if (newPrice != null) {
      setRefreshedPrice(newPrice)
      setForm(f => ({ ...f, unit_price: newPrice }))
    }
  }

  async function handleSave() {
    const updates = {
      qty:        Number(form.qty) || 1,
      unit_price: form.unit_price !== '' ? Number(form.unit_price) : null,
    }
    // Also update the item record (name, category, notes, sams_url)
    if (item.id) {
      await supabase.from('items').update({
        name:     form.name.trim(),
        category: form.category,
        notes:    form.notes.trim() || null,
        sams_url: form.sams_url.trim() || null,
      }).eq('id', item.id)
    }
    onSave(tripItem.id, updates)
    onClose()
  }

  const lineTotal = form.unit_price
    ? (Number(form.unit_price) * Number(form.qty)).toFixed(2)
    : null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-5 pb-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-5 pt-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Edit Item</p>
              <h3 className="text-lg font-semibold text-gray-900 leading-tight truncate">
                {item.name}
              </h3>
              {displayPrice != null && (
                <div className="mt-1">
                  <PriceDisplay
                    currentPrice={displayPrice}
                    lastPrice={item.last_price}
                    size="md"
                  />
                </div>
              )}
            </div>
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover ml-3 bg-gray-100 flex-shrink-0"
              />
            )}
          </div>

          {/* Price refresh row */}
          {item.sams_url && (
            <div className="mb-5 p-3 bg-gray-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Live Price</p>
                {fetchError ? (
                  <p className="text-xs text-danger mt-0.5">{fetchError}</p>
                ) : item.price_updated ? (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Updated {new Date(item.price_updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-0.5">Never refreshed</p>
                )}
              </div>
              <button
                onClick={handleRefreshPrice}
                disabled={isFetchingThis}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold active:bg-primary-dark disabled:opacity-60"
              >
                {isFetchingThis ? (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                )}
                {isFetchingThis ? 'Fetching...' : 'Refresh Price'}
              </button>
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Item Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={form.qty}
                  onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Unit Price
                  {lineTotal && <span className="text-primary ml-1">= ${lineTotal}</span>}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.unit_price}
                    onChange={e => setForm(f => ({ ...f, unit_price: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
              <CategoryDropdown
                value={form.category}
                onChange={v => setForm(f => ({ ...f, category: v }))}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={2}
                placeholder="Brand preference, size, substitution..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
            </div>

            {/* Sam's Club URL */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Sam's Club URL
                <span className="text-gray-300 ml-1 font-normal">(enables live price)</span>
              </label>
              <input
                type="url"
                value={form.sams_url}
                onChange={e => setForm(f => ({ ...f, sams_url: e.target.value }))}
                placeholder="https://www.samsclub.com/p/..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            {/* Price History */}
            {item.id && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Price History</p>
                <PriceHistory itemId={item.id} />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => { onRemove(tripItem.id); onClose() }}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-red-200 text-danger text-sm font-medium active:bg-red-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold active:bg-primary-dark"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
