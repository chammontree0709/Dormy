import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{list.emoji}</span>
            <h1 className="text-3xl font-black text-gray-900">{list.name}</h1>
          </div>
          <p className="text-gray-500 text-lg mb-4">{list.description}</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-semibold">{items.length} items</span>
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
        <div className="bg-emerald-50 rounded-2xl p-8 text-center mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Share this list with your roommates</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Create a free room, invite your roommates with a code, and check items off together in real time. No more duplicate purchases.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-emerald-600 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-emerald-700 transition-colors"
          >
            Copy this list to my room — free
          </Link>
        </div>

        {/* Other lists */}
        {otherLists.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-4">More checklists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {otherLists.map((other) => (
                <Link
                  key={other.id}
                  href={`/checklists/${other.id}`}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
                >
                  <span className="text-2xl">{other.emoji}</span>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{other.name}</p>
                    <p className="text-xs text-gray-500">{other.itemIds.length} items</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link href="/checklists" className="text-sm text-emerald-600 font-semibold hover:underline">
                View all checklists →
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-100 py-8 px-4 text-center text-sm text-gray-400 mt-8">
        <p>© {new Date().getFullYear()} Roomd. <Link href="/terms" className="hover:underline">Terms</Link> · <Link href="/privacy" className="hover:underline">Privacy</Link> · <a href="mailto:support@roomdapp.com" className="hover:underline">Support</a></p>
        <p className="mt-1 text-xs">As an Amazon Associate, Roomd earns from qualifying purchases.</p>
      </footer>
    </div>
  )
}
