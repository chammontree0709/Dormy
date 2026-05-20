'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getItemById } from '@/data/presets'
import { buildAffiliateUrl } from '@/lib/amazon'
import Navbar from '@/components/layout/Navbar'
import { Plus, Check, ChevronDown, ShoppingCart } from 'lucide-react'

interface Room {
  id: string
  name: string
}

const LOOKS = [
  {
    id: 'minimal',
    title: 'Clean & Minimal',
    vibe: 'Neutral tones, no clutter',
    gradient: 'from-slate-200 to-slate-100',
    image: 'https://images.unsplash.com/photo-1646335734996-58f1ed91bdb4?auto=format&fit=crop&w=600&q=80',
    itemIds: ['twin-xl-sheets', 'mattress-topper', 'desk-lamp', 'under-bed-storage', 'command-strips', 'desk-organizer'],
  },
  {
    id: 'cozy',
    title: 'Cozy & Warm',
    vibe: 'String lights, soft textures',
    gradient: 'from-amber-200 to-orange-100',
    image: 'https://images.unsplash.com/photo-1541004995602-b3e898709909?auto=format&fit=crop&w=600&q=80',
    itemIds: ['fairy-lights', 'area-rug', 'comforter', 'electric-kettle', 'coffee-maker', 'pillow'],
  },
  {
    id: 'study',
    title: 'Study Grind',
    vibe: 'Built for long focus sessions',
    gradient: 'from-emerald-200 to-blue-100',
    image: 'https://images.unsplash.com/photo-1486304873000-235643847519?auto=format&fit=crop&w=600&q=80',
    itemIds: ['desk-lamp', 'laptop-stand', 'monitor', 'noise-cancelling-headphones', 'whiteboard', 'planner'],
  },
  {
    id: 'storage',
    title: 'Small Space Pro',
    vibe: 'Every inch maximized',
    gradient: 'from-emerald-200 to-teal-100',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
    itemIds: ['over-door-hooks', 'under-bed-storage', 'closet-organizer', 'command-strips', 'desk-organizer', 'packing-cubes'],
  },
  {
    id: 'tech',
    title: 'Tech Setup',
    vibe: 'Gaming, streaming, vibing',
    gradient: 'from-emerald-200 to-zinc-100',
    image: 'https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?auto=format&fit=crop&w=600&q=80',
    itemIds: ['surge-protector', 'monitor', 'gaming-headset', 'bluetooth-speaker', 'streaming-stick', 'portable-charger'],
  },
  {
    id: 'plants',
    title: 'Plant Parent',
    vibe: 'Greenery makes it feel like home',
    gradient: 'from-green-200 to-lime-100',
    image: 'https://images.unsplash.com/photo-1611866972879-3f7c79e1282d?auto=format&fit=crop&w=600&q=80',
    itemIds: ['succulent-set', 'pothos-plant', 'plant-pots', 'fairy-lights', 'area-rug', 'reusable-water-bottle'],
  },
]

export default function InspoPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [showRoomPicker, setShowRoomPicker] = useState(false)
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set())
  const [addingItem, setAddingItem] = useState<string | null>(null)
  const [currentUserName, setCurrentUserName] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setCurrentUserName(user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'You')

      const { data: memberRows } = await supabase
        .from('room_members')
        .select('room_id')
        .eq('user_id', user.id)

      if (!memberRows?.length) return

      const roomIds = memberRows.map((r) => r.room_id)
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
    if (!selectedRoomId) {
      setShowRoomPicker(true)
      return
    }
    const key = `${selectedRoomId}:${itemId}`
    if (addedItems.has(key)) return

    setAddingItem(itemId)
    const item = getItemById(itemId)

    await supabase.from('room_items').insert({
      room_id: selectedRoomId,
      preset_id: itemId,
      custom_name: null,
      custom_url: null,
      category: item?.category ?? 'storage',
      added_by_name: currentUserName,
      notes: null,
    })

    setAddedItems((prev) => new Set(prev).add(key))
    setAddingItem(null)
  }

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="border-b border-zinc-200 pb-8 mb-8">
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">Room vibes</p>
          <h1
            className="text-3xl font-bold italic text-zinc-950 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Dorm Inspo
          </h1>
          <p className="text-zinc-500 mt-1">Find your vibe. Tap <strong>+</strong> to add items straight to your room.</p>
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

        {/* Look cards */}
        <div className="space-y-8">
          {LOOKS.map((look) => {
            const items = look.itemIds.map(getItemById).filter(Boolean)
            return (
              <div key={look.id} className="bg-white rounded-3xl border border-zinc-200 overflow-hidden">
                {/* Image */}
                <div className={`relative h-52 bg-gradient-to-br ${look.gradient} overflow-hidden`}>
                  <img
                    src={look.image}
                    alt={look.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <h2
                      className="text-xl font-bold italic text-white leading-tight mb-0.5"
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {look.title}
                    </h2>
                    <p className="text-sm text-white/75">{look.vibe}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 space-y-2">
                  {items.map((item) => {
                    if (!item) return null
                    const key = `${selectedRoomId}:${item.id}`
                    const isAdded = addedItems.has(key)
                    const isLoading = addingItem === item.id
                    const buyUrl = buildAffiliateUrl(item.amazon_url)

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-zinc-300 hover:bg-white transition-all"
                      >
                        <span className="text-xl flex-shrink-0">{item.image_emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-zinc-950 truncate">{item.name}</p>
                          <p className="text-xs text-zinc-400">{item.price_estimate}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a
                            href={buyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Buy on Amazon"
                          >
                            <ShoppingCart size={15} />
                          </a>
                          <button
                            onClick={() => addToRoom(item.id)}
                            disabled={isAdded || isLoading || rooms.length === 0}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isAdded
                                ? 'bg-emerald-100 text-emerald-700'
                                : rooms.length === 0
                                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                                : 'bg-zinc-950 text-white hover:bg-zinc-800 active:scale-[0.98]'
                            }`}
                          >
                            {isAdded ? (
                              <><Check size={12} /> Added</>
                            ) : (
                              <><Plus size={12} /> Add</>
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
