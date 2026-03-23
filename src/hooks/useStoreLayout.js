import { useCallback } from 'react'
import { useCategorySort } from '../context/CategorySortContext'
import { CATEGORIES } from '../lib/categories'

export function useStoreLayout() {
  const { sortOrder, loading, updateSortOrder, sortCategories } = useCategorySort()

  // Returns categories as an ordered array based on current sort order
  const orderedCategories = sortCategories(CATEGORIES)

  const saveNewOrder = useCallback(async (orderedCategoryArray) => {
    await updateSortOrder(orderedCategoryArray)
  }, [updateSortOrder])

  return { orderedCategories, sortOrder, loading, saveNewOrder }
}
