'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="text-3xl">🏠</span>
        <span className="font-black text-indigo-600 text-2xl">Roomd</span>
      </Link>

      <div className="bg-white w-full max-w-sm rounded-2xl shadow-sm border border-gray-100 p-8">
        {sent ? (
          <div className="text-center">
            <div className="text-4xl mb-4">📬</div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Check your inbox</h1>
            <p className="text-gray-500 text-sm mb-2">We sent a password reset link to:</p>
            <p className="font-bold text-gray-800 mb-6">{email}</p>
            <p className="text-xs text-gray-400">Didn&apos;t get it? Check your spam folder or <button onClick={() => setSent(false)} className="text-indigo-600 hover:underline">try again</button>.</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-black text-gray-900 mb-1">Forgot password?</h1>
            <p className="text-gray-500 text-sm mb-6">Enter your email and we&apos;ll send you a reset link.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              <Link href="/login" className="text-indigo-600 font-semibold hover:underline">← Back to login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
