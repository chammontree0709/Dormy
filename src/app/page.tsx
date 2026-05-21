'use client'

import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'
import { useState } from 'react'
import {
  Zap,
  Package,
  ShoppingCart,
  UserCheck,
  ArrowRight,
  Mail,
  CheckCircle2,
  Plus,
  Share2,
  ListChecks,
} from 'lucide-react'

const marqueeItems = [
  'Move-in season is here',
  'Over 200 items curated for dorm life',
  '100% free, always',
  'Real-time sync with your roommates',
  'No credit card required',
  'Works on any device',
]

const stats = [
  { value: '200+', label: 'essential items' },
  { value: '13', label: 'categories' },
  { value: '9', label: 'starter packs' },
  { value: '100%', label: 'free' },
]

const steps = [
  {
    number: '01',
    Icon: Plus,
    title: 'Create your room',
    description: 'Takes 30 seconds. Give it a name, done.',
  },
  {
    number: '02',
    Icon: Share2,
    title: 'Invite your roommates',
    description: 'Share a 6-digit code or a link. They join instantly.',
  },
  {
    number: '03',
    Icon: ListChecks,
    title: 'Check things off together',
    description: "Browse presets, add items, claim what you're buying.",
  },
]

const features = [
  {
    Icon: Zap,
    title: 'Real-time sync',
    description:
      'The second a roommate checks something off, everyone sees it. No refresh, no confusion, no duplicate buys.',
  },
  {
    Icon: Package,
    title: '200+ preset items',
    description:
      'Curated lists by priority — essentials first, nice-to-haves later. Skip the Amazon rabbit hole.',
  },
  {
    Icon: UserCheck,
    title: '"I\'ll buy this"',
    description:
      'Claim an item before buying so nobody doubles up. No more three shower caddies.',
  },
  {
    Icon: ShoppingCart,
    title: 'One-click buying',
    description:
      'Every item links straight to Amazon. We find the best options so you can just click and move on.',
  },
]

