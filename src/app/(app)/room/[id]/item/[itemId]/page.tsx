'use client'

import { getItemById, getCategoryById } from '@/data/presets'
import { buildAffiliateUrl } from '@/lib/amazon'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Star, ShoppingCart, Tag } from 'lucide-react'
import AdUnit from '@/components/ui/AdUnit'
import Link from 'next/link'
import { use } from 'react'
import { cn } from '@/lib/utils'

export default function ItemDetailPage({ params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { id: roomId, itemId } = use(params)
  const item = getItemById(itemId)

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Item not found</p>
          <Link href={`/room/${roomId}`}><Button variant="ghost"><ArrowLeft size={16} className="mr-1" /> Back to room</Button></Link>
        </div>
      </div>
    )
  }

  const category = getCategoryById(item.category)
  const buyUrl = buildAffiliateUrl(item.amazon_url)
  const avgRating = item.reviews.length
    ? (item.reviews.reduce((sum, r) => sum + r.rating, 0) / item.reviews.length).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <Link href={`/room/${roomId}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 font-medium">
          <ArrowLeft size={16} /> Back to checklist
        </Link>

        <Card className="mb-4">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
              {item.image_emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">
                {category?.icon} {category?.name}
              </p>
              <h1 className="text-2xl font-black text-gray-900 leading-tight">{item.name}</h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-lg font-bold text-gray-700">{item.price_estimate}</span>
                <span className={cn('text-xs px-2.5 py-1 rounded-full font-semibold', {
                  'bg-red-100 text-red-700': item.priority === 'essential',
                  'bg-blue-100 text-blue-700': item.priority === 'recommended',
                  'bg-gray-100 text-gray-600': item.priority === 'nice-to-have',
                })}>
                  {item.priority}
                </span>
                {avgRating && (
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-gray-700">{avgRating}</span>
                    <span className="text-xs text-gray-400">({item.reviews.length} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">{item.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>

          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-amber-100 text-base"
          >
            <ShoppingCart size={20} /> Buy on Amazon
          </a>
          <p className="text-center text-xs text-gray-400 mt-2">
            As an Amazon Associate, Roomd earns from qualifying purchases.
          </p>
        </Card>

        {item.reviews.length > 0 && (
          <div>
            <h2 className="font-black text-xl text-gray-900 mb-4">Student Reviews</h2>
            <div className="space-y-3">
              {item.reviews.map((review, i) => (
                <Card key={i}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {review.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <p className="font-bold text-sm text-gray-900">{review.author}</p>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={13}
                              className={star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200 fill-gray-200'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <AdUnit slot="XXXXXXXXXX" />
        </div>
      </main>
    </div>
  )
}
