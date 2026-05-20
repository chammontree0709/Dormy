import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, GraduationCap, Users, Layout, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'College Dorm Guides',
  description: 'Free guides for college students — what to pack, how to set up your dorm, and how to split costs with your roommates.',
  alternates: { canonical: 'https://roomdapp.com/guides' },
}

const guides = [
  {
    slug: 'what-to-pack-for-college',
    title: 'What to Pack for Your First Year of College',
    description: 'The complete packing list for incoming freshmen — from bedding and bathroom essentials to tech gear and school supplies.',
    Icon: GraduationCap,
    readTime: '8 min read',
    tag: 'Packing',
  },
  {
    slug: 'how-to-split-dorm-costs',
    title: 'How to Split Dorm Costs with Your Roommate',
    description: 'A simple system for figuring out who buys what, how to avoid duplicate purchases, and how to keep things fair.',
    Icon: Users,
    readTime: '5 min read',
    tag: 'Roommates',
  },
  {
    slug: 'dorm-room-setup-ideas',
    title: 'Dorm Room Setup Ideas: Make the Most of a Small Space',
    description: 'Practical tips for maximizing a tiny dorm room — storage hacks, furniture layout, and how to make it feel like home.',
    Icon: Layout,
    readTime: '6 min read',
    tag: 'Setup',
  },
  {
    slug: 'move-in-day-checklist',
    title: 'The College Move-In Day Checklist',
    description: 'Everything you need to do before, during, and after move-in day — so nothing gets left behind and nothing goes wrong.',
    Icon: Package,
    readTime: '5 min read',
    tag: 'Move-In',
  },
]

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-zinc-100 sticky top-0 bg-white/90 backdrop-blur-md z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Roomd" height={30} width={30} className="rounded-lg" />
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
        {/* Page header */}
        <div className="border-b border-zinc-200 pb-10 mb-0">
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4">Editorial</p>
          <h1
            className="text-4xl md:text-5xl font-bold italic text-zinc-950 leading-tight mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            College Dorm Guides
          </h1>
          <p className="text-zinc-500 text-lg max-w-[48ch]">
            Everything you need to know before move-in day.
          </p>
        </div>

        {/* Guides — structural divider list */}
        <div>
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex items-start gap-6 py-8 border-b border-zinc-200 hover:bg-zinc-50/50 transition-colors -mx-6 px-6"
            >
              <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-50 transition-colors">
                <guide.Icon className="w-5 h-5 text-zinc-500 group-hover:text-emerald-600 transition-colors" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase">{guide.tag}</span>
                  <span className="text-xs text-zinc-300">·</span>
                  <span className="text-xs text-zinc-400">{guide.readTime}</span>
                </div>
                <h2
                  className="text-xl font-bold italic text-zinc-950 group-hover:text-emerald-600 transition-colors mb-1.5 leading-snug"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {guide.title}
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed">{guide.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-950 transition-colors flex-shrink-0 mt-2 hidden sm:block" strokeWidth={2} />
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-zinc-950 rounded-3xl p-10">
          <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-4">Ready to coordinate</p>
          <h2
            className="text-3xl font-bold italic text-white mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Ready to coordinate with your roommates?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-lg">
            Create a free shared checklist, invite your roommates, and check things off together.
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
