'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function JoinPage() {
  const [code, setCode] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (code.trim().length === 6) {
      router.push(`/join/${code.trim().toUpperCase()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Image src="/logo.png" alt="Roomd" height={44} width={44} className="rounded-xl" />
          <span className="font-black text-emerald-600 text-2xl">Roomd</span>
      </Link>

      <div className="bg-white w-full max-w-sm rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Join a room</h1>
        <p className="text-gray-500 text-sm mb-6">Enter the 6-digit code your roommate shared with you.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            maxLength={6}
            className="w-full px-4 py-4 rounded-xl border border-gray-200 text-center text-2xl font-black font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
            autoFocus
          />
          <button
            type="submit"
            disabled={code.trim().length !== 6}
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join Room
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account? <Link href="/signup" className="text-emerald-600 font-semibold hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}
