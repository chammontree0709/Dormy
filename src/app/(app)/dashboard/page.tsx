'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Room } from '@/types'
import { generateInviteCode } from '@/lib/utils'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { Plus, DoorOpen, Users, ArrowRight } from 'lucide-react'

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

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserName(user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'there')

      const { data: memberRows } = await supabase
        .from('room_members')
        .select('room_id')
        .eq('user_id', user.id)

      if (!memberRows?.length) { setLoading(false); return }

      const roomIds = memberRows.map((r) => r.room_id)
      const { data: roomData } = await supabase
        .from('rooms')
        .select('*')
        .in('id', roomIds)
        .order('created_at', { ascending: false })

      setRooms(roomData ?? [])
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

    await supabase.from('room_members').insert({
      room_id: room.id,
      user_id: user.id,
      display_name: displayName,
    })

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Hey, {userName} 👋</h1>
          <p className="text-gray-500 mt-1">Your dorm rooms and checklists.</p>
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
                <h2 className="font-bold text-gray-900">Create a new room</h2>
                <input
                  type="text"
                  placeholder="e.g. Johnson Hall 204"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createRoom()}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                <h2 className="font-bold text-gray-900">Join with invite code</h2>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm uppercase font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏠</div>
            <h2 className="font-bold text-gray-900 text-xl mb-2">No rooms yet</h2>
            <p className="text-gray-500 text-sm mb-6">Create a room to get started, or join one with a roommate&apos;s invite code.</p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus size={16} className="mr-1.5" /> Create your first room
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => (
              <Link key={room.id} href={`/room/${room.id}`}>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-sm transition-all group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">🏠</div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{room.name}</p>
                        <p className="text-xs text-gray-400">Code: <span className="font-mono font-semibold">{room.invite_code}</span></p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-gray-400" />
            <p className="text-sm font-semibold text-gray-500">Quick picks</p>
          </div>
          <Link href="/templates" className="block bg-gradient-to-r from-emerald-50 to-zinc-50 border border-emerald-100 rounded-2xl p-5 hover:border-emerald-300 transition-all group">
            <p className="font-bold text-gray-900 mb-1">Browse preset checklists 📦</p>
            <p className="text-sm text-gray-500">Freshman Essentials, Study Setup, Kitchen Starter, and more.</p>
            <p className="text-sm text-emerald-600 font-semibold mt-3 group-hover:underline">Explore →</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
