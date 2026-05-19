import Link from 'next/link'
import { PRESET_LISTS, PRESET_ITEMS, getItemById } from '@/data/presets'
import { buildAffiliateUrl } from '@/lib/amazon'

export default function ChecklistsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="font-black text-indigo-600 text-xl">Roomd</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900">Log in</Link>
            <Link href="/signup" className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-3">Dorm Room Checklists</h1>
          <p className="text-gray-500 text-lg">Everything you need for move-in day. Browse, then copy to your shared room.</p>
        </div>

        <div className="space-y-10">
          {PRESET_LISTS.slice(0, 4).map((list) => {
            const items = list.itemIds.map((id) => getItemById(id)).filter(Boolean)
            return (
              <div key={list.id} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">{list.emoji}</span>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">{list.name}</h2>
                    <p className="text-sm text-gray-500">{list.description}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  {items.slice(0, 5).map((item) => {
                    if (!item) return null
                    const buyUrl = buildAffiliateUrl(item.amazon_url)
                    return (
                      <div key={item.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100">
                        <div className="flex items-center gap-2">
                          <span>{item.image_emoji}</span>
                          <span className="text-sm font-medium text-gray-800">{item.name}</span>
                          <span className="text-xs text-indigo-600 font-semibold">{item.price_estimate}</span>
                        </div>
                        <a
                          href={buyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full hover:bg-amber-200 transition-colors flex-shrink-0"
                        >
                          Buy →
                        </a>
                      </div>
                    )
                  })}
                  {items.length > 5 && (
                    <p className="text-sm text-gray-400 text-center pt-1">+ {items.length - 5} more items</p>
                  )}
                </div>

                <Link
                  href="/signup"
                  className="block w-full text-center bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Copy this list to my room — free
                </Link>
              </div>
            )
          })}
        </div>

        <div className="mt-12 bg-indigo-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Want to share this list with your roommates?</h2>
          <p className="text-gray-500 mb-6">Create a free account, invite your roommates with a code, and check things off together in real time.</p>
          <Link href="/signup" className="inline-block bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-colors">
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
