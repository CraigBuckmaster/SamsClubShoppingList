import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useStoreLayout } from '../../hooks/useStoreLayout'
import { getCategoryColors } from '../../lib/categories'

function SortableCategory({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const colors = getCategoryColors(id)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-100 rounded-xl mb-2"
    >
      <span className={`w-3 h-3 rounded-full flex-shrink-0 ${colors.dot}`} />
      <span className="flex-1 text-sm font-medium text-gray-800">{id}</span>
      <button
        {...attributes}
        {...listeners}
        className="p-2 text-gray-300 touch-none"
        aria-label={`Drag to reorder ${id}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
        </svg>
      </button>
    </div>
  )
}

export default function StoreLayoutSettings() {
  const { orderedCategories, saveNewOrder, loading } = useStoreLayout()
  const [items, setItems] = useState(orderedCategories)
  const [saved, setSaved] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setItems(prev => {
      const oldIndex = prev.indexOf(active.id)
      const newIndex = prev.indexOf(over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
    setSaved(false)
  }

  async function handleSave() {
    await saveNewOrder(items)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="px-4 py-8 text-center text-gray-400 text-sm">Loading layout...</div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4 px-4">
        Drag categories into the order you walk your store. Your list will sort to match.
      </p>

      <div className="px-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map(cat => (
              <SortableCategory key={cat} id={cat} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="px-4 mt-4">
        <button
          onClick={handleSave}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-colors ${
            saved
              ? 'bg-safe text-white'
              : 'bg-primary text-white active:bg-primary-dark'
          }`}
        >
          {saved ? '✓ Layout Saved' : 'Save Store Layout'}
        </button>
      </div>
    </div>
  )
}