const testimonials = [
  {
    quote:
      'We used to fight about who was buying what. This fixed that completely — we moved in with zero duplicate purchases.',
    name: 'Mara & Tyler',
    school: 'Penn State',
    initials: 'MT',
    stars: 5,
  },
  {
    quote: "Saved us from buying three shower caddies and forgetting sheets.",
    name: 'Divya S.',
    school: 'UCLA',
    initials: 'DS',
    stars: 5,
  },
  {
    quote: 'The preset lists are so good. We checked off what we had and bought the rest.',
    name: 'Marcus T.',
    school: 'UT Austin',
    initials: 'MT',
    stars: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#10b981">
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
    <section className="py-20 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
            <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">Stay updated</span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold italic text-white mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Stay in the loop.
          </h2>
          <p className="text-zinc-400 leading-relaxed max-w-md">
            Move-in tips, new features, and packing reminders — straight to your inbox. No spam, ever.
          </p>
        </div>
        <div className="w-full md:min-w-[340px]">
          {status === 'success' ? (
            <div className="flex items-center gap-3 bg-emerald-900/30 border border-emerald-700/40 text-emerald-400 font-semibold px-6 py-4 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
              <span>{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="email-capture" className="sr-only">Email address</label>
                <input
                  id="email-capture"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-400 transition-all duration-200 disabled:opacity-60 whitespace-nowrap active:scale-[0.98]"
              >
                {status === 'loading' ? 'Joining...' : 'Send it'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-xs mt-2">{message}</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Announcement marquee */}
      <div className="bg-zinc-950 overflow-hidden py-2.5">
        <div className="flex animate-marquee whitespace-nowrap">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="flex items-center gap-0 pr-0 text-white text-xs font-medium tracking-widest uppercase flex-shrink-0"
            >
              {marqueeItems.map((item, j) => (
                <span key={j} className="inline-flex items-center">
                  <span className="px-6">{item}</span>
                  <span className="text-emerald-400">—</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <header className="border-b border-zinc-100 sticky top-0 bg-white/90 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMark size={32} />
            <span className="font-black text-zinc-950 text-xl tracking-tight">Roomd</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/guides"
              className="text-sm font-semibold text-zinc-500 hover:text-zinc-950 transition-colors duration-200 hidden sm:block"
            >
              Guides
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold text-zinc-500 hover:text-zinc-950 transition-colors duration-200"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-zinc-950 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-zinc-800 transition-colors duration-200 active:scale-[0.98]"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero — Split screen */}
      <section
        className="min-h-[100dvh] px-6 flex items-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 100% 50%, #d1fae5 0%, #ffffff 65%)' }}
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-20">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-zinc-950 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Move-in season is coming
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-zinc-950 leading-none tracking-tighter mb-6">
              Stop the<br />
              group chat<br />
              <span className="text-emerald-500">chaos.</span>
            </h1>

            <p className="text-lg text-zinc-500 mb-10 max-w-[44ch] leading-relaxed">
              One checklist for you and your roommates. See who&apos;s buying what, in real time. No more doubles.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-14">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-zinc-950 text-white font-bold text-base px-7 py-3.5 rounded-2xl hover:bg-zinc-800 transition-all duration-200 shadow-lg shadow-zinc-900/10 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
              >
                Create your room — free
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
              <Link
                href="/checklists"
                className="inline-flex items-center justify-center gap-2 bg-white text-zinc-700 font-bold text-base px-7 py-3.5 rounded-2xl border border-zinc-200 hover:border-zinc-400 hover:text-zinc-950 transition-all duration-200"
              >
                Browse checklists
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 flex-wrap">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-zinc-950 leading-none">{s.value}</p>
                  <p className="text-xs text-zinc-400 font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: App mockup */}
          <div
            className="relative flex items-center justify-center lg:justify-end"
            style={{ animation: 'float 6s ease-in-out infinite' }}
          >
            <div className="absolute inset-0 bg-emerald-100/70 rounded-3xl blur-3xl scale-110 pointer-events-none" />
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-zinc-900/10 border border-zinc-100 overflow-hidden w-full max-w-sm">
              <div className="bg-zinc-950 px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-sm">Room 204 — Johnson Hall</p>
                  <p className="text-zinc-400 text-xs mt-0.5">Mara · Tyler · Divya · 3 members</p>
                </div>
                <div className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                  8 / 14
                </div>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { name: 'Twin XL Sheet Set', done: true, by: 'Mara' },
                  { name: 'Surge Protector', done: true, by: 'Tyler' },
                  { name: 'Shower Caddy', done: false, claimer: 'Divya' },
                  { name: 'Electric Kettle', done: false },
                  { name: 'LED Desk Lamp', done: false },
                ].map((item) => (
                  <div
                    key={item.name}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${
                      item.done ? 'bg-emerald-50' : 'bg-zinc-50'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.done ? 'bg-emerald-500' : 'border-2 border-zinc-300'
                      }`}
                    >
                      {item.done && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium flex-1 ${
                        item.done ? 'line-through text-zinc-400' : 'text-zinc-800'
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.done && (
                      <span className="text-xs text-emerald-600 font-semibold">{item.by}</span>
                    )}
                    {'claimer' in item && item.claimer && (
                      <span className="text-xs bg-zinc-900 text-white px-2 py-0.5 rounded-full font-semibold">
                        {item.claimer}
                      </span>
                    )}
                    {!item.done && !('claimer' in item && item.claimer) && (
                      <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-semibold">
                        Buy
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-4">How it works</p>
          <h2
            className="text-4xl md:text-5xl font-bold italic text-white mb-16 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Up and running in under 2 minutes.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800">
            {steps.map((step) => (
              <div key={step.number} className="bg-zinc-950 p-8 md:p-10">
                <p className="text-7xl font-black text-zinc-800 leading-none mb-6 select-none">{step.number}</p>
                <step.Icon className="w-6 h-6 text-emerald-400 mb-4" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — Thaely-style borderless grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4">Features</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            <h2
              className="text-4xl md:text-5xl font-bold italic text-zinc-950 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Everything you need.<br />Nothing you don&apos;t.
            </h2>
            <p className="text-zinc-500 leading-relaxed self-end">
              Move-in is stressful enough. We handle the list so you can focus on actually getting there.
            </p>
          </div>

          {/* Borderless structural grid */}
          <div className="border-t border-zinc-200">
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-zinc-200">
              {features.slice(0, 2).map((f, i) => (
                <Link
                  key={f.title}
                  href="/signup"
                  className={`group py-10 pr-8 ${
                    i === 0 ? 'md:border-r border-zinc-200' : 'md:pl-8'
                  } hover:bg-zinc-50/60 transition-colors duration-300`}
                >
                  <f.Icon className="w-7 h-7 text-emerald-500 mb-6" strokeWidth={1.5} />
                  <h3
                    className="text-2xl font-bold italic text-zinc-950 mb-3 leading-tight"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed mb-6 max-w-[42ch]">{f.description}</p>
                  <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-950 transition-colors inline-flex items-center gap-1.5">
                    Try it free <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {features.slice(2).map((f, i) => (
                <Link
                  key={f.title}
                  href="/signup"
                  className={`group py-10 pr-8 ${
                    i === 0 ? 'md:border-r border-zinc-200' : 'md:pl-8'
                  } hover:bg-zinc-50/60 transition-colors duration-300`}
                >
                  <f.Icon className="w-7 h-7 text-emerald-500 mb-6" strokeWidth={1.5} />
                  <h3
                    className="text-2xl font-bold italic text-zinc-950 mb-3 leading-tight"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed mb-6 max-w-[42ch]">{f.description}</p>
                  <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-950 transition-colors inline-flex items-center gap-1.5">
                    Try it free <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — Editorial blockquote layout */}
      <section className="py-24 px-6 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-16">What people are saying</p>
          {/* Featured quote */}
          <div className="border-t border-zinc-200 pt-12 mb-12">
            <Stars count={5} />
            <blockquote
              className="text-3xl md:text-4xl font-bold italic text-zinc-950 leading-tight mb-10 max-w-[22ch]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              &ldquo;We used to fight about who was buying what. This fixed that completely.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-950 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                MT
              </div>
              <div>
                <p className="font-bold text-sm text-zinc-950">Mara &amp; Tyler</p>
                <p className="text-xs text-zinc-400">Penn State — moved in with zero duplicate purchases</p>
              </div>
            </div>
          </div>

          {/* Secondary quotes — structural dividers */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-zinc-200">
            {testimonials.slice(1).map((t, i) => (
              <div
                key={t.name}
                className={`py-10 ${i === 0 ? 'md:border-r md:pr-12 border-zinc-200' : 'md:pl-12'}`}
              >
                <Stars count={t.stars} />
                <blockquote
                  className="text-xl font-bold italic text-zinc-700 leading-snug mb-6"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-950 text-xs font-bold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-zinc-950">{t.name}</p>
                    <p className="text-xs text-zinc-400">{t.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EmailCapture />

      {/* Final CTA — Large serif editorial */}
      <section className="py-28 px-6 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-5xl md:text-7xl font-bold italic text-zinc-950 leading-none mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Your room is waiting.<br />
            <span className="text-emerald-500">Let&apos;s get it packed.</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-10">Free forever. No credit card. Takes 30 seconds.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-zinc-950 text-white font-bold text-base px-8 py-4 rounded-2xl hover:bg-zinc-800 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 shadow-xl shadow-zinc-900/10"
          >
            Create your room — free
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-100 py-8 px-6 text-sm text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a
              href="https://www.tiktok.com/@roomdapp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Roomd on TikTok"
              className="hover:text-zinc-600 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/roomdapp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Roomd on Instagram"
              className="hover:text-zinc-600 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-zinc-400">
            <Link href="/checklists" className="hover:text-zinc-950 transition-colors">Checklists</Link>
            <Link href="/guides" className="hover:text-zinc-950 transition-colors">Guides</Link>
            <Link href="/privacy" className="hover:text-zinc-950 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-950 transition-colors">Terms</Link>
            <a href="mailto:support@roomdapp.com" className="hover:text-zinc-950 transition-colors">Support</a>
          </div>
          <p className="text-xs text-zinc-300">&copy; {new Date().getFullYear()} Roomd</p>
        </div>
        <p className="max-w-7xl mx-auto mt-3 text-xs text-zinc-300 text-center sm:text-left">
          As an Amazon Associate, Roomd earns from qualifying purchases.
        </p>
      </footer>
    </div>
  )
}
