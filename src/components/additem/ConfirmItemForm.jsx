import { useState } from 'react'
import CategoryDropdown from '../shared/CategoryDropdown'
import { inferCategory } from '../../lib/categories'

export default function ConfirmItemForm({ result, onAdd, onBack }) {
  const [form, setForm] = useState({
    name: result?.name || '',
    category: result?.category ? inferCategory(result.category) : 'Other',
    unit_price: result?.price ?? '',
    qty: 1,
    notes: '',
    is_regular: true,
  })

  const lineTotal = form.unit_price ? (Number(form.unit_price) * Number(form.qty)).toFixed(2) : null

  function handleSubmit() {
    onAdd({
      name: form.name.trim(),
      category: form.category,
      unit_price: form.unit_price !== '' ? Number(form.unit_price) : null,
      sams_url: result?.url || null,
      sams_product_id: result?.id || null,
      image_url: result?.thumbnail || null,
      notes: form.notes.trim() || null,
      is_regular: form.is_regular,
    }, Number(form.qty) || 1)
  }

  return (
    <div className="px-5 pt-4 pb-8">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-gray-400 active:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h3 className="text-base font-semibold text-gray-900">Confirm Item</h3>
      </div>

      {/* Product preview */}
      <div className="flex gap-3 mb-5 p-3 bg-primary-light rounded-xl">
        {result?.thumbnail && (
          <img src={result.thumbnail} alt={result.name} className="w-16 h-16 rounded-lg object-cover bg-white flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">{result?.name}</p>
          {result?.price && (
            <p className="text-lg font-semibold text-primary font-mono mt-1">${Number(result.price).toFixed(2)}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
          <CategoryDropdown value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} />
        </div>

        <div className="grid grid-cols-2 gap-3">
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
              />
            </div>
          </div>
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
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Notes (optional)</label>
          <input
            type="text"
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Brand preference, size..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <label className="flex items-center gap-3 py-1 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_regular}
            onChange={e => setForm(f => ({ ...f, is_regular: e.target.checked }))}
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Save to My List</p>
            <p className="text-xs text-gray-400">Available on future trips</p>
          </div>
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-6 py-3.5 rounded-xl bg-primary text-white text-sm font-semibold active:bg-primary-dark"
      >
        Add to Trip
      </button>
    </div>
  )
}
