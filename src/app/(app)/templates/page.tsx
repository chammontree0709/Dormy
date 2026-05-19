'use client'

import { useState } from 'react'
import { PRESET_LISTS, PRESET_ITEMS, CATEGORIES, getItemById } from '@/data/presets'
import { buildAffiliateUrl } from '@/lib/amazon'
import Navbar from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import { ShoppingCart, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TemplatesPage() {
  const [selectedList, setSelectedList] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const displayItems = selectedList
    ? (PRESET_LISTS.find((l) => l.id === selectedList)?.itemIds.map((id) => getItemById(id)).filter(Boolean) ?? [])
    : selectedCategory
    ? PRESET_ITEMS.filter((i) => i.category === selectedCategory)
    : PRESET_ITEMS

  function toggleExpand(id: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Dorm Checklists</h1>
          <p className="text-gray-500 mt-1">Curated lists of everything you need. Click any item to buy.</p>
        </div>

        {/* Preset list packs */}
        <h2 className="font-black text-xl text-gray-900 mb-4">Starter Packs</h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {PRESET_LISTS.map((list) => (
            <button
              key={list.id}
              onClick={() => { setSelectedList(selectedList === list.id ? null : list.id); setSelectedCategory(null) }}
              className={cn(
                'text-left p-4 rounded-2xl border-2 transition-all',
                selectedList === list.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/50'
              )}
            >
              <p className="text-2xl mb-2">{list.emoji}</p>
              <p className="font-bold text-gray-900 text-sm">{list.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{list.itemIds.length} items</p>
            </button>
          ))}
        </div>

        {/* Category filter */}
        <h2 className="font-black text-xl text-gray-900 mb-4">Browse by Category</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
          <button
            onClick={() => { setSelectedCategory(null); setSelectedList(null) }}
            className={cn('flex-shrink-0 px-3 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap', !selectedCategory && !selectedList ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300')}
          >
            All Items ({PRESET_ITEMS.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = PRESET_ITEMS.filter((i) => i.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(selectedCategory === cat.id ? null : cat.id); setSelectedList(null) }}
                className={cn('flex-shrink-0 px-3 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap', selectedCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300')}
              >
                {cat.icon} {cat.name} ({count})
              </button>
            )
          })}
        </div>

        {/* Item list */}
        <div className="space-y-3">
          {(displayItems as ReturnType<typeof getItemById>[]).map((item) => {
            if (!item) return null
            const isExpanded = expandedItems.has(item.id)
            const buyUrl = buildAffiliateUrl(item.amazon_url)
            const avgRating = item.reviews.length
              ? (item.reviews.reduce((sum, r) => sum + r.rating, 0) / item.reviews.length).toFixed(1)
              : null

            return (
              <Card key={item.id} padding={false} className="overflow-hidden">
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full text-left p-4 flex items-start gap-3"
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.image_emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-sm font-semibold text-indigo-600">{item.price_estimate}</span>
                          <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', {
                            'bg-red-100 text-red-700': item.priority === 'essential',
                            'bg-blue-100 text-blue-700': item.priority === 'recommended',
                            'bg-gray-100 text-gray-600': item.priority === 'nice-to-have',
                          })}>
                            {item.priority}
                          </span>
                          {avgRating && (
                            <div className="flex items-center gap-0.5">
                              <Star size={11} className="text-amber-500 fill-amber-500" />
                              <span className="text-xs text-gray-500">{avgRating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a
                          href={buyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors"
                        >
                          <ShoppingCart size={12} /> Buy
                        </a>
                        {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </div>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{item.description}</p>

                    {item.reviews.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Student Reviews</p>
                        {item.reviews.map((review, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {review.author[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-xs font-bold text-gray-900">{review.author}</p>
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={10} className={s <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200 fill-gray-200'} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-gray-600">{review.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4">
                      <a
                        href={buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                      >
                        <ShoppingCart size={16} /> Buy on Amazon
                      </a>
                      <p className="text-center text-xs text-gray-400 mt-1.5">
                        Affiliate link — Roomd earns a small commission at no cost to you.
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        <div className="mt-8 bg-gray-100 rounded-2xl border border-dashed border-gray-300 p-6 text-center">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Sponsored</p>
          <p className="text-sm text-gray-500 mt-1">Ad space — Google AdSense goes here</p>
        </div>
      </main>
    </div>
  )
}
