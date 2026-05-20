'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { buildAffiliateUrl } from '@/lib/amazon'

interface RoomItem {
  id: string
  preset_id: string | null
  custom_name: string | null
  category: string | null
  is_checked: boolean
  claimed_by_name: string | null
  owned: boolean
  quantity: number
  name: string
  emoji: string
  price_estimate: string | null
  amazon_url: string | null
}

interface Member {
  display_name: string
}

interface Room {
  id: string
  name: string
  invite_code: string
}

interface ShareData {
  room: Room
  items: RoomItem[]
  members: Member[]
}

export default function SharePage() {
  const params = useParams()
  const code = params.code as string

  const [data, setData] = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/share/${code}`)
      if (!res.ok) {
        setNotFound(true)
        setLoading(false)
        return
      }
      const json = await res.json()
      setData(json)
      setLoading(false)
    }
    fetchData()
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm animate-pulse">Loading room...</div>
      </div>
    )
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-4">🏚️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Room not found</h1>
            <p className="text-gray-500 mb-6">
              This share link may be invalid or has been removed. Ask your roommate for a new link.
            </p>
            <Link
              href="/"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Go to Roomd
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const { room, items, members } = data
  const checkedItems = items.filter((i) => i.is_checked)
  const uncheckedItems = items.filter((i) => !i.is_checked)
  const progress = items.length > 0 ? Math.round((checkedItems.length / items.length) * 100) : 0
  const memberNames = members.map((m) => m.display_name).filter(Boolean)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {/* Room header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{room.name}</h1>
              {memberNames.length > 0 && (
                <p className="text-sm text-gray-500">
                  👥 {memberNames.join(', ')}
                </p>
              )}
            </div>
            <span className="text-3xl">🏠</span>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Checklist progress</span>
              <span className="font-semibold text-indigo-600">{progress}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {checkedItems.length} of {items.length} items covered
            </p>
          </div>
        </div>

        {/* Unchecked items */}
        {uncheckedItems.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Still needed
            </h2>
            <div className="space-y-2">
              {uncheckedItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Checked items */}
        {checkedItems.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Already covered ✅
            </h2>
            <div className="space-y-2">
              {checkedItems.map((item) => (
                <ItemCard key={item.id} item={item} checked />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3">🎓</div>
          <h3 className="font-bold text-indigo-900 text-lg mb-2">
            Want to coordinate with your roommates?
          </h3>
          <p className="text-indigo-700 text-sm mb-4">
            Create a free room on Roomd — claim items, track who&apos;s bringing what, and avoid duplicates.
          </p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm"
          >
            Create a free room →
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}

function ItemCard({ item, checked = false }: { item: RoomItem; checked?: boolean }) {
  const affiliateUrl = item.amazon_url ? buildAffiliateUrl(item.amazon_url) : null

  return (
    <div className={`bg-white rounded-2xl border px-4 py-3 flex items-center gap-3 ${checked ? 'opacity-60 border-gray-100' : 'border-gray-100 shadow-sm'}`}>
      <span className="text-2xl flex-shrink-0">{item.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-medium text-sm ${checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {item.name}
          </span>
          {item.quantity > 1 && (
            <span className="text-xs text-gray-400">×{item.quantity}</span>
          )}
          {item.owned && (
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
              Brought from home
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {item.price_estimate && (
            <span className="text-xs text-gray-400">{item.price_estimate}</span>
          )}
          {item.claimed_by_name && (
            <span className="text-xs text-indigo-500">Claimed by {item.claimed_by_name}</span>
          )}
        </div>
      </div>
      {!checked && affiliateUrl && (
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-xs bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          Buy on Amazon
        </a>
      )}
    </div>
  )
}

function PublicHeader() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="font-bold text-indigo-600 text-lg">Roomd</span>
        </Link>
        <Link
          href="/signup"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Sign up free →
        </Link>
      </div>
    </header>
  )
}

function PublicFooter() {
  return (
    <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
      <p>
        Made with ❤️ by{' '}
        <Link href="/" className="text-indigo-500 hover:underline">
          Roomd
        </Link>{' '}
        · Helping roommates coordinate since 2024
      </p>
    </footer>
  )
}
