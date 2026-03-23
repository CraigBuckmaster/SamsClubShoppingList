import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { CATEGORY_SORT_ORDER } from '../lib/categories'

const CategorySortContext = createContext(null)

export function CategorySortProvider({ children }) {
  const [sortOrder, setSortOrder] = useState(CATEGORY_SORT_ORDER)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSortOrder()
  }, [])

  async function loadSortOrder() {
    try {
      const { data, error } = await supabase
        .from('category_sort_order')
        .select('category, sort_order')
        .order('sort_order', { ascending: true })

      if (error) throw error

      if (data && data.length > 0) {
        const map = {}
        data.forEach(row => { map[row.category] = row.sort_order })
        setSortOrder(map)
      }
    } catch (err) {
      console.warn('Could not load sort order from DB, using defaults:', err.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateSortOrder(newOrderedCategories) {
    // newOrderedCategories is an array of category strings in the desired order
    const updates = newOrderedCategories.map((category, index) => ({
      category,
      sort_order: index + 1,
      updated_at: new Date().toISOString(),
    }))

    // Optimistic update
    const newMap = {}
    updates.forEach(u => { newMap[u.category] = u.sort_order })
    setSortOrder(newMap)

    try {
      const { error } = await supabase
        .from('category_sort_order')
        .upsert(updates, { onConflict: 'category' })

      if (error) throw error
    } catch (err) {
      console.error('Failed to save sort order:', err.message)
      // Revert on failure
      loadSortOrder()
    }
  }

  function sortCategories(categoryArray) {
    return [...categoryArray].sort(
      (a, b) => (sortOrder[a] ?? 99) - (sortOrder[b] ?? 99)
    )
  }

  return (
    <CategorySortContext.Provider value={{ sortOrder, loading, updateSortOrder, sortCategories }}>
      {children}
    </CategorySortContext.Provider>
  )
}

export function useCategorySort() {
  const ctx = useContext(CategorySortContext)
  if (!ctx) throw new Error('useCategorySort must be used within CategorySortProvider')
  return ctx
}
