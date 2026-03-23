import { useState, useEffect } from 'react'
import CategoryDropdown from '../shared/CategoryDropdown'

export default function ItemDrawer({ tripItem, onClose, onSave, onRemove }) {
  const item = tripItem?.items || {}
  const [form, setForm] = useState({
    name: '',
    category: 'Other',
    qty: 1,
    unit_price: '',
    notes: '',
  })

  useEffect(() => {
    if (tripItem) {
      setForm({
        name: item.name || '',
        category: item.category || 'Other',
        qty: tripItem.qty || 1,
        unit_price: tripItem.unit_price ?? item.unit_price ?? '',
        notes: item.notes || '',
      })
    }
  }, [tripItem])

  if (!tripItem) return null

  function handleSave() {
    onSave(tripItem.id, {
      qty: Number(form.qty) || 1,
      unit_price: form.unit_price !== '' ? Number(form.unit_price) : null,
      items: {
        name: form.name,
        category: form.category,
        notes: form.notes,
      }
    })
    onClose()
  }

  const fmt = (n) => n != null ? `$${Number(n).toFixed(2)}` : null
  const lineTotal = form.unit_price ? (Number(form.unit_price) * Number(form.qty)).toFixed(2) : null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-5 pb-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-5 pt-2">
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Edit Item</p>
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">{item.name}</h3>
            </div>
            {item.image_url && (
              <img src={item.image_url} alt={item.name} className="w-14 h-14 rounded-xl object-cover ml-3 bg-gray-100" />
            )}
          </div>

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
              <CategoryDropdown value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} />
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
