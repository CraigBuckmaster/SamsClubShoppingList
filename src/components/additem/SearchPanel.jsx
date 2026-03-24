import { useRef, useEffect } from 'react'
import { useItemSearch } from '../../hooks/useItemSearch'
import SearchResultItem from './SearchResultItem'

export default function SearchPanel({ onSelect, onManual, onBack }) {
  const { query, setQuery, results, loading, error } = useItemSearch()
  const inputRef = useRef(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3 flex-shrink-0">
        <button onClick={onBack} className="text-gray-400 active:text-gray-600 p-1 -ml-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h3 className="text-base font-semibold text-gray-900">Search Sam's Club</h3>
      </div>

      {/* Search input */}
      <div className="px-5 mb-1 flex-shrink-0">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. paper towels, coffee, chicken..."
            className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-gray-50"
          />
          {query.length > 0 && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 active:text-gray-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Results area */}
      <div className="flex-1 overflow-y-auto">
        {/* Loading skeleton */}
        {loading && (
          <div className="px-5 py-4 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="w-12 h-5 bg-gray-100 rounded flex-shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && query.length >= 2 && (
          <div className="px-5 py-6 text-center">
            <p className="text-sm text-gray-400 mb-1">Search unavailable</p>
            <p className="text-xs text-gray-300">{error}</p>
            <button
              onClick={onManual}
              className="mt-4 text-sm text-primary font-medium"
            >
              Add manually instead →
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && results.length > 0 && (
          <div>
            {results.map(result => (
              <SearchResultItem
                key={result.id || result.name}
                result={result}
                onSelect={onSelect}
              />
            ))}
            {/* Manual escape hatch */}
            <button
              onClick={onManual}
              className="w-full py-4 text-sm text-gray-400 text-center active:bg-gray-50 border-t border-gray-50"
            >
              + Add manually instead
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && !error && query.length >= 2 && results.length === 0 && (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-gray-400 mb-4">No results for "{query}"</p>
            <button
              onClick={onManual}
              className="text-sm text-primary font-medium"
            >
              + Add manually instead
            </button>
          </div>
        )}

        {/* Empty state — before typing */}
        {query.length < 2 && !loading && (
          <div className="px-5 py-6 text-center">
            <p className="text-xs text-gray-300">Type at least 2 characters to search</p>
          </div>
        )}
      </div>
    </div>
  )
}
