'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PRESET_LISTS, PRESET_ITEMS, CATEGORIES, getItemById } from '@/data/presets'
import { buildAffiliateUrl } from '@/lib/amazon'
import Navbar from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import { ShoppingCart, Star, ChevronDown, ChevronUp, ArrowLeft, Plus, Check } from 'lucide-react'
import AdUnit from '@/components/ui/AdUnit'
import { cn } from '@/lib/utils'

interface Room {
  id: string
  name: string
}

export default function TemplatesPage() {
  const [selectedList, setSelectedList] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [showRoomPicker, setShowRoomPicker] = useState(false)
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set())
  const [addingItem, setAddingItem] = useState<string | null>(null)
  const [currentUserName, setCurrentUserName] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 })
  }, [selectedCategory, selectedList])

  // When the selected room changes, fetch which preset items are already in it
  // so Add buttons show "Added" correctly across page navigations
  useEffect(() => {
    if (!selectedRoomId) return
    supabase
      .from('room_items')
      .select('preset_id')
      .eq('room_id', selectedRoomId)
      .not('preset_id', 'is', null)
      .then(({ data }) => {
        if (data) {
          setAddedItems(new Set(data.map((r) => `${selectedRoomId}:${r.preset_id}`)))
        }
      })
  }, [selectedRoomId])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setCurrentUserName(user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'You')

      const { data: memberRows } = await supabase
        .from('room_members')
        .select('room_id')
        .eq('user_id', user.id)

      const roomIds = (memberRows ?? []).map((r) => r.room_id)
      if (!roomIds.length) return

      const { data: roomRows } = await supabase
        .from('rooms')
        .select('id, name')
        .in('id', roomIds)
        .order('created_at', { ascending: false })

      if (roomRows?.length) {
        setRooms(roomRows)
        setSelectedRoomId(roomRows[0].id)
      }
    }
    load()
  }, [])

  async function addToRoom(itemId: string) {
    if (!selectedRoomId) { setShowRoomPicker(true); return }
    const key = `${selectedRoomId}:${itemId}`
    if (addedItems.has(key)) return

    setAddingItem(itemId)
    const item = getItemById(itemId)

    await supabase.from('room_items').insert({
      room_id: selectedRoomId,
      preset_id: itemId,
      custom_name: null,
      custom_url: null,
      category: item?.category ?? 'other',
      added_by_name: currentUserName,
      notes: null,
    })

    setAddedItems((prev) => new Set(prev).add(key))
    setAddingItem(null)
  }

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

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="border-b border-zinc-200 pb-8 mb-8">
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">Curated lists</p>
          <h1
            className="text-3xl font-bold italic text-zinc-950 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Dorm Checklists
          </h1>
          <p className="text-zinc-500 mt-1">Curated lists of everything you need. Tap <strong>+</strong> to add straight to your room.</p>
        </div>

        {/* Room selector */}
        <div className="mb-8 relative">
          {rooms.length === 0 ? (
            <p className="text-sm text-zinc-400 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
              No rooms yet — <a href="/dashboard" className="text-emerald-600 font-semibold hover:underline">create one</a> to start adding items.
            </p>
          ) : (
            <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
              <span className="text-sm text-zinc-500 font-medium whitespace-nowrap">Adding to:</span>
              <button
                onClick={() => setShowRoomPicker((v) => !v)}
                className="flex items-center gap-2 text-sm font-bold text-zinc-950 hover:text-emerald-600 transition-colors"
              >
                {selectedRoom?.name ?? 'Pick a room'}
                <ChevronDown size={14} />
              </button>
              {showRoomPicker && (
                <div className="absolute top-14 left-0 bg-white border border-zinc-200 rounded-xl shadow-lg z-20 min-w-[200px] overflow-hidden">
                  {rooms.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => { setSelectedRoomId(r.id); setShowRoomPicker(false) }}
                      className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-zinc-50 transition-colors ${r.id === selectedRoomId ? 'text-emerald-600 bg-emerald-50/50' : 'text-zinc-800'}`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Starter Packs */}
        <h2 className="font-bold text-sm tracking-widest text-zinc-400 uppercase mb-4">Starter Packs</h2>
        <div className="grid grid-cols-2 gap-3 mb-10">
          {PRESET_LISTS.map((list) => (
            <button
              key={list.id}
              onClick={() => { setSelectedList(selectedList === list.id ? null : list.id); setSelectedCategory(null) }}
              className={cn(
                'text-left p-4 rounded-2xl border transition-all',
                selectedList === list.id
                  ? 'border-zinc-950 bg-zinc-950 text-white'
                  : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50'
              )}
            >
              <p className={cn('font-bold text-sm', selectedList === list.id ? 'text-white' : 'text-zinc-950')}>{list.name}</p>
              <p className={cn('text-xs mt-0.5', selectedList === list.id ? 'text-zinc-400' : 'text-zinc-400')}>{list.itemIds.length} items</p>
            </button>
          ))}
        </div>

        {/* Category browser */}
        <div className="flex items-center justify-between mb-4">
          {selectedCategory ? (
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-950 font-bold text-xl"
            >
              <ArrowLeft size={20} />
              {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
            </button>
          ) : (
            <h2 className="font-bold text-sm tracking-widest text-zinc-400 uppercase">
              {selectedList ? PRESET_LISTS.find((l) => l.id === selectedList)?.name : 'Browse by Category'}
            </h2>
          )}
          {(selectedCategory || selectedList) && (
            <button
              onClick={() => { setSelectedCategory(null); setSelectedList(null) }}
              className="text-xs text-zinc-400 font-semibold hover:text-zinc-950 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category grid */}
        {!selectedCategory && !selectedList && (
          <div className="grid grid-cols-2 gap-3 mb-8">
            {CATEGORIES.map((cat) => {
              const count = PRESET_ITEMS.filter((i) => i.category === cat.id).length
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex flex-col items-start gap-1 p-4 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50 transition-all text-left"
                >
                  <p className="font-bold text-zinc-950 text-sm leading-tight">{cat.name}</p>
                  <p className="text-xs text-zinc-400">{count} items</p>
                </button>
              )
            })}
          </div>
        )}

        {/* Item list */}
        {(selectedCategory || selectedList) && (
        <div ref={listRef} className="space-y-3">
          {(displayItems as ReturnType<typeof getItemById>[]).map((item) => {
            if (!item) return null
            const isExpanded = expandedItems.has(item.id)
            const buyUrl = buildAffiliateUrl(item.amazon_url)
            const avgRating = item.reviews.length
              ? (item.reviews.reduce((sum, r) => sum + r.rating, 0) / item.reviews.length).toFixed(1)
              : null
            const key = `${selectedRoomId}:${item.id}`
            const isAdded = addedItems.has(key)
            const isLoading = addingItem === item.id

            return (
              <Card key={item.id} padding={false} className="overflow-hidden">
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full text-left p-4 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-zinc-950 text-sm">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-sm font-semibold text-emerald-600">{item.price_estimate}</span>
                          <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', {
                            'bg-red-100 text-red-700': item.priority === 'essential',
                            'bg-blue-100 text-blue-700': item.priority === 'recommended',
                            'bg-zinc-100 text-zinc-600': item.priority === 'nice-to-have',
                          })}>
                            {item.priority}
                          </span>
                          {avgRating && (
                            <div className="flex items-center gap-0.5">
                              <Star size={11} className="text-amber-500 fill-amber-500" />
                              <span className="text-xs text-zinc-500">{avgRating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); addToRoom(item.id) }}
                          disabled={isAdded || isLoading || rooms.length === 0}
                          className={cn(
                            'flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98]',
                            isAdded
                              ? 'bg-emerald-100 text-emerald-700'
                              : rooms.length === 0
                              ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                              : 'bg-zinc-950 text-white hover:bg-zinc-800'
                          )}
                        >
                          {isAdded ? <><Check size={12} /> Added</> : <><Plus size={12} /> Add</>}
                        </button>
                        <a
                          href={buyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors"
                        >
                          <ShoppingCart size={12} /> Buy
                        </a>
                        {isExpanded
                          ? <ChevronUp size={16} className="text-zinc-400" />
                          : <ChevronDown size={16} className="text-zinc-400" />
                        }
                      </div>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-zinc-100 pt-4">
                    <p className="text-sm text-zinc-600 leading-relaxed mb-4">{item.description}</p>

                    {item.reviews.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Student Reviews</p>
                        {item.reviews.map((review, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-7 h-7 rounded-full bg-zinc-100 text-zinc-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {review.author[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-xs font-bold text-zinc-950">{review.author}</p>
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={10} className={s <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-200 fill-zinc-200'} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-zinc-600">{review.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => addToRoom(item.id)}
                        disabled={isAdded || isLoading || rooms.length === 0}
                        className={cn(
                          'flex items-center justify-center gap-2 w-full font-bold py-3 rounded-xl transition-colors text-sm active:scale-[0.98]',
                          isAdded
                            ? 'bg-emerald-100 text-emerald-700'
                            : rooms.length === 0
                            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                            : 'bg-zinc-950 text-white hover:bg-zinc-800'
                        )}
                      >
                        {isAdded ? <><Check size={16} /> Added to room</> : <><Plus size={16} /> Add to my room</>}
                      </button>
                      <a
                        href={buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                      >
                        <ShoppingCart size={16} /> Buy on Amazon
                      </a>
                      <p className="text-center text-xs text-zinc-400">
                        Affiliate link — Roomd earns a small commission at no cost to you.
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
        )}

        <div className="mt-8">
          <AdUnit slot="XXXXXXXXXX" />
        </div>
      </main>
    </div>
  )
}
