'use client'

import { useState } from 'react'
import { X, Search, Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import { PRESET_ITEMS, CATEGORIES } from '@/data/presets'
import { PresetItem } from '@/types'
import { cn } from '@/lib/utils'

interface AddItemModalProps {
  existingPresetIds: string[]
  onAdd: (presetId: string | null, customName?: string, customUrl?: string, category?: string, notes?: string) => void
  onClose: () => void
}

export default function AddItemModal({ existingPresetIds, onAdd, onClose }: AddItemModalProps) {
  const [tab, setTab] = useState<'preset' | 'custom'>('preset')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [customName, setCustomName] = useState('')
  const [customUrl, setCustomUrl] = useState('')
  const [customCategory, setCustomCategory] = useState('storage')
  const [notes, setNotes] = useState('')

  const filtered = PRESET_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    const notAdded = !existingPresetIds.includes(item.id)
    return matchesSearch && matchesCategory && notAdded
  })

  function handleAddPreset(item: PresetItem) {
    onAdd(item.id, undefined, undefined, item.category)
    onClose()
  }

  function handleAddCustom() {
    if (!customName.trim()) return
    onAdd(null, customName.trim(), customUrl.trim() || undefined, customCategory, notes.trim() || undefined)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-lg text-gray-900">Add Item</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex gap-1 p-4 flex-shrink-0">
          <button
            onClick={() => setTab('preset')}
            className={cn('flex-1 py-2 rounded-xl text-sm font-semibold transition-colors', tab === 'preset' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
          >
            Browse Items
          </button>
          <button
            onClick={() => setTab('custom')}
            className={cn('flex-1 py-2 rounded-xl text-sm font-semibold transition-colors', tab === 'custom' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
          >
            Custom Item
          </button>
        </div>

        {tab === 'preset' ? (
          <div className="flex flex-col flex-1 overflow-hidden px-4 pb-4 gap-3">
            <div className="relative flex-shrink-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0 -mx-4 px-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn('flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors', !selectedCategory ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={cn('flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap', selectedCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 space-y-2">
              {filtered.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">
                  {existingPresetIds.length > 0 ? 'All matching items already added!' : 'No items found.'}
                </p>
              ) : (
                filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAddPreset(item)}
                    className="w-full text-left flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">{item.image_emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-gray-900 truncate">{item.name}</p>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full flex-shrink-0', {
                          'bg-red-100 text-red-700': item.priority === 'essential',
                          'bg-blue-100 text-blue-700': item.priority === 'recommended',
                          'bg-gray-100 text-gray-600': item.priority === 'nice-to-have',
                        })}>
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                      <p className="text-xs text-indigo-600 font-medium mt-1">{item.price_estimate}</p>
                    </div>
                    <Plus size={16} className="text-indigo-600 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-4 pb-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Name *</label>
              <input
                type="text"
                placeholder="e.g. Portable Bluetooth Speaker"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Purchase Link (optional)</label>
              <input
                type="url"
                placeholder="https://amazon.com/..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes (optional)</label>
              <textarea
                placeholder="e.g. Get the black one, size M"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            <Button onClick={handleAddCustom} disabled={!customName.trim()} size="lg" className="w-full">
              Add to Checklist
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
