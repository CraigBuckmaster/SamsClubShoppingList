// Shows a price with an up/down indicator if the price has changed

export default function PriceDisplay({ currentPrice, lastPrice, size = 'md', showDelta = true }) {
  const fmt = (n) => n != null ? `$${Number(n).toFixed(2)}` : null

  const hasDelta   = lastPrice != null && currentPrice != null && lastPrice !== currentPrice
  const isDown     = hasDelta && currentPrice < lastPrice
  const isUp       = hasDelta && currentPrice > lastPrice
  const delta      = hasDelta ? Math.abs(currentPrice - lastPrice).toFixed(2) : null

  const sizeClass  = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'
  const monoClass  = `font-mono font-semibold ${sizeClass}`

  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`${monoClass} text-gray-900`}>
        {fmt(currentPrice) ?? '—'}
      </span>

      {showDelta && hasDelta && (
        <span className={`flex items-center gap-0.5 text-xs font-medium ${isDown ? 'text-safe' : 'text-danger'}`}>
          {isDown ? (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          )}
          ${delta}
        </span>
      )}
    </div>
  )
}
