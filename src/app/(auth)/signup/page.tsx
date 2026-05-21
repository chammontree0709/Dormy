'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'
import Button from '@/components/ui/Button'
import { Eye, EyeOff, Mail, Check, Clock } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // Pre-fill invite code from ?invite= URL param (set by /join/[code] redirect)
  const [inviteCode, setInviteCode] = useState((searchParams.get('invite') ?? '').toUpperCase())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verifyEmail, setVerifyEmail] = useState('')

  const inviteValid = /^[A-Z0-9]{6}$/.test(inviteCode)

  async function handleGoogleSignIn() {
    setLoading(true)
    const invite = inviteCode.trim()
    const redirectTo = invite
      ? `${window.location.origin}/auth/callback?invite=${invite.toUpperCase()}`
      : `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name.trim() } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Join room after signup if invite code provided (from URL param or manual entry)
    if (inviteCode.trim() && data.user) {
      const displayName = name.trim() || email.split('@')[0]
      await supabase.rpc('join_room_by_invite_code', {
        p_invite_code: inviteCode.trim().toUpperCase(),
        p_display_name: displayName,
      })
    }

    // If Supabase requires email confirmation, session will be null
    if (!data.session) {
      setVerifyEmail(email)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  if (verifyEmail) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <LogoMark size={44} />
          <span className="font-black text-zinc-950 text-2xl">Roomd</span>
        </Link>
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-sm border border-zinc-100 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
            <Mail size={28} className="text-zinc-400" />
          </div>
          <h1 className="text-2xl font-black text-zinc-950 mb-2">Check your inbox</h1>
          <p className="text-zinc-500 text-sm mb-2">We sent a confirmation link to:</p>
          <p className="font-bold text-zinc-900 mb-4">{verifyEmail}</p>
          <p className="text-sm text-zinc-500 mb-6">Click the link in the email to activate your account, then come back to log in.</p>
          <p className="text-xs text-zinc-400">Didn&apos;t get it? Check spam or <button onClick={() => setVerifyEmail('')} className="text-emerald-600 hover:underline">try again</button>.</p>
          <div className="mt-6">
            <Link href="/login" className="text-sm text-emerald-600 font-semibold hover:underline">Go to login →</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <LogoMark size={44} />
        <span className="font-black text-zinc-950 text-2xl">Roomd</span>
      </Link>

      <div className="bg-white w-full max-w-sm rounded-2xl shadow-sm border border-zinc-100 p-8">
        <h1 className="text-2xl font-black text-zinc-950 mb-1">Create your account</h1>
        <p className="text-zinc-500 text-sm mb-6">Free forever. You&apos;ll be taken to create or join your room.</p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors mb-4 disabled:opacity-50"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <GoogleIcon />
          )}
          {loading ? 'Redirecting to Google...' : 'Continue with Google'}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-zinc-400 font-medium">or</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Emma"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
              Room Invite Code <span className="text-zinc-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="e.g. ABC123"
                maxLength={6}
                className={`w-full px-4 py-3 pr-10 rounded-xl border text-sm uppercase font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  inviteCode.length > 0
                    ? inviteValid
                      ? 'border-green-400 bg-green-50'
                      : 'border-amber-300 bg-amber-50'
                    : 'border-zinc-200'
                }`}
              />
              {inviteCode.length > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {inviteValid
                    ? <Check size={16} className="text-emerald-500" strokeWidth={2.5} />
                    : <Clock size={16} className="text-amber-400" strokeWidth={2} />
                  }
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {inviteCode.length > 0 && !inviteValid
                ? `${inviteCode.length}/6 characters — codes are exactly 6 letters/numbers`
                : 'Got a code from a roommate? Enter it here.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
