import { useState } from 'react'
import TripItem from './TripItem'
import { getCategoryColors } from '../../lib/categories'

export default function CategoryGroup({ category, items, onToggle, onRemove, onEdit }) {
  const [collapsed, setCollapsed] = useState(false)
  const colors = getCategoryColors(category)

  const uncheckedCount = items.filter(i => !i.checked).length
  const total = items
    .filter(i => !i.checked)
    .reduce((sum, i) => {
      const price = i.unit_price ?? i.items?.unit_price ?? 0
      return sum + price * (i.qty ?? 1)
    }, 0)

  return (
    <div className="mb-2">
      {/* Sticky category header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 border-y border-gray-100 sticky top-0 z-10"
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {category}
          </span>
          {uncheckedCount > 0 && (
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
              {uncheckedCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {total > 0 && (
            <span className="text-xs font-mono text-gray-400">
              ${total.toFixed(2)}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? '-rotate-90' : ''}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {/* Items */}
      {!collapsed && (
        <div className="divide-y divide-gray-50">
          {items.map(item => (
            <TripItem
              key={item.id}
              tripItem={item}
              onToggle={onToggle}
              onRemove={onRemove}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}
