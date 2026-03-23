import { useMemo } from 'react'

export function useBudget(trip, tripItems) {
  return useMemo(() => {
    const budget = trip?.budget ?? null

    const uncheckedTotal = tripItems
      .filter(i => !i.checked)
      .reduce((sum, i) => {
        const price = i.unit_price ?? i.items?.unit_price ?? 0
        const qty = i.qty ?? 1
        return sum + price * qty
      }, 0)

    const checkedTotal = tripItems
      .filter(i => i.checked)
      .reduce((sum, i) => {
        const price = i.unit_price ?? i.items?.unit_price ?? 0
        const qty = i.qty ?? 1
        return sum + price * qty
      }, 0)

    const grandTotal = uncheckedTotal + checkedTotal
    const remaining = budget !== null ? budget - uncheckedTotal : null
    const percentUsed = budget ? ((budget - (remaining ?? 0)) / budget) * 100 : 0

    let status = 'safe'
    if (remaining !== null) {
      if (remaining < 0) status = 'over'
      else if (remaining / budget < 0.1) status = 'danger'
      else if (remaining / budget < 0.2) status = 'warning'
    }

    return {
      budget,
      uncheckedTotal,
      checkedTotal,
      grandTotal,
      remaining,
      percentUsed,
      status,
    }
  }, [trip, tripItems])
}
