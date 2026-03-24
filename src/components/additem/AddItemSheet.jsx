import { useState } from 'react'
import SearchPanel from './SearchPanel'
import SearchResultItem from './SearchResultItem'
import ConfirmItemForm from './ConfirmItemForm'
import ManualItemForm from './ManualItemForm'

const VIEWS = {
  PICKER:    'picker',
  FROM_LIST: 'from_list',
  SEARCH:    'search',
  CONFIRM:   'confirm',
  MANUAL:    'manual',
}

export default function AddItemSheet({ onClose, onAdd, masterItems = [] }) {
  const [view, setView]                 = useState(VIEWS.PICKER)
  const [selectedResult, setSelectedResult] = useState(null)
  const [masterSearch, setMasterSearch] = useState('')

  function handleSearchSelect(result) {
    setSelectedResult(result)
    setView(VIEWS.CONFIRM)
  }

  function handleAddFromMaster(item) {
    onAdd({
      name:           item.name,
      category:       item.category,
      unit_price:     item.unit_price,
      sams_url:       item.sams_url,
      sams_product_id: item.sams_product_id,
      image_url:      item.image_url,
      notes:          item.notes,
      is_regular:     true,
      id:             item.id,
    }, 1)
    onClose()
  }

  const filteredMasterItems = masterItems.filter(i =>
    i.name.toLowerCase().includes(masterSearch.toLowerCase())
  )

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 shadow-2xl max-h-[92vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">

          {/* ─── PICKER ─── */}
          {view === VIEWS.PICKER && (
            <div className="px-5 pt-2 pb-8 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Add Item</h3>
              <p className="text-sm text-gray-400 mb-6">How would you like to add an item?</p>

              <div className="space-y-3">
                {/* Search Sam's Club */}
                <button
                  onClick={() => setView(VIEWS.SEARCH)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-primary/30 bg-primary-light active:bg-primary/10 text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">Search Sam's Club</p>
                    <p className="text-xs text-primary/70 mt-0.5">Find product, price auto-fills</p>
                  </div>
                  <svg className="w-4 h-4 text-primary/40 ml-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>

                {/* From My List */}
                <button
                  onClick={() => setView(VIEWS.FROM_LIST)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 active:bg-gray-50 text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">From My List</p>
                    <p className="text-xs text-gray-400 mt-0.5">Add a saved item to this trip</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>

                {/* Manual */}
                <button
                  onClick={() => setView(VIEWS.MANUAL)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 active:bg-gray-50 text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Add Manually</p>
                    <p className="text-xs text-gray-400 mt-0.5">Enter name and price yourself</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ─── SEARCH ─── */}
          {view === VIEWS.SEARCH && (
            <SearchPanel
              onSelect={handleSearchSelect}
              onManual={() => setView(VIEWS.MANUAL)}
              onBack={() => setView(VIEWS.PICKER)}
            />
          )}

          {/* ─── CONFIRM ─── */}
          {view === VIEWS.CONFIRM && selectedResult && (
            <div className="overflow-y-auto">
              <ConfirmItemForm
                result={selectedResult}
                onAdd={(itemData, qty) => { onAdd(itemData, qty); onClose() }}
                onBack={() => setView(VIEWS.SEARCH)}
              />
            </div>
          )}

          {/* ─── FROM LIST ─── */}
          {view === VIEWS.FROM_LIST && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center gap-3 px-5 pt-4 mb-3 flex-shrink-0">
                <button onClick={() => setView(VIEWS.PICKER)} className="text-gray-400 p-1 -ml-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <h3 className="text-base font-semibold text-gray-900">From My List</h3>
              </div>

              <div className="px-5 mb-3 flex-shrink-0">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    type="text"
                    value={masterSearch}
                    onChange={e => setMasterSearch(e.target.value)}
                    placeholder="Search your list..."
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    autoFocus
                  />
                </div>
              </div>

              <div className="overflow-y-auto flex-1 pb-6">
                {filteredMasterItems.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    {masterItems.length === 0 ? 'Your list is empty' : 'No items match'}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {filteredMasterItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleAddFromMaster(item)}
                        className="w-full flex items-center gap-3 px-5 py-3 active:bg-gray-50 text-left"
                      >
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.category}</p>
                        </div>
                        {item.unit_price && (
                          <p className="text-sm font-semibold font-mono text-gray-700 flex-shrink-0">
                            ${Number(item.unit_price).toFixed(2)}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── MANUAL ─── */}
          {view === VIEWS.MANUAL && (
            <div className="overflow-y-auto flex-1">
              <ManualItemForm
                onAdd={(itemData, qty) => { onAdd(itemData, qty); onClose() }}
                onBack={() => setView(VIEWS.PICKER)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
