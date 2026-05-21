import type { Metadata } from 'next'
import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'
import { ArrowRight } from 'lucide-react'
import { PRESET_LISTS, getItemById } from '@/data/presets'
import { buildAffiliateUrl } from '@/lib/amazon'

export const metadata: Metadata = {
  title: 'Dorm Room Checklists',
  description: 'Free college dorm room packing checklists. Freshman Essentials, Study Setup, Kitchen Starter, and more — with Amazon links for every item.',
  openGraph: {
    title: 'Dorm Room Checklists — Roomd',
    description: 'Free college dorm room packing checklists with Amazon links. Freshman Essentials, Study Setup, Kitchen Starter, and more.',
    url: 'https://roomdapp.com/checklists',
  },
  alternates: {
    canonical: 'https://roomdapp.com/checklists',
  },
}

export default function ChecklistsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-zinc-100 sticky top-0 bg-white/90 backdrop-blur-md z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={30} />
            <span className="font-black text-zinc-950 text-xl">Roomd</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-zinc-500 hover:text-zinc-950 transition-colors">Log in</Link>
            <Link
              href="/signup"
              className="bg-zinc-950 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-zinc-800 transition-colors active:scale-[0.98]"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Page header — left-aligned, Playfair */}
        <div className="border-b border-zinc-200 pb-10 mb-12">
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4">Free resources</p>
          <h1
            className="text-4xl md:text-5xl font-bold italic text-zinc-950 leading-tight mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Dorm Room Checklists
          </h1>
          <p className="text-zinc-500 text-lg max-w-[52ch]">
            Everything you need for move-in day. Browse, then copy to your shared room.
          </p>
        </div>

        <div className="space-y-0">
          {PRESET_LISTS.map((list, idx) => {
            const items = list.itemIds.map((id) => getItemById(id)).filter(Boolean)
            return (
              <div key={list.id} className={`${idx !== 0 ? 'border-t border-zinc-200' : ''} py-10`}>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <Link href={`/checklists/${list.id}`}>
                      <h2
                        className="text-2xl font-bold italic text-zinc-950 hover:text-emerald-600 transition-colors leading-tight mb-1"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                      >
                        {list.name}
                      </h2>
                    </Link>
                    <p className="text-sm text-zinc-500">{list.description}</p>
                  </div>
                  <Link
                    href={`/checklists/${list.id}`}
                    className="flex-shrink-0 text-xs font-bold text-zinc-400 hover:text-zinc-950 transition-colors inline-flex items-center gap-1 hidden sm:flex"
                  >
                    All {items.length} items <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
                  </Link>
                </div>

                <div className="space-y-2 mb-6">
                  {items.slice(0, 5).map((item) => {
                    if (!item) return null
                    const buyUrl = buildAffiliateUrl(item.amazon_url)
                    return (
                      <div key={item.id} className="flex items-center justify-between bg-zinc-50 rounded-xl px-4 py-3 border border-zinc-100 hover:border-zinc-300 hover:bg-white transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                          <span className="text-sm font-medium text-zinc-800">{item.name}</span>
                          <span className="text-xs text-emerald-600 font-semibold">{item.price_estimate}</span>
                        </div>
                        <a
                          href={buyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-zinc-950 text-white font-bold px-3 py-1 rounded-full hover:bg-zinc-700 transition-colors flex-shrink-0"
                        >
                          Buy
                        </a>
                      </div>
                    )
                  })}
                  {items.length > 5 && (
                    <Link
                      href={`/checklists/${list.id}`}
                      className="block text-sm text-zinc-400 font-semibold pt-1 hover:text-zinc-950 transition-colors"
                    >
                      + {items.length - 5} more items
                    </Link>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/checklists/${list.id}`}
                    className="text-sm font-bold text-zinc-950 border border-zinc-200 px-5 py-2.5 rounded-xl hover:border-zinc-400 transition-colors"
                  >
                    View full list
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-bold bg-zinc-950 text-white px-5 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors active:scale-[0.98] inline-flex items-center gap-1.5"
                  >
                    Copy to my room <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 bg-zinc-950 rounded-3xl p-10">
          <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-4">Share with roommates</p>
          <h2
            className="text-3xl font-bold italic text-white mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Want to share this list with your roommates?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-lg">
            Create a free account, invite your roommates with a code, and check things off together in real time.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-emerald-500 text-white font-bold text-base px-7 py-3.5 rounded-2xl hover:bg-emerald-400 transition-colors active:scale-[0.98]"
          >
            Create your room — free
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </main>

      <footer className="border-t border-zinc-100 py-8 px-6 text-center text-sm text-zinc-400 mt-8">
        <p>&copy; {new Date().getFullYear()} Roomd. <Link href="/terms" className="hover:text-zinc-950 transition-colors">Terms</Link> · <Link href="/privacy" className="hover:text-zinc-950 transition-colors">Privacy</Link> · <a href="mailto:support@roomdapp.com" className="hover:text-zinc-950 transition-colors">Support</a></p>
        <p className="mt-1 text-xs">As an Amazon Associate, Roomd earns from qualifying purchases.</p>
      </footer>
    </div>
  )
}
