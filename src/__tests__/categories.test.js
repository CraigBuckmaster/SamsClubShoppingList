import { describe, it, expect } from 'vitest'
import { inferCategory, getCategoryColors, CATEGORIES, CATEGORY_COLORS, SAMS_CATEGORY_MAP } from '../lib/categories'

describe('inferCategory', () => {
  it('maps known Sam\'s Club categories correctly', () => {
    expect(inferCategory('Frozen Foods')).toBe('Frozen')
    expect(inferCategory('Fresh Produce')).toBe('Produce')
    expect(inferCategory('Dairy & Eggs')).toBe('Dairy')
    expect(inferCategory('Meat & Seafood')).toBe('Meat')
    expect(inferCategory('Chips & Snacks')).toBe('Snacks')
    expect(inferCategory('Coffee & Tea')).toBe('Beverages')
    expect(inferCategory('Cleaning Supplies')).toBe('Household')
    expect(inferCategory('Health & Wellness')).toBe('Health & Beauty')
  })

  it('returns "Other" for unknown categories', () => {
    expect(inferCategory('Electronics')).toBe('Other')
    expect(inferCategory('Automotive')).toBe('Other')
  })

  it('returns "Other" for null/undefined input', () => {
    expect(inferCategory(null)).toBe('Other')
    expect(inferCategory(undefined)).toBe('Other')
    expect(inferCategory('')).toBe('Other')
  })
})

describe('getCategoryColors', () => {
  it('returns colors for known categories', () => {
    const colors = getCategoryColors('Bakery')
    expect(colors.bg).toBe('bg-amber-100')
    expect(colors.text).toBe('text-amber-800')
    expect(colors.dot).toBe('bg-amber-400')
  })

  it('returns gray colors for unknown categories', () => {
    const colors = getCategoryColors('Unknown')
    expect(colors).toEqual(CATEGORY_COLORS['Other'])
  })
})

describe('CATEGORIES', () => {
  it('has 11 categories', () => {
    expect(CATEGORIES).toHaveLength(11)
  })

  it('every category has a color mapping', () => {
    CATEGORIES.forEach(cat => {
      expect(CATEGORY_COLORS[cat]).toBeDefined()
    })
  })
})

describe('SAMS_CATEGORY_MAP', () => {
  it('all mapped values are valid app categories', () => {
    Object.values(SAMS_CATEGORY_MAP).forEach(val => {
      expect(CATEGORIES).toContain(val)
    })
  })
})
