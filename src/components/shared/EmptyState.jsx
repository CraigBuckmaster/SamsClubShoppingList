export default function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-3xl">
          {icon}
        </div>
      )}
      <h3 className="text-gray-800 font-semibold text-base mb-1">{title}</h3>
      {subtitle && <p className="text-gray-400 text-sm mb-5">{subtitle}</p>}
      {action && action}
    </div>
  )
}
