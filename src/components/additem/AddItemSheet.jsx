import { useState } from 'react'
import ManualItemForm from './ManualItemForm'
import ConfirmItemForm from './ConfirmItemForm'

const VIEWS = {
  PICKER: 'picker',
  FROM_LIST: 'from_list',
  SEARCH: 'search',
  CONFIRM: 'confirm',
  MANUAL: 'manual',
}

export default function AddItemSheet({ onClose, onAdd, masterItems = [] }) {
  const [view, setView] = useState(VIEWS.PICKER)
  const [selectedResult, setSelectedResult] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [masterSearch, setMasterSearch] = useState('')
  const [selectedQty, setSelectedQty] = useState(1)

  function handleAddFromMaster(item) {
    onAdd({
      name: item.name,
      category: item.category,
      unit_price: item.unit_price,
      sams_url: item.sams_url,
      sams_product_id: item.sams_product_id,
      image_url: item.image_url,
      notes: item.notes,
      is_regular: item.is_regular,
      id: item.id,
    }, 1)
  }

  function handleManualAdd(itemData, qty) {
    onAdd(itemData, qty)
  }

  function handleConfirmAdd(itemData, qty) {
    onAdd(itemData, qty)
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

        <div className="overflow-y-auto flex-1">
          {/* PICKER — Choose path */}
          {view === VIEWS.PICKER && (
            <div className="px-5 pt-2 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Add Item</h3>
              <p className="text-sm text-gray-400 mb-6">How would you like to add an item?</p>

              <div className="space-y-3">
                <button
                  onClick={() => setView(VIEWS.FROM_LIST)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 active:bg-gray-50 text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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

                <button
                  onClick={() => setView(VIEWS.MANUAL)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 active:bg-gray-50 text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Add Manually</p>
                    <p className="text-xs text-gray-400 mt-0.5">Enter item details yourself</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* FROM_LIST — Master list picker */}
          {view === VIEWS.FROM_LIST && (
            <div className="pb-8">
              <div className="flex items-center gap-3 px-5 pt-4 mb-4">
                <button onClick={() => setView(VIEWS.PICKER)} className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <h3 className="text-base font-semibold text-gray-900">From My List</h3>
              </div>

              <div className="px-5 mb-3">
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

              {filteredMasterItems.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  {masterItems.length === 0 ? "Your list is empty" : "No items match"}
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredMasterItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { handleAddFromMaster(item); onClose() }}
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
          )}

          {/* MANUAL entry */}
          {view === VIEWS.MANUAL && (
            <ManualItemForm
              onAdd={(itemData, qty) => { handleManualAdd(itemData, qty); onClose() }}
              onBack={() => setView(VIEWS.PICKER)}
            />
          )}

          {/* CONFIRM — after search result selection (Phase 3 wires search in) */}
          {view === VIEWS.CONFIRM && selectedResult && (
            <ConfirmItemForm
              result={selectedResult}
              onAdd={(itemData, qty) => { handleConfirmAdd(itemData, qty); onClose() }}
              onBack={() => setView(VIEWS.SEARCH)}
            />
          )}
        </div>
      </div>
    </>
  )
}
