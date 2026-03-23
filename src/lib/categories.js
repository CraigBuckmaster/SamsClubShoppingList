// All app categories
export const CATEGORIES = [
  'Bakery',
  'Produce',
  'Deli',
  'Meat',
  'Dairy',
  'Beverages',
  'Snacks',
  'Frozen',
  'Household',
  'Health & Beauty',
  'Other',
]

// Default store walk order — seeds the DB on first load
// Lower number = earlier in store walk
export const CATEGORY_SORT_ORDER = {
  'Bakery':           1,
  'Produce':          2,
  'Deli':             3,
  'Meat':             4,
  'Dairy':            5,
  'Beverages':        6,
  'Snacks':           7,
  'Frozen':           8,
  'Household':        9,
  'Health & Beauty':  10,
  'Other':            11,
}

// Tailwind background + text color classes per category
export const CATEGORY_COLORS = {
  'Bakery':           { bg: 'bg-amber-100',  text: 'text-amber-800',  dot: 'bg-amber-400' },
  'Produce':          { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500' },
  'Deli':             { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-400' },
  'Meat':             { bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-500' },
  'Dairy':            { bg: 'bg-sky-100',    text: 'text-sky-800',    dot: 'bg-sky-400' },
  'Beverages':        { bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-400' },
  'Snacks':           { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-400' },
  'Frozen':           { bg: 'bg-cyan-100',   text: 'text-cyan-800',   dot: 'bg-cyan-400' },
  'Household':        { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-400' },
  'Health & Beauty':  { bg: 'bg-pink-100',   text: 'text-pink-800',   dot: 'bg-pink-400' },
  'Other':            { bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400' },
}

// Map Sam's Club breadcrumb category names → our app categories
export const SAMS_CATEGORY_MAP = {
  'Paper':                  'Household',
  'Cleaning Supplies':      'Household',
  'Laundry':                'Household',
  'Household Essentials':   'Household',
  'Frozen Foods':           'Frozen',
  'Frozen':                 'Frozen',
  'Fresh Produce':          'Produce',
  'Produce':                'Produce',
  'Bakery':                 'Bakery',
  'Bakery & Bread':         'Bakery',
  'Deli':                   'Deli',
  'Deli & Prepared Foods':  'Deli',
  'Dairy & Eggs':           'Dairy',
  'Dairy':                  'Dairy',
  'Beverages':              'Beverages',
  'Bottled and Sparkling Water': 'Beverages',
  'Coffee & Tea':           'Beverages',
  'Juice & Drinks':         'Beverages',
  'Snacks':                 'Snacks',
  'Chips & Snacks':         'Snacks',
  'Candy':                  'Snacks',
  'Health & Beauty':        'Health & Beauty',
  'Health & Wellness':      'Health & Beauty',
  'Personal Care':          'Health & Beauty',
  'Meat & Seafood':         'Meat',
  'Meat':                   'Meat',
  'Seafood':                'Meat',
}

export function inferCategory(samsCategory) {
  if (!samsCategory) return 'Other'
  return SAMS_CATEGORY_MAP[samsCategory] ?? 'Other'
}

export function getCategoryColors(category) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS['Other']
}
