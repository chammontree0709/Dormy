'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Room } from '@/types'
import { generateInviteCode } from '@/lib/utils'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { Plus, DoorOpen, ArrowRight, Home, LayoutTemplate, LogOut } from 'lucide-react'

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)
  const [actionError, setActionError] = useState('')
  const [leavingRoomId, setLeavingRoomId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const displayName = user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'You'
      setUserName(displayName)

      // Fetch membership rows AND rooms created by this user in parallel.
      // Querying created_by is the fallback for when room_members insert silently
      // failed on iOS (network drop, RLS race) so the room never shows up on reload.
      const [{ data: memberRows }, { data: createdRooms }] = await Promise.all([
        supabase.from('room_members').select('room_id').eq('user_id', user.id),
        supabase.from('rooms').select('*').eq('created_by', user.id),
      ])

      const memberRoomIds = (memberRows ?? []).map((r) => r.room_id)
      const createdIds = new Set((createdRooms ?? []).map((r) => r.id))

      // Self-heal: rooms user created but was never added to room_members (iOS bug).
      // Use invite_code via RPC (security-definer) — direct inserts can be blocked by RLS.
      const missingMemberships = (createdRooms ?? []).filter((r) => !memberRoomIds.includes(r.id))
      if (missingMemberships.length > 0) {
        await Promise.all(
          missingMemberships.map((r) =>
            supabase.rpc('join_room_by_invite_code', {
              p_invite_code: r.invite_code,
              p_display_name: displayName,
            })
          )
        )
        memberRoomIds.push(...missingMemberships.map((r) => r.id))
      }

      // Fetch rooms the user joined but didn't create (not already in createdRooms)
      const joinedIds = memberRoomIds.filter((id) => !createdIds.has(id))
      const { data: joinedRooms } = joinedIds.length > 0
        ? await supabase.from('rooms').select('*').in('id', joinedIds)
        : { data: [] as Room[] }

      const allRooms = [...(createdRooms ?? []), ...(joinedRooms ?? [])]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setRooms(allRooms)
      setLoading(false)
    }
    load()
  }, [])

  async function createRoom() {
    if (!newRoomName.trim()) return
    setCreating(true)
    setActionError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const inviteCode = generateInviteCode()
    const displayName = user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'You'

    const { data: room, error: roomErr } = await supabase
      .from('rooms')
      .insert({ name: newRoomName.trim(), invite_code: inviteCode, created_by: user.id })
      .select()
      .single()

    if (roomErr || !room) {
      setActionError(roomErr?.message ?? 'Failed to create room')
      setCreating(false)
      return
    }

    // Use the RPC (security-definer) instead of a direct insert —
    // room_members RLS blocks direct inserts in some policy configurations.
    const { error: memberErr } = await supabase.rpc('join_room_by_invite_code', {
      p_invite_code: inviteCode,
      p_display_name: displayName,
    })

    if (memberErr) {
      // Rollback: room was created but membership failed — delete the orphaned room
      await supabase.from('rooms').delete().eq('id', room.id)
      setActionError('Failed to set up your room. Please try again.')
      setCreating(false)
      return
    }

    setRooms((prev) => [room, ...prev])
    setNewRoomName('')
    setShowCreate(false)
    setCreating(false)
  }

  async function joinRoom() {
    const code = joinCode.trim().toUpperCase()
    if (!code) return
    setJoining(true)
    setActionError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const displayName = user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'Roommate'

    const { data: roomId, error: rpcErr } = await supabase.rpc('join_room_by_invite_code', {
      p_invite_code: code,
      p_display_name: displayName,
    })

    if (rpcErr || !roomId) {
      setActionError('Room not found. Check the invite code and try again.')
      setJoining(false)
      return
    }

    const { data: room } = await supabase.from('rooms').select('*').eq('id', roomId).single()

    if (room && !rooms.find((r) => r.id === room.id)) {
      setRooms((prev) => [room, ...prev])
    }
    setJoinCode('')
    setShowJoin(false)
    setJoining(false)
  }

  async function leaveRoom(roomId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('room_members').delete().eq('room_id', roomId).eq('user_id', user.id)
    setRooms((prev) => prev.filter((r) => r.id !== roomId))
    setLeavingRoomId(null)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="border-b border-zinc-200 pb-8 mb-8">
          <h1
            className="text-3xl font-bold italic text-zinc-950 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Hey, {userName}.
          </h1>
          <p className="text-zinc-500 mt-1">Your dorm rooms and checklists.</p>
        </div>

        <div className="flex gap-3 mb-8">
          <Button onClick={() => { setShowCreate(true); setShowJoin(false); setActionError('') }} className="flex-1 sm:flex-none">
            <Plus size={16} className="mr-1.5" /> New Room
          </Button>
          <Button variant="secondary" onClick={() => { setShowJoin(true); setShowCreate(false); setActionError('') }} className="flex-1 sm:flex-none">
            <DoorOpen size={16} className="mr-1.5" /> Join Room
          </Button>
        </div>

        {(showCreate || showJoin) && (
          <Card className="mb-6">
            {showCreate ? (
              <div className="space-y-4">
                <h2 className="font-bold text-zinc-950">Create a new room</h2>
                <input
                  type="text"
                  placeholder="e.g. Johnson Hall 204"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createRoom()}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                {actionError && <p className="text-red-600 text-sm">{actionError}</p>}
                <div className="flex gap-2">
                  <Button onClick={createRoom} loading={creating}>Create Room</Button>
                  <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-bold text-zinc-950">Join with invite code</h2>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm uppercase font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                {actionError && <p className="text-red-600 text-sm">{actionError}</p>}
                <div className="flex gap-2">
                  <Button onClick={joinRoom} loading={joining}>Join Room</Button>
                  <Button variant="ghost" onClick={() => setShowJoin(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-zinc-50 rounded-2xl border border-zinc-100 animate-pulse" />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="border-t border-zinc-200 pt-12 text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <Home className="w-7 h-7 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h2 className="font-bold text-zinc-950 text-xl mb-2">No rooms yet</h2>
            <p className="text-zinc-500 text-sm mb-6">Create a room to get started, or join one with a roommate&apos;s invite code.</p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus size={16} className="mr-1.5" /> Create your first room
            </Button>
          </div>
        ) : (
          <div className="border-t border-zinc-200">
            {rooms.map((room) => (
              <div key={room.id} className="group flex items-center border-b border-zinc-200 hover:bg-zinc-50 -mx-4 px-4 transition-colors">
                <Link href={`/room/${room.id}`} className="flex items-center flex-1 py-4 gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                    <Home className="w-4 h-4 text-zinc-500" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-zinc-950 group-hover:text-emerald-600 transition-colors truncate">{room.name}</p>
                    <p className="text-xs text-zinc-400">Code: <span className="font-mono font-semibold">{room.invite_code}</span></p>
                  </div>
                </Link>
                {leavingRoomId === room.id ? (
                  <div className="flex items-center gap-2 pl-2 flex-shrink-0">
                    <button
                      onClick={() => leaveRoom(room.id)}
                      className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Leave
                    </button>
                    <button
                      onClick={() => setLeavingRoomId(null)}
                      className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 px-2 py-1.5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setLeavingRoomId(room.id)}
                      className="p-1.5 text-zinc-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Leave room"
                    >
                      <LogOut size={15} />
                    </button>
                    <ArrowRight size={18} className="text-zinc-300 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-all" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick picks */}
        <div className="mt-10 pt-6 border-t border-zinc-200">
          <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-4">Quick picks</p>
          <Link href="/templates" className="flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-2xl p-5 hover:border-zinc-400 hover:bg-white transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                <LayoutTemplate className="w-4 h-4 text-zinc-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-zinc-950 mb-0.5">Browse preset checklists</p>
                <p className="text-sm text-zinc-500">Freshman Essentials, Study Setup, Kitchen Starter, and more.</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-zinc-300 group-hover:text-zinc-950 flex-shrink-0 ml-4 transition-colors" />
          </Link>
        </div>
      </main>
    </div>
  )
}
