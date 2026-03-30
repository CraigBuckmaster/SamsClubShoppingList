import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBudget } from '../hooks/useBudget'

describe('useBudget', () => {
  it('returns zero totals when there are no items', () => {
    const { result } = renderHook(() => useBudget({ budget: 100 }, []))
    expect(result.current.uncheckedTotal).toBe(0)
    expect(result.current.checkedTotal).toBe(0)
    expect(result.current.grandTotal).toBe(0)
    expect(result.current.remaining).toBe(100)
    expect(result.current.status).toBe('safe')
  })

  it('calculates unchecked total correctly', () => {
    const items = [
      { id: '1', checked: false, unit_price: 10, qty: 2, items: {} },
      { id: '2', checked: false, unit_price: 5, qty: 1, items: {} },
    ]
    const { result } = renderHook(() => useBudget({ budget: 100 }, items))
    expect(result.current.uncheckedTotal).toBe(25)
    expect(result.current.remaining).toBe(75)
  })

  it('calculates checked total separately', () => {
    const items = [
      { id: '1', checked: true, unit_price: 10, qty: 1, items: {} },
      { id: '2', checked: false, unit_price: 15, qty: 1, items: {} },
    ]
    const { result } = renderHook(() => useBudget({ budget: 50 }, items))
    expect(result.current.checkedTotal).toBe(10)
    expect(result.current.uncheckedTotal).toBe(15)
    expect(result.current.grandTotal).toBe(25)
    expect(result.current.remaining).toBe(35)
  })

  it('falls back to items.unit_price when trip_item price is null', () => {
    const items = [
      { id: '1', checked: false, unit_price: null, qty: 1, items: { unit_price: 20 } },
    ]
    const { result } = renderHook(() => useBudget({ budget: 50 }, items))
    expect(result.current.uncheckedTotal).toBe(20)
  })

  it('returns null remaining when no budget is set', () => {
    const items = [
      { id: '1', checked: false, unit_price: 10, qty: 1, items: {} },
    ]
    const { result } = renderHook(() => useBudget({ budget: null }, items))
    expect(result.current.remaining).toBeNull()
    expect(result.current.status).toBe('safe')
  })

  it('returns "over" status when over budget', () => {
    const items = [
      { id: '1', checked: false, unit_price: 60, qty: 1, items: {} },
    ]
    const { result } = renderHook(() => useBudget({ budget: 50 }, items))
    expect(result.current.status).toBe('over')
    expect(result.current.remaining).toBe(-10)
  })

  it('returns "danger" status when <10% remaining', () => {
    const items = [
      { id: '1', checked: false, unit_price: 92, qty: 1, items: {} },
    ]
    const { result } = renderHook(() => useBudget({ budget: 100 }, items))
    expect(result.current.status).toBe('danger')
  })

  it('returns "warning" status when <20% remaining', () => {
    const items = [
      { id: '1', checked: false, unit_price: 85, qty: 1, items: {} },
    ]
    const { result } = renderHook(() => useBudget({ budget: 100 }, items))
    expect(result.current.status).toBe('warning')
  })

  it('handles qty defaulting to 1', () => {
    const items = [
      { id: '1', checked: false, unit_price: 10, items: {} },
    ]
    const { result } = renderHook(() => useBudget({ budget: 100 }, items))
    expect(result.current.uncheckedTotal).toBe(10)
  })

  it('handles null trip gracefully', () => {
    const { result } = renderHook(() => useBudget(null, []))
    expect(result.current.budget).toBeNull()
    expect(result.current.remaining).toBeNull()
  })
})
