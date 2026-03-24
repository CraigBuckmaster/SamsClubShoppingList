export default function SearchResultItem({ result, onSelect }) {
  const fmt = (n) => n != null ? `$${Number(n).toFixed(2)}` : null

  return (
    <button
      onClick={() => onSelect(result)}
      className="w-full flex items-center gap-3 px-5 py-3.5 active:bg-blue-50 text-left border-b border-gray-50 last:border-0"
    >
      {/* Thumbnail */}
      {result.thumbnail ? (
        <img
          src={result.thumbnail}
          alt={result.name}
          className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0"
          onError={e => { e.target.style.display = 'none' }}
        />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
      )}

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
          {result.name}
        </p>
        {result.description && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{result.description}</p>
        )}
        {result.category && (
          <p className="text-xs text-primary/70 mt-0.5">{result.category}</p>
        )}
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        {result.price != null ? (
          <p className="text-base font-semibold font-mono text-gray-900">
            {fmt(result.price)}
          </p>
        ) : (
          <p className="text-xs text-gray-300 italic">No price</p>
        )}
      </div>
    </button>
  )
}
