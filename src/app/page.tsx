'use client'

import Link from 'next/link'
import { useState } from 'react'

const features = [
  { emoji: '✅', title: 'Shared Checklist', description: 'One list for all roommates. Mark items bought in real time — no more duplicate purchases.' },
  { emoji: '📦', title: 'Preset Lists', description: 'Browse curated lists of dorm essentials, sorted by priority. Freshman Essentials, Study Setup, and more.' },
  { emoji: '🛒', title: 'Buy in One Click', description: 'Every item links directly to Amazon. We find the best options so you don\'t have to.' },
  { emoji: '👥', title: 'Invite Roommates', description: 'Share a 6-digit code and your whole room is synced instantly.' },
]

const testimonials = [
  { quote: 'We used to fight about who was buying what. Roomd fixed that.', name: 'Emma & Jake', school: 'Penn State' },
  { quote: 'Saved us from buying three shower caddies and forgetting sheets.', name: 'Priya', school: 'UCLA' },
  { quote: 'The preset lists are so good. We just checked off what we had and bought the rest.', name: 'Marcus', school: 'UT Austin' },
]

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
    <section className="py-16 px-4 bg-gradient-to-b from-indigo-600 to-indigo-700">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-3xl mb-3">📬</div>
        <h2 className="text-2xl font-black text-white mb-2">Move-in tips for your inbox</h2>
        <p className="text-indigo-200 text-sm mb-6">
          Get our free dorm packing checklist + early access to new features. No spam, ever.
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
              {status === 'loading' ? 'Joining...' : 'Get the list'}
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
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="font-black text-indigo-600 text-xl">Roomd</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900">Log in</Link>
            <Link href="/signup" className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <span>🎓</span> Built for college move-in day
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-tight mb-6">
            Your dorm room,<br />
            <span className="text-indigo-600">packed together.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
            The shared checklist app for you and your roommates. Never buy the same thing twice. Never forget the essentials.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className="w-full sm:w-auto bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
              Create your room — it&apos;s free
            </Link>
            <Link href="/checklists" className="w-full sm:w-auto bg-white text-indigo-600 font-bold text-lg px-8 py-4 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 transition-colors">
              Browse checklists
            </Link>
          </div>
        </div>

        <div className="max-w-md mx-auto mt-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-indigo-600 px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-white font-bold">Room 204 — Johnson Hall</p>
                <p className="text-indigo-200 text-xs">Emma, Jake, Priya · 3 members</p>
              </div>
              <div className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">8/14 done</div>
            </div>
            <div className="p-4 space-y-2.5">
              {[
                { name: '🛏️ Twin XL Sheet Set', done: true, by: 'Emma' },
                { name: '🔌 Surge Protector', done: true, by: 'Jake' },
                { name: '🚿 Shower Caddy', done: false },
                { name: '☕ Electric Kettle', done: false },
                { name: '💡 LED Desk Lamp', done: false },
              ].map((item) => (
                <div key={item.name} className={`flex items-center gap-3 p-3 rounded-xl ${item.done ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-green-500' : 'border-2 border-gray-300'}`}>
                    {item.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className={`text-sm font-medium flex-1 ${item.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{item.name}</span>
                  {item.done && <span className="text-xs text-green-600">by {item.by}</span>}
                  {!item.done && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Buy</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-3">Everything you need. Nothing you don&apos;t.</h2>
          <p className="text-center text-gray-500 mb-12">Move-in is stressful enough. We handle the list.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6">
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-indigo-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-center text-gray-900 mb-10">Roommates love it.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-gray-700 text-sm italic mb-4">&ldquo;{t.quote}&rdquo;</p>
                <p className="font-bold text-sm text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.school}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EmailCapture />

      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-4">Ready for move-in day?</h2>
        <p className="text-gray-500 mb-8">Create your room, invite your roommates, and start checking things off.</p>
        <Link href="/signup" className="inline-block bg-indigo-600 text-white font-bold text-lg px-10 py-4 rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
          Create your room — free
        </Link>
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
