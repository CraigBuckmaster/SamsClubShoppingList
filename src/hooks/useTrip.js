import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useTrip() {
  const [trip, setTrip] = useState(null)
  const [tripItems, setTripItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load or create the active trip on mount
  useEffect(() => {
    loadActiveTrip()
  }, [])

  async function loadActiveTrip() {
    setLoading(true)
    try {
      // Get the most recent non-completed trip
      let { data: trips, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('completed', false)
        .order('created_at', { ascending: false })
        .limit(1)

      if (tripError) throw tripError

      let activeTrip = trips?.[0]

      // Create a new trip if none exists
      if (!activeTrip) {
        const { data: newTrip, error: createError } = await supabase
          .from('trips')
          .insert({ name: "Sam's Run" })
          .select()
          .single()

        if (createError) throw createError
        activeTrip = newTrip
      }

      setTrip(activeTrip)
      await loadTripItems(activeTrip.id)
    } catch (err) {
      setError(err.message)
      console.error('Error loading trip:', err)
    } finally {
      setLoading(false)
    }
  }

  async function loadTripItems(tripId) {
    const { data, error } = await supabase
      .from('trip_items')
      .select(`
        *,
        items (
          id, name, category, image_url, sams_url,
          unit_price, last_price, price_updated, notes, sams_product_id
        )
      `)
      .eq('trip_id', tripId)
      .order('added_at', { ascending: true })

    if (error) throw error
    setTripItems(data || [])
  }

  const addItemToTrip = useCallback(async ({ itemData, qty = 1 }) => {
    if (!trip) return

    try {
      // Upsert into items table
      const { data: item, error: itemError } = await supabase
        .from('items')
        .upsert({
          name: itemData.name,
          category: itemData.category || 'Other',
          sams_url: itemData.sams_url || null,
          sams_product_id: itemData.sams_product_id || null,
          image_url: itemData.image_url || null,
          unit_price: itemData.unit_price || null,
          last_price: itemData.unit_price || null,
          price_updated: itemData.unit_price ? new Date().toISOString() : null,
          notes: itemData.notes || null,
          is_regular: itemData.is_regular ?? true,
        }, { onConflict: 'id' })
        .select()
        .single()

      if (itemError) throw itemError

      // Insert into trip_items
      const { data: tripItem, error: tripItemError } = await supabase
        .from('trip_items')
        .insert({
          trip_id: trip.id,
          item_id: item.id,
          qty,
          unit_price: itemData.unit_price || null,
          checked: false,
        })
        .select(`
          *,
          items (
            id, name, category, image_url, sams_url,
            unit_price, last_price, price_updated, notes, sams_product_id
          )
        `)
        .single()

      if (tripItemError) throw tripItemError

      // Log price history if price exists
      if (itemData.unit_price) {
        await supabase
          .from('price_history')
          .insert({ item_id: item.id, price: itemData.unit_price })
      }

      setTripItems(prev => [...prev, tripItem])
      return tripItem
    } catch (err) {
      console.error('Error adding item to trip:', err)
      throw err
    }
  }, [trip])

  const toggleChecked = useCallback(async (tripItemId) => {
    const item = tripItems.find(i => i.id === tripItemId)
    if (!item) return

    const newChecked = !item.checked

    // Optimistic update
    setTripItems(prev =>
      prev.map(i => i.id === tripItemId ? { ...i, checked: newChecked } : i)
    )

    const { error } = await supabase
      .from('trip_items')
      .update({ checked: newChecked })
      .eq('id', tripItemId)

    if (error) {
      // Revert on failure
      setTripItems(prev =>
        prev.map(i => i.id === tripItemId ? { ...i, checked: !newChecked } : i)
      )
      console.error('Error toggling checked:', error)
    }
  }, [tripItems])

  const updateTripItem = useCallback(async (tripItemId, updates) => {
    // Optimistic update
    setTripItems(prev =>
      prev.map(i => i.id === tripItemId ? { ...i, ...updates } : i)
    )

    const { error } = await supabase
      .from('trip_items')
      .update(updates)
      .eq('id', tripItemId)

    if (error) {
      console.error('Error updating trip item:', error)
      await loadTripItems(trip.id)
    }
  }, [trip])

  const removeTripItem = useCallback(async (tripItemId) => {
    // Optimistic update
    setTripItems(prev => prev.filter(i => i.id !== tripItemId))

    const { error } = await supabase
      .from('trip_items')
      .delete()
      .eq('id', tripItemId)

    if (error) {
      console.error('Error removing trip item:', error)
      await loadTripItems(trip.id)
    }
  }, [trip])

  const updateTrip = useCallback(async (updates) => {
    if (!trip) return

    setTrip(prev => ({ ...prev, ...updates }))

    const { error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', trip.id)

    if (error) {
      console.error('Error updating trip:', error)
    }
  }, [trip])

  const completeTrip = useCallback(async () => {
    if (!trip) return
    await updateTrip({ completed: true })
    await loadActiveTrip()
  }, [trip])

  const createNewTrip = useCallback(async (name = "Sam's Run", budget = null) => {
    try {
      const { data: newTrip, error } = await supabase
        .from('trips')
        .insert({ name, budget })
        .select()
        .single()

      if (error) throw error
      setTrip(newTrip)
      setTripItems([])
      return newTrip
    } catch (err) {
      console.error('Error creating trip:', err)
      throw err
    }
  }, [])

  return {
    trip,
    tripItems,
    loading,
    error,
    addItemToTrip,
    toggleChecked,
    updateTripItem,
    removeTripItem,
    updateTrip,
    completeTrip,
    createNewTrip,
    reload: loadActiveTrip,
  }
}
