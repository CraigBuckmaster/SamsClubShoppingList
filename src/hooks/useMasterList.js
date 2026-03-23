import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useMasterList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('is_regular', true)
        .order('name', { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createItem = useCallback(async (itemData) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert({
          name: itemData.name,
          category: itemData.category || 'Other',
          sams_url: itemData.sams_url || null,
          sams_product_id: itemData.sams_product_id || null,
          image_url: itemData.image_url || null,
          unit_price: itemData.unit_price || null,
          notes: itemData.notes || null,
          is_regular: true,
        })
        .select()
        .single()

      if (error) throw error
      setItems(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      return data
    } catch (err) {
      console.error('Error creating item:', err)
      throw err
    }
  }, [])

  const updateItem = useCallback(async (itemId, updates) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single()

      if (error) throw error
      setItems(prev => prev.map(i => i.id === itemId ? data : i))
      return data
    } catch (err) {
      console.error('Error updating item:', err)
      throw err
    }
  }, [])

  const deleteItem = useCallback(async (itemId) => {
    setItems(prev => prev.filter(i => i.id !== itemId))
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId)

    if (error) {
      console.error('Error deleting item:', err)
      loadItems()
    }
  }, [])

  return { items, loading, error, createItem, updateItem, deleteItem, reload: loadItems }
}
