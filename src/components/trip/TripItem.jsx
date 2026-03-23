import { useState } from 'react'

export default function TripItem({ tripItem, onToggle, onRemove, onEdit }) {
  const [swiping, setSwiping] = useState(false)
  const [startX, setStartX] = useState(null)
  const [offsetX, setOffsetX] = useState(0)

  const item = tripItem.items || {}
  const price = tripItem.unit_price ?? item.unit_price
  const qty = tripItem.qty ?? 1
  const lineTotal = price ? price * qty : null
  const checked = tripItem.checked

  const fmt = (n) => n != null ? `$${Number(n).toFixed(2)}` : '—'

  function handleTouchStart(e) {
    setStartX(e.touches[0].clientX)
  }

  function handleTouchMove(e) {
    if (startX === null) return
    const diff = e.touches[0].clientX - startX
    if (diff < 0) setOffsetX(Math.max(diff, -80))
  }

  function handleTouchEnd() {
    if (offsetX < -50) {
      setSwiping(true)
    } else {
      setOffsetX(0)
    }
    setStartX(null)
  }

  function handleDelete() {
    onRemove(tripItem.id)
    setOffsetX(0)
    setSwiping(false)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Delete button revealed by swipe */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-danger flex items-center justify-center">
        <button onClick={handleDelete} className="text-white p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Main row */}
      <div
        className={`flex items-center gap-3 px-4 py-3 bg-white transition-transform ${swiping ? '' : 'duration-200'} ${checked ? 'opacity-50' : ''}`}
        style={{ transform: `translateX(${offsetX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Checkbox */}
        <button
          onClick={() => onToggle(tripItem.id)}
          className="flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all active:scale-90"
          style={{
            borderColor: checked ? '#0067A0' : '#D1D5DB',
            backgroundColor: checked ? '#0067A0' : 'transparent',
          }}
        >
          {checked && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </button>

        {/* Image */}
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100"
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        )}

        {/* Name + qty */}
        <button
          onClick={() => onEdit(tripItem)}
          className="flex-1 min-w-0 text-left"
        >
          <p className={`text-sm font-medium text-gray-800 leading-snug ${checked ? 'line-through text-gray-400' : ''}`}>
            {item.name || 'Unknown item'}
          </p>
          {qty > 1 && (
            <p className="text-xs text-gray-400 mt-0.5">Qty: {qty}</p>
          )}
        </button>

        {/* Price column */}
        <div className="text-right flex-shrink-0">
          {lineTotal != null ? (
            <>
              <p className="text-sm font-semibold font-mono text-gray-800">{fmt(lineTotal)}</p>
              {qty > 1 && (
                <p className="text-xs text-gray-400 font-mono">{fmt(price)} ea</p>
              )}
            </>
          ) : (
            <p className="text-xs text-gray-300 italic">No price</p>
          )}
        </div>
      </div>
    </div>
  )
}
