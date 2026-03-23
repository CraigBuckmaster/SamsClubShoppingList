import { useState } from 'react'

export default function AddToTripModal({ item, onAdd, onClose }) {
  const [qty, setQty] = useState(1)

  if (!item) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 px-5 pt-4 pb-10 shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="flex gap-3 mb-5">
          {item.image_url && (
            <img src={item.image_url} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
            {item.unit_price && (
              <p className="text-sm font-semibold text-primary font-mono mt-1">
                ${Number(item.unit_price).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-500 mb-2">Quantity</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 active:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
              </svg>
            </button>
            <span className="text-xl font-semibold text-gray-800 w-8 text-center">{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 active:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>

        <button
          onClick={() => { onAdd(item, qty); onClose() }}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm active:bg-primary-dark"
        >
          Add to Trip
        </button>
      </div>
    </>
  )
}
