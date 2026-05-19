'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Room, RoomItem, RoomMember } from '@/types'
import { CATEGORIES, getCategoryById } from '@/data/presets'
import Navbar from '@/components/layout/Navbar'
import ChecklistItem from '@/components/checklist/ChecklistItem'
import AddItemModal from '@/components/room/AddItemModal'
import InviteModal from '@/components/room/InviteModal'
import Button from '@/components/ui/Button'
import { Plus, Users, ChevronDown, ChevronUp, LayoutTemplate } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [room, setRoom] = useState<Room | null>(null)
  const [items, setItems] = useState<RoomItem[]>([])
  const [members, setMembers] = useState<RoomMember[]>([])
  const [currentUserName, setCurrentUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  const supabase = createClient()

  const loadRoom = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setCurrentUserName(user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'You')

    const [{ data: roomData }, { data: itemData }, { data: memberData }] = await Promise.all([
      supabase.from('rooms').select('*').eq('id', id).single(),
      supabase.from('room_items').select('*').eq('room_id', id).order('added_at'),
      supabase.from('room_members').select('*').eq('room_id', id),
    ])

    setRoom(roomData)
    setItems(itemData ?? [])
    setMembers(memberData ?? [])
    setLoading(false)
  }, [id])

  useEffect(() => {
    loadRoom()

    const channel = supabase
      .channel(`room-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_items', filter: `room_id=eq.${id}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setItems((prev) => [...prev, payload.new as RoomItem])
        } else if (payload.eventType === 'UPDATE') {
          setItems((prev) => prev.map((item) => item.id === payload.new.id ? payload.new as RoomItem : item))
        } else if (payload.eventType === 'DELETE') {
          setItems((prev) => prev.filter((item) => item.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id, loadRoom])

  async function toggleItem(itemId: string, checked: boolean) {
    const now = new Date().toISOString()
    await supabase.from('room_items').update({
      is_checked: checked,
      checked_by_name: checked ? currentUserName : null,
      checked_at: checked ? now : null,
    }).eq('id', itemId)
  }

  async function deleteItem(itemId: string) {
    await supabase.from('room_items').delete().eq('id', itemId)
  }

  async function addItem(
    presetId: string | null,
    customName?: string,
    customUrl?: string,
    category?: string,
    notes?: string
  ) {
    await supabase.from('room_items').insert({
      room_id: id,
      preset_id: presetId,
      custom_name: customName ?? null,
      custom_url: customUrl ?? null,
      category: category ?? 'storage',
      added_by_name: currentUserName,
      notes: notes ?? null,
    })
  }

  const groupedItems = CATEGORIES.map((cat) => ({
    category: cat,
    items: items.filter((item) => item.category === cat.id),
  })).filter((g) => g.items.length > 0)

  const uncategorized = items.filter((item) => !CATEGORIES.find((c) => c.id === item.category))
  if (uncategorized.length > 0) {
    groupedItems.push({ category: { id: 'other', name: 'Other', icon: '📋', description: '' }, items: uncategorized })
  }

  const totalItems = items.length
  const checkedItems = items.filter((i) => i.is_checked).length
  const progressPct = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0

  function toggleCategory(catId: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev)
      next.has(catId) ? next.delete(catId) : next.add(catId)
      return next
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Room not found</p>
          <p className="text-gray-500 mb-6">This room doesn&apos;t exist or you don&apos;t have access.</p>
          <Link href="/dashboard"><Button>Back to Dashboard</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar roomName={room.name} roomId={id} />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Room header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">{room.name}</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex -space-x-1">
                  {members.slice(0, 4).map((m) => (
                    <div key={m.user_id} className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-700">
                      {m.display_name[0].toUpperCase()}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {members.map((m) => m.display_name).join(', ')}
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setShowInvite(true)}>
              <Users size={14} className="mr-1" /> Invite
            </Button>
          </div>

          {totalItems > 0 && (
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
                <span>{checkedItems} of {totalItems} items bought</span>
                <span className="text-indigo-600">{progressPct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <Button onClick={() => setShowAdd(true)} className="flex-1 sm:flex-none">
            <Plus size={16} className="mr-1.5" /> Add Item
          </Button>
          <Link href="/templates">
            <Button variant="secondary">
              <LayoutTemplate size={16} className="mr-1.5" /> Templates
            </Button>
          </Link>
        </div>

        {/* Checklist */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="font-bold text-gray-900 text-xl mb-2">Your checklist is empty</h2>
            <p className="text-gray-500 text-sm mb-6">Add items from our preset lists or create your own.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => setShowAdd(true)}><Plus size={16} className="mr-1.5" /> Add from presets</Button>
              <Link href="/templates"><Button variant="secondary">Browse templates</Button></Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedItems.map(({ category, items: catItems }) => {
              const isCollapsed = collapsedCategories.has(category.id)
              const doneCount = catItems.filter((i) => i.is_checked).length

              return (
                <div key={category.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-bold text-gray-900">{category.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
                        {doneCount}/{catItems.length}
                      </span>
                    </div>
                    {isCollapsed ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
                  </button>

                  {!isCollapsed && (
                    <div className="px-4 pb-4 space-y-2">
                      {catItems.map((item) => (
                        <ChecklistItem
                          key={item.id}
                          item={item}
                          onToggle={toggleItem}
                          onDelete={deleteItem}
                          currentUserName={currentUserName}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Ad banner — placeholder for Google AdSense */}
        <div className="mt-8 bg-gray-100 rounded-2xl border border-dashed border-gray-300 p-6 text-center">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Sponsored</p>
          <p className="text-sm text-gray-500 mt-1">Ad space — Google AdSense goes here</p>
        </div>
      </main>

      {showAdd && (
        <AddItemModal
          existingPresetIds={items.filter((i) => i.preset_id).map((i) => i.preset_id!)}
          onAdd={addItem}
          onClose={() => setShowAdd(false)}
        />
      )}

      {showInvite && room && (
        <InviteModal
          inviteCode={room.invite_code}
          roomName={room.name}
          members={members}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  )
}
