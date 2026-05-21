'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'
import { Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <LogoMark size={44} />
          <span className="font-black text-zinc-950 text-2xl">Roomd</span>
      </Link>

      <div className="bg-white w-full max-w-sm rounded-2xl shadow-sm border border-zinc-100 p-8">
        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <Mail size={28} className="text-zinc-400" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 mb-2">Check your inbox</h1>
            <p className="text-zinc-500 text-sm mb-2">We sent a password reset link to:</p>
            <p className="font-bold text-zinc-800 mb-6">{email}</p>
            <p className="text-xs text-zinc-400">Didn&apos;t get it? Check your spam folder or <button onClick={() => setSent(false)} className="text-emerald-600 hover:underline">try again</button>.</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-black text-zinc-900 mb-1">Forgot password?</h1>
            <p className="text-zinc-500 text-sm mb-6">Enter your email and we&apos;ll send you a reset link.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-950 text-white font-bold py-3 rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <p className="text-center text-sm text-zinc-500 mt-6">
              <Link href="/login" className="text-emerald-600 font-semibold hover:underline">← Back to login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
