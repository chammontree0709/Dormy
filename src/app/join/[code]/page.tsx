'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'
import Button from '@/components/ui/Button'
import { use } from 'react'
import { Home, CheckCircle2, KeyRound, XCircle, Loader2 } from 'lucide-react'

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const [status, setStatus] = useState<'loading' | 'joining' | 'success' | 'error' | 'needsAuth'>('loading')
  const [roomName, setRoomName] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function tryJoin() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setStatus('needsAuth')
        return
      }

      setStatus('joining')
      const displayName = user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'Roommate'

      const { data: roomId, error: rpcErr } = await supabase.rpc('join_room_by_invite_code', {
        p_invite_code: code.toUpperCase(),
        p_display_name: displayName,
      })

      if (rpcErr || !roomId) {
        setStatus('error')
        setError('Room not found. Double-check the invite code.')
        return
      }

      const { data: room } = await supabase.from('rooms').select('*').eq('id', roomId).single()
      setRoomName(room?.name ?? 'your room')

      setStatus('success')
      setTimeout(() => router.push(`/room/${roomId}`), 1500)
    }

    tryJoin()
  }, [code])

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <LogoMark size={44} />
          <span className="font-black text-zinc-950 text-2xl">Roomd</span>
      </Link>

      <div className="bg-white w-full max-w-sm rounded-2xl shadow-sm border border-zinc-100 p-8 text-center">
        {status === 'loading' || status === 'joining' ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <Loader2 size={28} className="text-zinc-400 animate-spin" />
            </div>
            <p className="font-bold text-zinc-900 text-lg mb-1">Joining room...</p>
            <p className="text-zinc-500 text-sm">Code: <span className="font-mono font-bold">{code}</span></p>
          </>
        ) : status === 'success' ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-emerald-500" />
            </div>
            <p className="font-bold text-zinc-900 text-xl mb-1">You&apos;re in!</p>
            <p className="text-zinc-500 text-sm">Welcome to <strong>{roomName}</strong>. Redirecting...</p>
          </>
        ) : status === 'needsAuth' ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <KeyRound size={28} className="text-zinc-400" />
            </div>
            <p className="font-bold text-zinc-900 text-xl mb-2">Sign in first</p>
            <p className="text-zinc-500 text-sm mb-6">You need an account to join a room.</p>
            <div className="space-y-3">
              <Link href={`/signup?invite=${code}`} className="block">
                <Button className="w-full">Create account</Button>
              </Link>
              <Link href={`/login?invite=${code}`} className="block">
                <Button variant="secondary" className="w-full">Log in</Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <XCircle size={28} className="text-red-400" />
            </div>
            <p className="font-bold text-zinc-900 text-xl mb-2">Couldn&apos;t join</p>
            <p className="text-zinc-500 text-sm mb-6">{error}</p>
            <Link href="/dashboard"><Button>Go to Dashboard</Button></Link>
          </>
        )}
      </div>
    </div>
  )
}
