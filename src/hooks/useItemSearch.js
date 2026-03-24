import { useState, useEffect, useRef, useCallback } from 'react'

export function useItemSearch() {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const debounceRef           = useRef(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query || query.trim().length < 2) {
      setResults([])
      setError(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/search-items?q=${encodeURIComponent(query.trim())}`)
        const data = await res.json()

        if (data.success) {
          setResults(data.results || [])
          setError(null)
        } else {
          setResults([])
          setError(data.error || 'Search failed')
          // Log hint if available for path debugging
          if (data.hint) console.warn('[useItemSearch]', data.hint)
        }
      } catch (err) {
        setError('Network error — check your connection')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  const reset = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
    setLoading(false)
  }, [])

  return { query, setQuery, results, loading, error, reset }
}
