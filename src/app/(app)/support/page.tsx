'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Star, MessageSquare, ChevronDown, ChevronUp, Mail, Bug, Lightbulb, Heart, Send, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { id: 'love', label: 'I love something', icon: Heart },
  { id: 'bug', label: 'Report a bug', icon: Bug },
  { id: 'feature', label: 'Feature request', icon: Lightbulb },
  { id: 'general', label: 'General feedback', icon: MessageSquare },
]

const FAQS = [
  {
    q: 'How do I invite my roommate?',
    a: 'Open your room and tap the "Invite" button at the top. Share the 6-character room code or send them the direct join link. They\'ll need to create a free Roomd account to join.',
  },
  {
    q: 'Can I be in more than one room?',
    a: 'Yes! You can create or join multiple rooms from your dashboard — handy if you have a suite, apartment, or want separate lists for different areas.',
  },
  {
    q: 'Can I use Roomd without a roommate?',
    a: 'Absolutely. Roomd works great as a solo packing list too. Just create a room and add items — no roommate required.',
  },
  {
    q: 'How do I reset my password?',
    a: 'Tap your profile icon in the top-right corner and select "Change password." You\'ll receive a reset link by email.',
  },
  {
    q: 'Is Roomd free?',
    a: 'Yes, completely free. No subscriptions, no hidden fees.',
  },
  {
    q: 'How does the "Mine" claiming work?',
    a: 'For items with a quantity of 1, tap "I\'ll buy" to claim it — your roommate will see it\'s taken. For items with quantity 2+, tap "Mine" and use +/− to set how many you\'re personally buying so nothing gets doubled up.',
  },
  {
    q: 'What does "Split" mean on an item?',
    a: 'Tap Split on shared items like a TV or mini fridge. Both roommates can tap Split on the same item to show you\'re splitting the cost together.',
  },
  {
    q: 'How do I leave a room?',
    a: 'On your dashboard, hover over the room card and tap the leave icon that appears. You can rejoin anytime with the invite code.',
  },
]

export default function SupportPage() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [category, setCategory] = useState('general')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: rating || null, category, message }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Try again or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-950">Help & Feedback</h1>
          <p className="text-zinc-500 mt-1.5">Questions, bugs, or ideas — we read everything.</p>
        </div>

        {/* Feedback form */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
          <h2 className="font-bold text-lg text-zinc-900 mb-5">Leave feedback</h2>

          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check size={28} className="text-emerald-600" />
              </div>
              <p className="font-bold text-zinc-900 text-lg">Thanks!</p>
              <p className="text-zinc-500 text-sm max-w-[32ch]">Your feedback helps make Roomd better for everyone.</p>
              <button
                onClick={() => { setSubmitted(false); setRating(0); setMessage(''); setCategory('general') }}
                className="mt-2 text-sm font-semibold text-emerald-600 hover:underline"
              >
                Submit another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star rating */}
              <div>
                <p className="text-sm font-semibold text-zinc-700 mb-2">How are you liking Roomd? (optional)</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star === rating ? 0 : star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={cn(
                          'transition-colors',
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-200 fill-zinc-200'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <p className="text-sm font-semibold text-zinc-700 mb-2">What kind of feedback?</p>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCategory(id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-colors text-left',
                        category === id
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                          : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                      )}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-semibold text-zinc-700 mb-2 block">Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Tell us what's on your mind…"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none text-zinc-800 placeholder-zinc-400"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="flex items-center gap-2 bg-zinc-950 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={15} />
                {submitting ? 'Sending…' : 'Send feedback'}
              </button>
            </form>
          )}
        </div>

        {/* Direct contact */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm flex items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-zinc-900">Email us directly</h2>
            <p className="text-sm text-zinc-500 mt-0.5">For urgent issues or anything else.</p>
          </div>
          <a
            href="mailto:Roomdappboss@gmail.com"
            className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
          >
            <Mail size={15} />
            Roomdappboss@gmail.com
          </a>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-100">
            <h2 className="font-bold text-lg text-zinc-900">Frequently asked questions</h2>
          </div>
          <div className="divide-y divide-zinc-100">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-zinc-50 transition-colors"
                >
                  <span className="font-semibold text-sm text-zinc-900">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={16} className="text-zinc-400 flex-shrink-0" />
                    : <ChevronDown size={16} className="text-zinc-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-zinc-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
