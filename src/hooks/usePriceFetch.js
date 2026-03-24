import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function usePriceFetch() {
  const [fetching, setFetching] = useState({}) // { [itemId]: true }
  const [errors, setErrors]     = useState({}) // { [itemId]: 'message' }

  const fetchPrice = useCallback(async (item) => {
    if (!item?.sams_url) return null

    setFetching(prev => ({ ...prev, [item.id]: true }))
    setErrors(prev => { const n = { ...prev }; delete n[item.id]; return n })

    try {
      const res  = await fetch('/api/fetch-price', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url: item.sams_url }),
      })
      const data = await res.json()

      if (!data.success) {
        setErrors(prev => ({ ...prev, [item.id]: data.error || 'Price unavailable' }))
        return null
      }

      const newPrice = data.price

      // Update items table
      await supabase
        .from('items')
        .update({
          last_price:    item.unit_price,
          unit_price:    newPrice,
          price_updated: new Date().toISOString(),
        })
        .eq('id', item.id)

      // Log to price_history
      await supabase
        .from('price_history')
        .insert({ item_id: item.id, price: newPrice })

      return newPrice

    } catch (err) {
      setErrors(prev => ({ ...prev, [item.id]: 'Network error' }))
      return null
    } finally {
      setFetching(prev => { const n = { ...prev }; delete n[item.id]; return n })
    }
  }, [])

  // Refresh all items that have a sams_url and haven't been updated in 24h
  const refreshStale = useCallback(async (items) => {
    const cutoff   = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const stale    = items.filter(i => {
      if (!i.items?.sams_url) return false
      if (!i.items?.price_updated) return true
      return new Date(i.items.price_updated) < cutoff
    })

    const updatedPrices = {}
    for (const tripItem of stale) {
      const price = await fetchPrice(tripItem.items)
      if (price != null) updatedPrices[tripItem.items.id] = price
    }
    return updatedPrices
  }, [fetchPrice])

  // Bulk refresh all items with sams_url (manual "Refresh All")
  const refreshAll = useCallback(async (items) => {
    const withUrl = items.filter(i => i.items?.sams_url)
    const updatedPrices = {}
    for (const tripItem of withUrl) {
      const price = await fetchPrice(tripItem.items)
      if (price != null) updatedPrices[tripItem.items.id] = price
    }
    return updatedPrices
  }, [fetchPrice])

  return {
    fetchPrice,
    refreshStale,
    refreshAll,
    fetching,
    errors,
    isFetching: (itemId) => !!fetching[itemId],
    getError:   (itemId) => errors[itemId] || null,
  }
}
