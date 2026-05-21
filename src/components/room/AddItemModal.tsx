'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Search, Plus, ArrowLeft } from 'lucide-react'
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
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const [customAdded, setCustomAdded] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  // Scroll list to top whenever category or search changes
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 })
  }, [selectedCategory, search])

  const isSearching = search.trim().length > 0

  // Rank results: name-prefix matches first, name-contains second, description-only last
  const filtered = (() => {
    const inCategory = PRESET_ITEMS.filter((item) => !selectedCategory || item.category === selectedCategory)
    if (!isSearching) return inCategory
    const q = search.toLowerCase().trim()
    const matches = inCategory.filter((item) =>
      item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    )
    return matches.sort((a, b) => {
      const an = a.name.toLowerCase()
      const bn = b.name.toLowerCase()
      const aStart = an.startsWith(q)
      const bStart = bn.startsWith(q)
      if (aStart !== bStart) return aStart ? -1 : 1
      const aName = an.includes(q)
      const bName = bn.includes(q)
      if (aName !== bName) return aName ? -1 : 1
      return 0
    })
  })()

  const categoryItemCounts = Object.fromEntries(
    CATEGORIES.map((cat) => [cat.id, PRESET_ITEMS.filter((i) => i.category === cat.id).length])
  )

  function handleAddPreset(item: PresetItem) {
    onAdd(item.id, undefined, undefined, item.category)
    // Stay open — user can add multiple items; "in room" badge is the feedback
    setJustAdded(item.id)
    setTimeout(() => setJustAdded(null), 1200)
  }

  function handleAddCustom() {
    if (!customName.trim()) return
    onAdd(null, customName.trim(), customUrl.trim() || undefined, customCategory, notes.trim() || undefined)
    // Reset form and flash success — stay open so user can add another
    setCustomName('')
    setCustomUrl('')
    setNotes('')
    setCustomAdded(true)
    setTimeout(() => setCustomAdded(false), 1500)
  }

  const showCategoryGrid = !isSearching && !selectedCategory

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[85dvh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          {selectedCategory && !isSearching ? (
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold text-sm"
            >
              <ArrowLeft size={16} />
              {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
            </button>
          ) : (
            <h2 className="font-bold text-lg text-gray-900">Add Item</h2>
          )}
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-4 flex-shrink-0">
          <button
            onClick={() => setTab('preset')}
            className={cn('flex-1 py-2 rounded-xl text-sm font-semibold transition-colors', tab === 'preset' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
          >
            Browse Items
          </button>
          <button
            onClick={() => setTab('custom')}
            className={cn('flex-1 py-2 rounded-xl text-sm font-semibold transition-colors', tab === 'custom' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
          >
            Custom Item
          </button>
        </div>

        {tab === 'preset' ? (
          <div className="flex flex-col flex-1 overflow-hidden px-4 pb-4 gap-3">
            {/* Search */}
            <div className="relative flex-shrink-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search all 205 items…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedCategory(null) }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category grid or item list */}
            <div ref={listRef} className="overflow-y-auto flex-1">
              {showCategoryGrid ? (
                // Category picker
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const count = categoryItemCounts[cat.id] ?? 0
                    const addedInCat = PRESET_ITEMS.filter(
                      (i) => i.category === cat.id && existingPresetIds.includes(i.id)
                    ).length
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className="flex flex-col items-start gap-1 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50 transition-all text-left"
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <p className="font-bold text-sm text-gray-900 leading-tight">{cat.name}</p>
                        <p className="text-xs text-gray-400">
                          {count} items{addedInCat > 0 ? ` · ${addedInCat} in room` : ''}
                        </p>
                      </button>
                    )
                  })}
                </div>
              ) : (
                // Item list (filtered by search or category)
                <div className="space-y-2">
                  {filtered.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm mb-3">No preset items match &ldquo;{search}&rdquo;</p>
                      <button
                        onClick={() => { setTab('custom'); setCustomName(search.trim()) }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors touch-manipulation"
                      >
                        <Plus size={15} /> Add &ldquo;{search.trim()}&rdquo; as custom item
                      </button>
                    </div>
                  ) : (
                    filtered.map((item) => {
                      const alreadyAdded = existingPresetIds.includes(item.id)
                      const wasJustAdded = justAdded === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleAddPreset(item)}
                          className={cn(
                            'w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all group touch-manipulation',
                            wasJustAdded
                              ? 'border-emerald-400 bg-emerald-100'
                              : alreadyAdded
                              ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                              : 'border-gray-100 hover:border-emerald-200 hover:bg-emerald-50'
                          )}
                        >
                          <span className="text-xl flex-shrink-0 mt-0.5">{item.image_emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-sm text-gray-900 truncate">{item.name}</p>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {wasJustAdded && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500 text-white font-semibold">Added!</span>
                                )}
                                {!wasJustAdded && alreadyAdded && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 font-semibold">in room</span>
                                )}
                                <span className={cn('text-xs px-2 py-0.5 rounded-full', {
                                  'bg-red-100 text-red-700': item.priority === 'essential',
                                  'bg-blue-100 text-blue-700': item.priority === 'recommended',
                                  'bg-gray-100 text-gray-600': item.priority === 'nice-to-have',
                                })}>
                                  {item.priority}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                            <p className="text-xs text-emerald-600 font-medium mt-1">{item.price_estimate}</p>
                          </div>
                          <Plus size={16} className="text-emerald-600 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )
                    })
                  )}
                </div>
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
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes (optional)</label>
              <textarea
                placeholder="e.g. Get the black one, size M"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
            <Button onClick={handleAddCustom} disabled={!customName.trim()} size="lg" className={cn('w-full transition-colors', customAdded && 'bg-emerald-500')}>
              {customAdded ? '✓ Added!' : 'Add to Checklist'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
