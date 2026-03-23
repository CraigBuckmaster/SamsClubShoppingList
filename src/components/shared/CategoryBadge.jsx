import { getCategoryColors } from '../../lib/categories'

export default function CategoryBadge({ category, size = 'sm' }) {
  const colors = getCategoryColors(category)
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClass} ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {category}
    </span>
  )
}
