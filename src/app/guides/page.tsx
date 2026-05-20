import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

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
    emoji: '🎓',
    readTime: '8 min read',
    tag: 'Packing',
  },
  {
    slug: 'how-to-split-dorm-costs',
    title: 'How to Split Dorm Costs with Your Roommate',
    description: 'A simple system for figuring out who buys what, how to avoid duplicate purchases, and how to keep things fair.',
    emoji: '🤝',
    readTime: '5 min read',
    tag: 'Roommates',
  },
  {
    slug: 'dorm-room-setup-ideas',
    title: 'Dorm Room Setup Ideas: Make the Most of a Small Space',
    description: 'Practical tips for maximizing a tiny dorm room — storage hacks, furniture layout, and how to make it feel like home.',
    emoji: '🛋️',
    readTime: '6 min read',
    tag: 'Setup',
  },
  {
    slug: 'move-in-day-checklist',
    title: 'The College Move-In Day Checklist',
    description: 'Everything you need to do before, during, and after move-in day — so nothing gets left behind and nothing goes wrong.',
    emoji: '📦',
    readTime: '5 min read',
    tag: 'Move-In',
  },
]

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Roomd" height={30} width={30} className="rounded-lg" />
            <span className="font-black text-emerald-600 text-xl">Roomd</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900">Log in</Link>
            <Link href="/signup" className="bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-3">College Dorm Guides</h1>
          <p className="text-gray-500 text-lg">Everything you need to know before move-in day.</p>
        </div>

        <div className="space-y-4">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="flex items-start gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all group"
            >
              <span className="text-4xl flex-shrink-0">{guide.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{guide.tag}</span>
                  <span className="text-xs text-gray-400">{guide.readTime}</span>
                </div>
                <h2 className="text-lg font-black text-gray-900 group-hover:text-emerald-700 transition-colors mb-1">{guide.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{guide.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-emerald-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Ready to coordinate with your roommates?</h2>
          <p className="text-gray-500 mb-6">Create a free shared checklist, invite your roommates, and check things off together.</p>
          <Link href="/signup" className="inline-block bg-emerald-600 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-emerald-700 transition-colors">
            Create your room — free
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 px-4 text-center text-sm text-gray-400 mt-8">
        <p>© {new Date().getFullYear()} Roomd. <Link href="/terms" className="hover:underline">Terms</Link> · <Link href="/privacy" className="hover:underline">Privacy</Link> · <a href="mailto:support@roomdapp.com" className="hover:underline">Support</a></p>
        <p className="mt-1 text-xs">As an Amazon Associate, Roomd earns from qualifying purchases.</p>
      </footer>
    </div>
  )
}
