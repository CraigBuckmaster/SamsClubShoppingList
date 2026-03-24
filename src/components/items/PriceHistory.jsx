import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function PriceHistory({ itemId }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!itemId) return

    async function load() {
      const { data } = await supabase
        .from('price_history')
        .select('price, fetched_at')
        .eq('item_id', itemId)
        .order('fetched_at', { ascending: false })
        .limit(5)

      setHistory(data || [])
      setLoading(false)
    }
    load()
  }, [itemId])

  if (loading) {
    return (
      <div className="space-y-1.5 animate-pulse">
        {[1,2,3].map(i => (
          <div key={i} className="h-4 bg-gray-100 rounded w-full" />
        ))}
      </div>
    )
  }

  if (history.length === 0) {
    return <p className="text-xs text-gray-300 italic">No price history yet</p>
  }

  function formatDate(ts) {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  return (
    <div className="space-y-1">
      {history.map((entry, i) => {
        const prev       = history[i + 1]
        const isDown     = prev && entry.price < prev.price
        const isUp       = prev && entry.price > prev.price
        return (
          <div key={entry.fetched_at} className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{formatDate(entry.fetched_at)}</span>
            <div className="flex items-center gap-1">
              {isDown && (
                <svg className="w-3 h-3 text-safe" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              )}
              {isUp && (
                <svg className="w-3 h-3 text-danger" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              )}
              <span className={`text-xs font-mono font-semibold ${
                isDown ? 'text-safe' : isUp ? 'text-danger' : 'text-gray-600'
              }`}>
                ${Number(entry.price).toFixed(2)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
