export default function BudgetBar({ budgetData }) {
  const { budget, uncheckedTotal, remaining, status, percentUsed } = budgetData

  if (!budget) return null

  const barColor = {
    safe: 'bg-safe',
    warning: 'bg-warning',
    danger: 'bg-danger',
    over: 'bg-danger',
  }[status]

  const textColor = {
    safe: 'text-safe',
    warning: 'text-warning',
    danger: 'text-danger',
    over: 'text-danger',
  }[status]

  const fillPercent = Math.min(percentUsed, 100)

  const fmt = (n) => `$${Math.abs(n).toFixed(2)}`

  return (
    <div className="px-4 py-3 bg-white border-b border-gray-100">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Budget</span>
        <div className="flex items-baseline gap-1">
          {status === 'over' ? (
            <span className={`text-sm font-semibold ${textColor}`}>
              {fmt(remaining)} over budget
            </span>
          ) : (
            <>
              <span className={`text-sm font-semibold font-mono ${textColor}`}>
                {fmt(remaining)}
              </span>
              <span className="text-xs text-gray-400">left of {fmt(budget)}</span>
            </>
          )}
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor} ${status === 'over' ? 'animate-pulse' : ''}`}
          style={{ width: `${fillPercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">
          {uncheckedTotal > 0 ? `${fmt(uncheckedTotal)} in cart estimate` : 'No items yet'}
        </span>
        <span className="text-xs text-gray-400">{fmt(budget)} budget</span>
      </div>
    </div>
  )
}
