'use client'

import { useState } from 'react'
import { RoomItem } from '@/types'
import { getItemById } from '@/data/presets'
import { cn } from '@/lib/utils'
import { Trash2, ExternalLink, ShoppingCart, Hand, MessageSquare, Home, Check } from 'lucide-react'
import Link from 'next/link'
import { buildAffiliateUrl } from '@/lib/amazon'

interface ChecklistItemProps {
  item: RoomItem
  roomId: string
  onToggle: (id: string, checked: boolean) => void
  onDelete: (id: string) => void
  onClaim: (id: string, claimed: boolean) => void
  onQuantityChange: (id: string, quantity: number) => void
  onNoteChange?: (id: string, note: string) => void
  onOwnedChange?: (id: string, owned: boolean) => void
  currentUserName: string
  shoppingMode?: boolean
}

export default function ChecklistItem({
  item, roomId, onToggle, onDelete, onClaim, onQuantityChange, onNoteChange, onOwnedChange, currentUserName, shoppingMode = false
}: ChecklistItemProps) {
  const [showNote, setShowNote] = useState(false)
  const [draftNote, setDraftNote] = useState(item.notes ?? '')

  const qty = item.quantity ?? 1
  const preset = item.preset_id ? getItemById(item.preset_id) : null
  const name = preset?.name ?? item.custom_name ?? 'Unnamed item'
  const buyUrl = preset ? buildAffiliateUrl(preset.amazon_url) : (item.custom_url ?? null)

  const isClaimed = !!item.claimed_by_name
  const isClaimedByMe = item.claimed_by_name === currentUserName

  function saveNote() {
    onNoteChange?.(item.id, draftNote)
    setShowNote(false)
  }

  // Shopping mode — large, touch-friendly, minimal
  if (shoppingMode) {
    return (
      <button
        onClick={() => onToggle(item.id, !item.is_checked)}
        className={cn(
          'w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left',
          item.is_checked
            ? 'bg-green-50 dark:bg-green-950/40 border-green-300 dark:border-green-900 opacity-60'
            : 'bg-white border-zinc-200 active:scale-[0.98]'
        )}
      >
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center',
          item.is_checked ? 'bg-green-500 border-green-500 text-white' : 'border-zinc-300'
        )}>
          {item.is_checked && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('font-semibold text-lg text-zinc-950', item.is_checked && 'line-through text-zinc-400')}>
            {name}
            {qty > 1 && <span className="ml-2 text-sm font-bold text-emerald-600">×{qty}</span>}
          </p>
          {preset && <p className="text-sm text-zinc-400 mt-0.5">{preset.price_estimate}</p>}
        </div>
      </button>
    )
  }

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200',
        item.is_checked
          ? 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-900 opacity-75'
          : item.owned
          ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900'
          : isClaimed
          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900'
          : 'bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-sm'
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={() => onToggle(item.id, !item.is_checked)}
          className={cn(
            'flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all duration-150',
            item.is_checked
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-zinc-300 hover:border-emerald-400'
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
              <div className="flex items-center gap-2 min-w-0">
                <p className={cn('font-medium text-zinc-950 truncate', item.is_checked && 'line-through text-zinc-400')}>
                  {name}
                </p>
                {qty > 1 && (
                  <span className="flex-shrink-0 text-xs font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md">×{qty}</span>
                )}
              </div>

              {item.is_checked && item.checked_by_name && (
                <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                  <Check size={11} strokeWidth={2.5} /> Bought by {item.checked_by_name}
                </p>
              )}
              {!item.is_checked && isClaimed && (
                <p className="text-xs text-amber-600 mt-0.5 font-semibold flex items-center gap-1">
                  <Hand size={11} strokeWidth={2} />
                  {isClaimedByMe ? "You're buying this" : `${item.claimed_by_name} is buying this`}
                </p>
              )}
              {item.owned && !item.is_checked && (
                <p className="text-xs text-sky-600 mt-0.5 font-semibold flex items-center gap-1">
                  <Home size={11} strokeWidth={2} /> Bringing from home
                </p>
              )}
              {!item.is_checked && !isClaimed && !item.owned && preset && (
                <p className="text-xs text-zinc-400 mt-0.5">{preset.price_estimate}</p>
              )}
              {item.notes && !showNote && (
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <MessageSquare size={11} strokeWidth={2} /> {item.notes}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {!item.is_checked && (
                <button
                  onClick={() => onClaim(item.id, !isClaimed || !isClaimedByMe)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                    isClaimedByMe
                      ? 'bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 hover:bg-amber-300'
                      : isClaimed
                      ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                  )}
                  disabled={isClaimed && !isClaimedByMe}
                  title={isClaimedByMe ? 'Unclaim' : isClaimed ? `${item.claimed_by_name} claimed this` : "I'll buy this"}
                >
                  <Hand size={12} />
                  <span className="hidden sm:block">
                    {isClaimedByMe ? 'Claimed' : isClaimed ? 'Taken' : "I'll buy"}
                  </span>
                </button>
              )}

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

              <button
                onClick={() => onOwnedChange?.(item.id, !item.owned)}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  item.owned
                    ? 'text-sky-600 bg-sky-50 hover:bg-sky-100'
                    : 'text-zinc-400 hover:text-sky-500 hover:bg-sky-50'
                )}
                title={item.owned ? 'Mark as need to buy' : 'Bringing from home'}
              >
                <Home size={14} />
              </button>
              <button
                onClick={() => { setShowNote((v) => !v); setDraftNote(item.notes ?? '') }}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  showNote || item.notes
                    ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100'
                    : 'text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50'
                )}
                title={item.notes ? 'Edit note' : 'Add note'}
              >
                <MessageSquare size={14} />
              </button>

              {preset && (
                <Link
                  href={`/room/${roomId}/item/${item.preset_id}`}
                  className="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="View details & reviews"
                >
                  <ExternalLink size={14} />
                </Link>
              )}
              <div className="flex items-center gap-0.5 border border-zinc-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => qty > 1 ? onQuantityChange(item.id, qty - 1) : onDelete(item.id)}
                  className="px-2 py-1.5 text-zinc-500 hover:bg-zinc-100 transition-colors text-sm font-bold leading-none"
                >−</button>
                <span className="px-1.5 text-xs font-semibold text-zinc-700 select-none">{qty}</span>
                <button
                  onClick={() => onQuantityChange(item.id, qty + 1)}
                  className="px-2 py-1.5 text-zinc-500 hover:bg-zinc-100 transition-colors text-sm font-bold leading-none"
                >+</button>
              </div>
              <button
                onClick={() => onDelete(item.id)}
                className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Note editor */}
      {showNote && (
        <div className="px-4 pb-3 pt-0 flex gap-2 items-end">
          <textarea
            autoFocus
            rows={2}
            value={draftNote}
            onChange={(e) => setDraftNote(e.target.value)}
            placeholder="Add a note for your roommates…"
            className="flex-1 text-sm border border-emerald-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300 text-zinc-700 placeholder-zinc-400"
          />
          <div className="flex flex-col gap-1.5">
            <button
              onClick={saveNote}
              className="px-3 py-1.5 bg-zinc-950 text-white text-xs font-bold rounded-lg hover:bg-zinc-800"
            >Save</button>
            <button
              onClick={() => setShowNote(false)}
              className="px-3 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-lg hover:bg-zinc-200"
            >Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
