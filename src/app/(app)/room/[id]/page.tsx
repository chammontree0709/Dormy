'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Room, RoomItem, RoomMember, ItemClaim } from '@/types'
import { CATEGORIES, getItemById } from '@/data/presets'
import Navbar from '@/components/layout/Navbar'
import ChecklistItem from '@/components/checklist/ChecklistItem'
import AddItemModal from '@/components/room/AddItemModal'
import InviteModal from '@/components/room/InviteModal'
import Button from '@/components/ui/Button'
import AdUnit from '@/components/ui/AdUnit'
import Link from 'next/link'
import { use } from 'react'
import {
  Plus, Users, ChevronDown, ChevronUp, LayoutTemplate,
  ShoppingCart, X, CalendarDays, DollarSign, Activity,
  PartyPopper, ClipboardList,
} from 'lucide-react'

interface ActivityEvent {
  id: string
  user_name: string
  action: string
  item_name: string | null
  created_at: string
}

function parseLowPrice(str: string): number {
  const match = str.match(/\$(\d+)/)
  return match ? parseInt(match[1]) : 0
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / 86400000)
}

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [room, setRoom] = useState<Room | null>(null)
  const [items, setItems] = useState<RoomItem[]>([])
  const [members, setMembers] = useState<RoomMember[]>([])
  const [currentUserName, setCurrentUserName] = useState('')
  const [currentUserId, setCurrentUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  const [activity, setActivity] = useState<ActivityEvent[]>([])
  const [showActivity, setShowActivity] = useState(false)

  // Feature states
  const [shoppingMode, setShoppingMode] = useState(false)
  const [budget, setBudget] = useState<number | null>(null)
  const [moveInDate, setMoveInDate] = useState('')
  const [showBudgetInput, setShowBudgetInput] = useState(false)
  const [showDateInput, setShowDateInput] = useState(false)
  const [budgetDraft, setBudgetDraft] = useState('')
  const [dateDraft, setDateDraft] = useState('')

  const supabase = createClient()

  // Reset iOS Safari zoom when entering/exiting shopping mode
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]')
    if (!viewport) return
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1')
    const t = setTimeout(() => {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1')
    }, 300)
    return () => clearTimeout(t)
  }, [shoppingMode])

  // Load localStorage prefs
  useEffect(() => {
    const savedBudget = localStorage.getItem(`roomd-budget-${id}`)
    const savedDate = localStorage.getItem(`roomd-movein-${id}`)
    if (savedBudget) setBudget(parseInt(savedBudget))
    if (savedDate) setMoveInDate(savedDate)
  }, [id])

  const loadRoom = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const displayName = user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'You'
    setCurrentUserName(displayName)
    setCurrentUserId(user.id)

    const [{ data: roomData }, { data: itemData }, { data: memberData }] = await Promise.all([
      supabase.from('rooms').select('*').eq('id', id).single(),
      supabase.from('room_items').select('*, claims:room_item_claims(*)').eq('room_id', id).order('added_at'),
      supabase.from('room_members').select('*').eq('room_id', id),
    ])

    setRoom(roomData)
    setMembers(memberData ?? [])

    // Self-heal: if this user created the room but has no room_members row (iOS creation
    // bug), room_items RLS will silently block every insert. Fix membership now using the
    // RPC (security-definer, idempotent ON CONFLICT) then re-fetch items.
    const isMember = (memberData ?? []).some((m) => m.user_id === user.id)
    if (!isMember && roomData?.created_by === user.id) {
      await supabase.rpc('join_room_by_invite_code', {
        p_invite_code: roomData.invite_code,
        p_display_name: displayName,
      })
      const { data: fixedItems } = await supabase
        .from('room_items').select('*, claims:room_item_claims(*)').eq('room_id', id).order('added_at')
      setItems(fixedItems ?? [])
      setMembers((prev) => [
        ...prev,
        { room_id: id, user_id: user.id, display_name: displayName, joined_at: new Date().toISOString() },
      ])
    } else {
      setItems(itemData ?? [])
    }

    const { data: activityData } = await supabase
      .from('room_activity')
      .select('*')
      .eq('room_id', id)
      .order('created_at', { ascending: false })
      .limit(20)
    setActivity(activityData ?? [])

    setLoading(false)
  }, [id])

  useEffect(() => {
    loadRoom()

    const channel = supabase
      .channel(`room-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_items', filter: `room_id=eq.${id}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setItems((prev) =>
            prev.some((i) => i.id === (payload.new as RoomItem).id)
              ? prev
              : [...prev, { ...(payload.new as RoomItem), claims: [] }]
          )
        } else if (payload.eventType === 'UPDATE') {
          setItems((prev) => prev.map((item) =>
            item.id === payload.new.id
              ? { ...(payload.new as RoomItem), claims: item.claims ?? [] }
              : item
          ))
        } else if (payload.eventType === 'DELETE') {
          setItems((prev) => prev.filter((item) => item.id !== payload.old.id))
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_item_claims', filter: `room_id=eq.${id}` }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const claim = payload.new as ItemClaim
          setItems((prev) => prev.map((item) =>
            item.id === claim.item_id
              ? { ...item, claims: [...(item.claims ?? []).filter(c => c.user_id !== claim.user_id), claim] }
              : item
          ))
        } else if (payload.eventType === 'DELETE') {
          const old = payload.old as Partial<ItemClaim>
          setItems((prev) => prev.map((item) =>
            item.id === old.item_id
              ? { ...item, claims: (item.claims ?? []).filter(c => c.id !== old.id) }
              : item
          ))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id, loadRoom])

  function logActivity(action: string, itemName: string) {
    const event: ActivityEvent = {
      id: crypto.randomUUID(),
      user_name: currentUserName,
      action,
      item_name: itemName,
      created_at: new Date().toISOString(),
    }
    setActivity((prev) => [event, ...prev].slice(0, 20))
    supabase.from('room_activity').insert({
      room_id: id,
      user_name: currentUserName,
      action,
      item_name: itemName,
    }).then(() => {})
  }

  function getItemName(itemId: string) {
    const item = items.find((i) => i.id === itemId)
    if (!item) return 'item'
    const preset = item.preset_id ? getItemById(item.preset_id) : null
    return preset?.name ?? item.custom_name ?? 'item'
  }

  async function toggleItem(itemId: string, checked: boolean) {
    const now = new Date().toISOString()
    setItems((prev) => prev.map((item) =>
      item.id === itemId
        ? { ...item, is_checked: checked, checked_by_name: checked ? currentUserName : null, checked_at: checked ? now : null }
        : item
    ))
    supabase.from('room_items').update({
      is_checked: checked,
      checked_by_name: checked ? currentUserName : null,
      checked_at: checked ? now : null,
    }).eq('id', itemId).then(() => {})
    logActivity(checked ? 'bought' : 'unchecked', getItemName(itemId))
  }

  async function deleteItem(itemId: string) {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
    supabase.from('room_items').delete().eq('id', itemId).then(() => {})
  }

  async function claimItem(itemId: string, claim: boolean) {
    const now = new Date().toISOString()
    setItems((prev) => prev.map((item) =>
      item.id === itemId
        ? { ...item, claimed_by_name: claim ? currentUserName : null, claimed_at: claim ? now : null }
        : item
    ))
    supabase.from('room_items').update({
      claimed_by_name: claim ? currentUserName : null,
      claimed_at: claim ? now : null,
    }).eq('id', itemId).then(() => {})
    if (claim) logActivity("claimed — I'll buy this", getItemName(itemId))
  }

  async function upsertClaim(itemId: string, quantity: number, splittingCost: boolean) {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    if (quantity <= 0 && !splittingCost) {
      // Remove claim entirely
      setItems((prev) => prev.map((i) =>
        i.id === itemId
          ? { ...i, claims: (i.claims ?? []).filter(c => c.user_id !== currentUserId) }
          : i
      ))
      supabase.from('room_item_claims').delete()
        .eq('item_id', itemId).eq('user_id', currentUserId).then(() => {})
      return
    }
    const optimistic: ItemClaim = {
      id: (item.claims ?? []).find(c => c.user_id === currentUserId)?.id ?? crypto.randomUUID(),
      item_id: itemId,
      room_id: id,
      user_id: currentUserId,
      display_name: currentUserName,
      quantity: Math.max(0, quantity),
      splitting_cost: splittingCost,
      created_at: new Date().toISOString(),
    }
    setItems((prev) => prev.map((i) =>
      i.id === itemId
        ? { ...i, claims: [...(i.claims ?? []).filter(c => c.user_id !== currentUserId), optimistic] }
        : i
    ))
    supabase.from('room_item_claims').upsert({
      item_id: itemId,
      room_id: id,
      user_id: currentUserId,
      display_name: currentUserName,
      quantity: Math.max(0, quantity),
      splitting_cost: splittingCost,
    }, { onConflict: 'item_id,user_id' }).then(() => {})
    if (quantity > 0) logActivity(`claimed ${quantity > 1 ? `×${quantity}` : "— buying this"}`, getItemName(itemId))
  }

  async function updateOwned(itemId: string, owned: boolean) {
    setItems((prev) => prev.map((item) =>
      item.id === itemId ? { ...item, owned } : item
    ))
    supabase.from('room_items').update({ owned }).eq('id', itemId).then(() => {})
    logActivity(owned ? 'bringing from home' : 'removed from home', getItemName(itemId))
  }

  async function updateQuantity(itemId: string, quantity: number) {
    setItems((prev) => prev.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    ))
    supabase.from('room_items').update({ quantity }).eq('id', itemId).then(() => {})
  }

  async function updateNote(itemId: string, note: string) {
    setItems((prev) => prev.map((item) =>
      item.id === itemId ? { ...item, notes: note || null } : item
    ))
    supabase.from('room_items').update({ notes: note || null }).eq('id', itemId).then(() => {})
  }

  async function addItem(
    presetId: string | null,
    customName?: string,
    customUrl?: string,
    category?: string,
    notes?: string
  ) {
    const tempId = crypto.randomUUID()
    const now = new Date().toISOString()
    const optimistic: RoomItem = {
      id: tempId,
      room_id: id,
      preset_id: presetId ?? null,
      custom_name: customName ?? null,
      custom_url: customUrl ?? null,
      category: category ?? 'storage',
      is_checked: false,
      checked_by_name: null,
      checked_at: null,
      claimed_by_name: null,
      claimed_at: null,
      added_by_name: currentUserName,
      added_at: now,
      notes: notes ?? null,
      quantity: 1,
      owned: false,
      sort_order: 0,
      claims: [],
    }
    setItems((prev) => [...prev, optimistic])

    const { data, error } = await supabase
      .from('room_items')
      .insert({
        room_id: id,
        preset_id: presetId,
        custom_name: customName ?? null,
        custom_url: customUrl ?? null,
        category: category ?? 'storage',
        added_by_name: currentUserName,
        notes: notes ?? null,
      })
      .select()
      .single()

    if (error) {
      setItems((prev) => prev.filter((item) => item.id !== tempId))
      return
    }

    // Replace optimistic placeholder with real DB row; realtime INSERT is deduped above
    setItems((prev) => prev.map((item) => item.id === tempId ? data as RoomItem : item))
  }

  function saveBudget() {
    const n = parseInt(budgetDraft)
    if (!isNaN(n) && n > 0) {
      setBudget(n)
      localStorage.setItem(`roomd-budget-${id}`, String(n))
    }
    setShowBudgetInput(false)
  }

  function saveMoveInDate() {
    setMoveInDate(dateDraft)
    localStorage.setItem(`roomd-movein-${id}`, dateDraft)
    setShowDateInput(false)
  }

  // Computed values
  const estimatedTotal = items.reduce((sum, item) => {
    const preset = item.preset_id ? getItemById(item.preset_id) : null
    return sum + (preset ? parseLowPrice(preset.price_estimate) : 0)
  }, 0)

  const days = moveInDate ? daysUntil(moveInDate) : null

  const groupedItems = CATEGORIES.map((cat) => ({
    category: cat,
    items: items.filter((item) => item.category === cat.id),
  })).filter((g) => g.items.length > 0)

  const uncategorized = items.filter((item) => !CATEGORIES.find((c) => c.id === item.category))
  if (uncategorized.length > 0) {
    groupedItems.push({ category: { id: 'other', name: 'Other', icon: '', description: '' }, items: uncategorized })
  }

  const totalItems = items.length
  const checkedItems = items.filter((i) => i.is_checked).length
  const progressPct = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0
  const uncheckedItems = items.filter((i) => !i.is_checked)

  function toggleCategory(catId: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev)
      next.has(catId) ? next.delete(catId) : next.add(catId)
      return next
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-white rounded-2xl border border-zinc-100 animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-2xl font-bold text-zinc-950 mb-2">Room not found</p>
          <p className="text-zinc-500 mb-6">This room doesn&apos;t exist or you don&apos;t have access.</p>
          <Link href="/dashboard"><Button>Back to Dashboard</Button></Link>
        </div>
      </div>
    )
  }

  // ── Shopping Mode ──────────────────────────────────────────────
  if (shoppingMode) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 bg-zinc-950 z-40 px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-white" />
            <span className="font-bold text-white text-sm">Shopping Mode</span>
            <span className="text-emerald-300 text-xs ml-1">{checkedItems}/{totalItems} bought</span>
          </div>
          <button
            onClick={() => setShoppingMode(false)}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors touch-manipulation"
          >
            <X size={16} /> Exit
          </button>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
          {uncheckedItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <PartyPopper size={32} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-zinc-950">All done!</p>
              <p className="text-zinc-500 mt-2 mb-6">Everything on your list has been bought.</p>
              <button onClick={() => setShoppingMode(false)} className="bg-zinc-950 text-white font-bold px-6 py-3 rounded-2xl hover:bg-zinc-800">
                Back to room
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                {uncheckedItems.length} item{uncheckedItems.length !== 1 ? 's' : ''} left
              </p>
              {uncheckedItems.map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  roomId={id}
                  onToggle={toggleItem}
                  onDelete={deleteItem}
                  onClaim={claimItem}
                  onQuantityChange={updateQuantity}
                  onNoteChange={updateNote}
                  onOwnedChange={updateOwned}
                  onClaimChange={upsertClaim}
                  currentUserName={currentUserName}
                  currentUserId={currentUserId}
                  shoppingMode
                />
              ))}
            </>
          )}
        </div>
      </div>
    )
  }

  // ── Normal View ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <Navbar roomName={room.name} roomId={id} />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Room header */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-5 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-zinc-950">{room.name}</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex -space-x-1">
                  {members.slice(0, 4).map((m) => (
                    <div key={m.user_id} className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs font-bold text-emerald-700">
                      {m.display_name[0].toUpperCase()}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-500">{members.map((m) => m.display_name).join(', ')}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setShowInvite(true)}>
              <Users size={14} className="mr-1" /> Invite
            </Button>
          </div>

          {/* Progress */}
          {totalItems > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1.5">
                <span>{checkedItems} of {totalItems} items bought</span>
                <span className="text-emerald-600">{progressPct}%</span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          )}

          {/* Budget + Move-in row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {/* Budget */}
            {showBudgetInput ? (
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 text-sm">$</span>
                <input
                  autoFocus
                  type="number"
                  value={budgetDraft}
                  onChange={(e) => setBudgetDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveBudget()}
                  placeholder="e.g. 600"
                  className="w-24 text-sm border border-emerald-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
                <button onClick={saveBudget} className="text-xs font-bold text-emerald-600 hover:underline">Save</button>
                <button onClick={() => setShowBudgetInput(false)} className="text-xs text-zinc-400 hover:underline">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => { setBudgetDraft(budget ? String(budget) : ''); setShowBudgetInput(true) }}
                className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-emerald-600 transition-colors group"
              >
                <DollarSign size={14} className="text-zinc-400 group-hover:text-emerald-500" />
                {budget ? (
                  <span>
                    <span className={estimatedTotal > budget ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
                      ~${estimatedTotal}
                    </span>
                    <span className="text-zinc-400"> / ${budget} budget</span>
                  </span>
                ) : estimatedTotal > 0 ? (
                  <span className="text-zinc-500">~${estimatedTotal} est. · <span className="text-emerald-500 font-semibold">set budget</span></span>
                ) : (
                  <span className="text-zinc-400">Set a budget</span>
                )}
              </button>
            )}

            {/* Move-in countdown */}
            {showDateInput ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="date"
                  value={dateDraft}
                  onChange={(e) => setDateDraft(e.target.value)}
                  className="text-sm border border-emerald-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
                <button onClick={saveMoveInDate} className="text-xs font-bold text-emerald-600 hover:underline">Save</button>
                <button onClick={() => setShowDateInput(false)} className="text-xs text-zinc-400 hover:underline">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => { setDateDraft(moveInDate); setShowDateInput(true) }}
                className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-emerald-600 transition-colors group"
              >
                <CalendarDays size={14} className="text-zinc-400 group-hover:text-emerald-500" />
                {days !== null ? (
                  days > 0
                    ? <span><span className="font-bold text-emerald-600">{days} days</span> until move-in</span>
                    : days === 0
                    ? <span className="font-bold text-emerald-600">Move-in day!</span>
                    : <span className="text-zinc-400">Move-in was {Math.abs(days)}d ago · <span className="text-emerald-500">update</span></span>
                ) : (
                  <span className="text-zinc-400">Set move-in date</span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <Button onClick={() => setShowAdd(true)} className="flex-1 sm:flex-none">
            <Plus size={16} className="mr-1.5" /> Add Item
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShoppingMode(true)}
            disabled={uncheckedItems.length === 0}
          >
            <ShoppingCart size={16} className="mr-1.5" />
            <span className="hidden sm:inline">Shop</span>
            {uncheckedItems.length > 0 && (
              <span className="ml-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {uncheckedItems.length}
              </span>
            )}
          </Button>
          <Link href="/templates">
            <Button variant="secondary">
              <LayoutTemplate size={16} className="mr-1.5" />
              <span className="hidden sm:inline">Templates</span>
            </Button>
          </Link>
        </div>

        {/* Checklist */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <ClipboardList size={32} className="text-zinc-400" />
            </div>
            <h2 className="font-bold text-zinc-950 text-xl mb-2">Your checklist is empty</h2>
            <p className="text-zinc-500 text-sm mb-6">Add items from our preset lists or create your own.</p>
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
                <div key={category.id} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-950">{category.name}</span>
                      <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-semibold">
                        {doneCount}/{catItems.length}
                      </span>
                    </div>
                    {isCollapsed ? <ChevronDown size={16} className="text-zinc-400" /> : <ChevronUp size={16} className="text-zinc-400" />}
                  </button>

                  {!isCollapsed && (
                    <div className="px-4 pb-4 space-y-2">
                      {catItems.map((item) => (
                        <ChecklistItem
                          key={item.id}
                          item={item}
                          roomId={id}
                          onToggle={toggleItem}
                          onDelete={deleteItem}
                          onClaim={claimItem}
                          onQuantityChange={updateQuantity}
                          onNoteChange={updateNote}
                          onOwnedChange={updateOwned}
                          onClaimChange={upsertClaim}
                          currentUserName={currentUserName}
                          currentUserId={currentUserId}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Activity feed */}
        {activity.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl border border-zinc-100 overflow-hidden">
            <button
              onClick={() => setShowActivity((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-emerald-500" />
                <span className="font-bold text-zinc-950 text-sm">Recent activity</span>
              </div>
              {showActivity ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
            </button>
            {showActivity && (
              <div className="px-5 pb-4 space-y-2.5">
                {activity.map((ev) => {
                  const mins = Math.round((Date.now() - new Date(ev.created_at).getTime()) / 60000)
                  const timeAgo = mins < 1 ? 'just now' : mins < 60 ? `${mins}m ago` : `${Math.round(mins / 60)}h ago`
                  return (
                    <div key={ev.id} className="flex items-start gap-2.5 text-sm">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {ev.user_name[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-zinc-950">{ev.user_name}</span>
                        <span className="text-zinc-500"> {ev.action} </span>
                        {ev.item_name && <span className="font-medium text-gray-700">{ev.item_name}</span>}
                      </div>
                      <span className="text-xs text-zinc-400 flex-shrink-0">{timeAgo}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        <div className="mt-8">
          <AdUnit slot="XXXXXXXXXX" />
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
