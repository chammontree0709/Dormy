import type { Metadata } from 'next'
import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'
import { notFound } from 'next/navigation'
import { PRESET_LISTS, getItemById } from '@/data/presets'
import { buildAffiliateUrl } from '@/lib/amazon'
import AdUnit from '@/components/ui/AdUnit'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return PRESET_LISTS.map((list) => ({ slug: list.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const list = PRESET_LISTS.find((l) => l.id === slug)
  if (!list) return {}

  const title = `${list.name} Dorm Checklist`
  const description = `${list.description} Complete ${list.name.toLowerCase()} checklist for college students — every item with Amazon links.`

  return {
    title,
    description,
    alternates: { canonical: `https://roomdapp.com/checklists/${slug}` },
    openGraph: {
      title: `${title} — Roomd`,
      description,
      url: `https://roomdapp.com/checklists/${slug}`,
    },
  }
}

export default async function ChecklistSlugPage({ params }: Props) {
  const { slug } = await params
  const list = PRESET_LISTS.find((l) => l.id === slug)
  if (!list) notFound()

  const items = list.itemIds.map((id) => getItemById(id)).filter(Boolean)
  const essentialCount = items.filter((i) => i?.priority === 'essential').length
  const totalPrice = items.reduce((sum, item) => {
    if (!item) return sum
    const match = item.price_estimate.match(/\$(\d+)/)
    return sum + (match ? parseInt(match[1]) : 0)
  }, 0)

  const priorityLabel: Record<string, string> = {
    essential: 'Must-have',
    recommended: 'Recommended',
    'nice-to-have': 'Nice to have',
  }
  const priorityColor: Record<string, string> = {
    essential: 'bg-red-100 text-red-700',
    recommended: 'bg-blue-100 text-blue-700',
    'nice-to-have': 'bg-gray-100 text-gray-600',
  }

  const otherLists = PRESET_LISTS.filter((l) => l.id !== slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-zinc-100 sticky top-0 bg-white/90 backdrop-blur-md z-40">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={30} />
            <span className="font-black text-zinc-950 text-xl">Roomd</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-zinc-500 hover:text-zinc-950 transition-colors">Log in</Link>
            <Link href="/signup" className="bg-zinc-950 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-zinc-800 transition-colors active:scale-[0.98]">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/checklists" className="hover:text-emerald-600 transition-colors">Checklists</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{list.name}</span>
        </nav>

        {/* Header */}
        <div className="border-b border-zinc-200 pb-8 mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold italic text-zinc-950 mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {list.name}
          </h1>
          <p className="text-zinc-500 text-lg mb-4">{list.description}</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-full font-semibold">{items.length} items</span>
            <span className="bg-red-50 text-red-700 px-3 py-1.5 rounded-full font-semibold">{essentialCount} must-haves</span>
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-semibold">Starting from ~${totalPrice}</span>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-2 mb-10">
          {items.map((item) => {
            if (!item) return null
            const buyUrl = buildAffiliateUrl(item.amazon_url)
            return (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl flex-shrink-0">{item.image_emoji}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500 truncate hidden sm:block">{item.price_estimate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold hidden sm:block ${priorityColor[item.priority]}`}>
                    {priorityLabel[item.priority]}
                  </span>
                  <a
                    href={buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded-full hover:bg-amber-200 transition-colors"
                  >
                    Buy →
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Ad — between item list and CTA */}
        <div className="my-8">
          <AdUnit slot="XXXXXXXXXX" />
        </div>

        {/* CTA */}
        <div className="bg-zinc-950 rounded-3xl p-8 mb-12">
          <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-3">Share with roommates</p>
          <h2
            className="text-2xl font-bold italic text-white mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Share this list with your roommates.
          </h2>
          <p className="text-zinc-400 mb-6 max-w-md">
            Create a free room, invite your roommates with a code, and check items off together in real time.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-emerald-500 text-white font-bold px-7 py-3.5 rounded-2xl hover:bg-emerald-400 transition-colors active:scale-[0.98]"
          >
            Copy this list to my room — free
          </Link>
        </div>

        {/* Other lists */}
        {otherLists.length > 0 && (
          <div>
            <h2
              className="text-xl font-bold italic text-zinc-950 mb-5"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              More checklists
            </h2>
            <div className="border-t border-zinc-200">
              {otherLists.map((other) => (
                <Link
                  key={other.id}
                  href={`/checklists/${other.id}`}
                  className="flex items-center justify-between py-4 border-b border-zinc-200 hover:bg-zinc-50 -mx-4 px-4 transition-colors group"
                >
                  <div>
                    <p className="font-bold text-sm text-zinc-950">{other.name}</p>
                    <p className="text-xs text-zinc-400">{other.itemIds.length} items</p>
                  </div>
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-950 transition-colors">View →</span>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/checklists" className="text-sm text-zinc-400 font-semibold hover:text-zinc-950 transition-colors">
                View all checklists
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-100 py-8 px-6 text-center text-sm text-zinc-400 mt-8">
        <p>&copy; {new Date().getFullYear()} Roomd. <Link href="/terms" className="hover:text-zinc-950 transition-colors">Terms</Link> · <Link href="/privacy" className="hover:text-zinc-950 transition-colors">Privacy</Link> · <a href="mailto:support@roomdapp.com" className="hover:text-zinc-950 transition-colors">Support</a></p>
        <p className="mt-1 text-xs">As an Amazon Associate, Roomd earns from qualifying purchases.</p>
      </footer>
    </div>
  )
}
