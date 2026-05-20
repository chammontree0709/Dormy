'use client'

import Link from 'next/link'
import { useState } from 'react'

const stats = [
  { value: '200+', label: 'essential items' },
  { value: '13', label: 'categories' },
  { value: '9', label: 'starter packs' },
  { value: '100%', label: 'free' },
]

const features = [
  {
    emoji: '⚡',
    title: 'Real-time sync',
    description: 'The second a roommate checks something off, everyone sees it. No refresh, no confusion.',
    bg: 'bg-violet-50',
    accent: 'text-violet-600',
    border: 'border-violet-100',
  },
  {
    emoji: '📦',
    title: '200+ preset items',
    description: 'Curated lists by priority — essentials first, nice-to-haves later. Skip the endless Amazon rabbit hole.',
    bg: 'bg-amber-50',
    accent: 'text-amber-600',
    border: 'border-amber-100',
  },
  {
    emoji: '🛒',
    title: 'One-click buying',
    description: 'Every item links straight to Amazon. We find the best options so you can just click and move on.',
    bg: 'bg-emerald-50',
    accent: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  {
    emoji: '🙋',
    title: '"I\'ll buy this"',
    description: 'Claim an item before buying so nobody doubles up. No more three shower caddies.',
    bg: 'bg-indigo-50',
    accent: 'text-indigo-600',
    border: 'border-indigo-100',
  },
]

const steps = [
  { number: '01', title: 'Create your room', description: 'Takes 30 seconds. Give it a name, done.' },
  { number: '02', title: 'Invite your roommates', description: 'Share a 6-digit code or a link. They join instantly.' },
  { number: '03', title: 'Check things off together', description: 'Browse presets, add items, claim what you\'re buying.' },
]

const testimonials = [
  {
    quote: 'We used to fight about who was buying what. This fixed that.',
    name: 'Emma & Jake',
    school: 'Penn State',
    avatar: 'EJ',
    color: 'bg-violet-500',
    stars: 5,
  },
  {
    quote: 'Saved us from buying three shower caddies and forgetting sheets.',
    name: 'Priya S.',
    school: 'UCLA',
    avatar: 'PS',
    color: 'bg-emerald-500',
    stars: 5,
  },
  {
    quote: 'The preset lists are so good. We just checked off what we had and bought the rest.',
    name: 'Marcus T.',
    school: 'UT Austin',
    avatar: 'MT',
    color: 'bg-amber-500',
    stars: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function EmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Try again.')
    }
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-3xl mb-3">📬</div>
        <h2 className="text-2xl font-black text-white mb-2">Get the ultimate packing list</h2>
        <p className="text-indigo-200 text-sm mb-6">
          Free move-in checklist PDF + early access to new features. No spam, ever.
        </p>
        {status === 'success' ? (
          <div className="bg-white/20 text-white font-semibold px-6 py-4 rounded-2xl">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {status === 'loading' ? 'Joining...' : 'Send it →'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-300 text-xs mt-2">{message}</p>
        )}
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="font-black text-indigo-600 text-xl">Roomd</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/guides" className="text-sm font-semibold text-gray-500 hover:text-gray-900 hidden sm:block">Guides</Link>
            <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900">Log in</Link>
            <Link href="/signup" className="bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, #e0e7ff 0%, #ffffff 70%)' }}>
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-100 rounded-full opacity-40 blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-100 rounded-full opacity-50 blur-3xl -translate-y-1/3 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 text-indigo-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Move-in season is coming
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
            Stop the group chat chaos.<br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Get a shared list.
            </span>
          </h1>

          <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
            One checklist for you and your roommates. See who&apos;s buying what, in real time. No more doubles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link href="/signup" className="w-full sm:w-auto bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5">
              Create your room — free
            </Link>
            <Link href="/checklists" className="w-full sm:w-auto bg-white text-gray-700 font-bold text-lg px-8 py-4 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all">
              Browse checklists →
            </Link>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-indigo-600 leading-none">{s.value}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* App preview */}
        <div className="relative max-w-sm mx-auto mt-16">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-200/40 to-violet-200/40 rounded-3xl blur-2xl scale-105" />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">Room 204 — Johnson Hall</p>
                <p className="text-indigo-200 text-xs mt-0.5">Emma · Jake · Priya · 3 members</p>
              </div>
              <div className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">8/14 ✓</div>
            </div>
            <div className="p-4 space-y-2">
              {[
                { name: 'Twin XL Sheet Set', emoji: '🛏️', done: true, by: 'Emma' },
                { name: 'Surge Protector', emoji: '🔌', done: true, by: 'Jake' },
                { name: 'Shower Caddy', emoji: '🚿', done: false, claimer: 'Priya' },
                { name: 'Electric Kettle', emoji: '☕', done: false },
                { name: 'LED Desk Lamp', emoji: '💡', done: false },
              ].map((item) => (
                <div
                  key={item.name}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    item.done ? 'bg-emerald-50' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.done ? 'bg-emerald-500' : 'border-2 border-gray-300'
                  }`}>
                    {item.done && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm mr-0.5">{item.emoji}</span>
                  <span className={`text-sm font-medium flex-1 ${item.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {item.name}
                  </span>
                  {item.done && <span className="text-xs text-emerald-600 font-semibold">{item.by}</span>}
                  {'claimer' in item && item.claimer && (
                    <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">{item.claimer} →</span>
                  )}
                  {!item.done && !('claimer' in item && item.claimer) && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Buy</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-bold tracking-widest text-indigo-400 uppercase mb-4">How it works</p>
          <h2 className="text-3xl font-black text-center text-white mb-16">Up and running in under 2 minutes.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <p className="text-6xl font-black text-indigo-900 leading-none mb-4">{step.number}</p>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-bold tracking-widest text-indigo-500 uppercase mb-4">Features</p>
          <h2 className="text-3xl font-black text-center text-gray-900 mb-3">Everything you need. Nothing you don&apos;t.</h2>
          <p className="text-center text-gray-400 mb-12">Move-in is stressful enough. We handle the list.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div key={f.title} className={`${f.bg} border ${f.border} rounded-2xl p-6`}>
                <div className={`text-3xl mb-4`}>{f.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs font-bold tracking-widest text-indigo-500 uppercase mb-4">Reviews</p>
          <h2 className="text-3xl font-black text-center text-gray-900 mb-12">Roommates love it.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <Stars count={t.stars} />
                <p className="text-gray-700 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EmailCapture />

      {/* Final CTA */}
      <section className="py-24 px-4 text-center bg-white">
        <div className="max-w-xl mx-auto">
          <div className="text-5xl mb-6">🎉</div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
            Your room is waiting.<br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Let&apos;s get it packed.
            </span>
          </h2>
          <p className="text-gray-400 mb-10 text-lg">Free forever. No credit card. Takes 30 seconds.</p>
          <Link
            href="/signup"
            className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg px-12 py-4 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
          >
            Create your room — free
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 px-4 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-4 mb-4">
          <a
            href="https://www.tiktok.com/@roomdapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Roomd on TikTok"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/>
            </svg>
          </a>
          <a
            href="https://www.instagram.com/roomdapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Roomd on Instagram"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
        <p className="mb-2">
          <Link href="/checklists" className="hover:underline">Checklists</Link>
          {' · '}
          <Link href="/guides" className="hover:underline">Guides</Link>
          {' · '}
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          {' · '}
          <Link href="/terms" className="hover:underline">Terms</Link>
          {' · '}
          <a href="mailto:support@roomdapp.com" className="hover:underline">Support</a>
        </p>
        <p>© {new Date().getFullYear()} Roomd. Built with ❤️ for college students.</p>
        <p className="mt-1 text-xs">As an Amazon Associate, Roomd earns from qualifying purchases.</p>
      </footer>
    </div>
  )
}
