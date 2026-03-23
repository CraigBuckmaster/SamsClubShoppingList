import { CATEGORIES, getCategoryColors } from '../../lib/categories'

export default function CategoryDropdown({ value, onChange, className = '' }) {
  return (
    <select
      value={value || 'Other'}
      onChange={e => onChange(e.target.value)}
      className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none ${className}`}
    >
      {CATEGORIES.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  )
}
