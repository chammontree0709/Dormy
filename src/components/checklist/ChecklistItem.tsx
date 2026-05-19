'use client'

import { RoomItem } from '@/types'
import { getItemById, getCategoryById } from '@/data/presets'
import { cn } from '@/lib/utils'
import { Trash2, ExternalLink, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { buildAffiliateUrl } from '@/lib/amazon'

interface ChecklistItemProps {
  item: RoomItem
  onToggle: (id: string, checked: boolean) => void
  onDelete: (id: string) => void
  currentUserName: string
}

export default function ChecklistItem({ item, onToggle, onDelete, currentUserName }: ChecklistItemProps) {
  const preset = item.preset_id ? getItemById(item.preset_id) : null
  const name = preset?.name ?? item.custom_name ?? 'Unnamed item'
  const buyUrl = preset ? buildAffiliateUrl(preset.amazon_url) : (item.custom_url ?? null)

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border transition-all duration-200',
        item.is_checked
          ? 'bg-green-50 border-green-200 opacity-75'
          : 'bg-white border-gray-100 hover:border-indigo-100 hover:shadow-sm'
      )}
    >
      <button
        onClick={() => onToggle(item.id, !item.is_checked)}
        className={cn(
          'flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all duration-150',
          item.is_checked
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-indigo-400'
        )}
        aria-label={item.is_checked ? 'Mark as needed' : 'Mark as bought'}
      >
        {item.is_checked && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cn('font-medium text-gray-900 truncate', item.is_checked && 'line-through text-gray-500')}>
              {preset && <span className="mr-1">{preset.image_emoji}</span>}
              {name}
            </p>
            {item.is_checked && item.checked_by_name && (
              <p className="text-xs text-green-600 mt-0.5">
                Bought by {item.checked_by_name}
              </p>
            )}
            {!item.is_checked && preset && (
              <p className="text-xs text-gray-500 mt-0.5">{preset.price_estimate}</p>
            )}
            {item.notes && (
              <p className="text-xs text-gray-400 mt-1 italic">{item.notes}</p>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {buyUrl && !item.is_checked && (
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors"
                title="Buy on Amazon"
              >
                <ShoppingCart size={12} />
                <span className="hidden sm:block">Buy</span>
              </a>
            )}
            {preset && (
              <Link
                href={`item/${item.preset_id}`}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="View details & reviews"
              >
                <ExternalLink size={14} />
              </Link>
            )}
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
