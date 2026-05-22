'use client'

import { useState } from 'react'
import { RoomItem } from '@/types'
import { getItemById } from '@/data/presets'
import { cn } from '@/lib/utils'
import { Trash2, ExternalLink, ShoppingCart, Hand, MessageSquare, Home, Check, DollarSign, Minus, Plus } from 'lucide-react'
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
  onClaimChange?: (id: string, quantity: number, splittingCost: boolean) => void
  currentUserName: string
  currentUserId?: string
  shoppingMode?: boolean
}

export default function ChecklistItem({
  item, roomId, onToggle, onDelete, onClaim, onQuantityChange, onNoteChange, onOwnedChange, onClaimChange, currentUserName, currentUserId, shoppingMode = false
}: ChecklistItemProps) {
  const [showNote, setShowNote] = useState(false)
  const [draftNote, setDraftNote] = useState(item.notes ?? '')

  const qty = item.quantity ?? 1
  const preset = item.preset_id ? getItemById(item.preset_id) : null
  const name = preset?.name ?? item.custom_name ?? 'Unnamed item'
  const buyUrl = preset ? buildAffiliateUrl(preset.amazon_url) : (item.custom_url ?? null)

  // Legacy single-claim (backwards compat)
  const isClaimed = !!item.claimed_by_name
  const isClaimedByMe = item.claimed_by_name === currentUserName

  // New per-person claims
  const claims = item.claims ?? []
  const myClaim = currentUserId ? claims.find(c => c.user_id === currentUserId) : null
  const myClaimQty = myClaim?.quantity ?? 0
  const isSplitting = myClaim?.splitting_cost ?? false
  const anySplit = claims.some(c => c.splitting_cost)
  const claimsWithQty = claims.filter(c => c.quantity > 0)
  const totalClaimed = claims.reduce((sum, c) => sum + c.quantity, 0)
  const usesNewClaims = claims.length > 0

  function saveNote() {
    onNoteChange?.(item.id, draftNote)
    setShowNote(false)
  }

  function handleClaimQty(delta: number) {
    const next = Math.max(0, Math.min(qty, myClaimQty + delta))
    onClaimChange?.(item.id, next, isSplitting)
  }

  function handleSplitToggle() {
    onClaimChange?.(item.id, myClaimQty, !isSplitting)
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
          : anySplit
          ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-900'
          : (usesNewClaims && totalClaimed > 0) || (!usesNewClaims && isClaimed)
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
          {/* Row 1: name + status badges */}
          <div className="flex items-start gap-2 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                {preset ? (
                  <Link
                    href={`/room/${roomId}/item/${item.preset_id}`}
                    className={cn('font-medium text-zinc-950 truncate hover:text-emerald-600 transition-colors', item.is_checked && 'line-through text-zinc-400')}
                  >
                    {name}
                  </Link>
                ) : (
                  <p className={cn('font-medium text-zinc-950 truncate', item.is_checked && 'line-through text-zinc-400')}>
                    {name}
                  </p>
                )}
                {qty > 1 && (
                  <span className="flex-shrink-0 text-xs font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md">×{qty}</span>
                )}
                {!item.is_checked && totalClaimed >= qty && totalClaimed > 0 && (
                  <span className="flex-shrink-0 text-xs font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-md">covered ✓</span>
                )}
              </div>

              {/* Status line */}
              {item.is_checked && item.checked_by_name && (
                <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                  <Check size={11} strokeWidth={2.5} /> Bought by {item.checked_by_name}
                </p>
              )}
              {!item.is_checked && !usesNewClaims && isClaimed && (
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
              {!item.is_checked && !isClaimed && !item.owned && !usesNewClaims && preset && (
                <p className="text-xs text-zinc-400 mt-0.5">{preset.price_estimate}</p>
              )}
              {item.notes && !showNote && (
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <MessageSquare size={11} strokeWidth={2} /> {item.notes}
                </p>
              )}

              {/* Per-person claims summary */}
              {!item.is_checked && (claimsWithQty.length > 0 || anySplit) && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {claimsWithQty.map(c => (
                    <span key={c.user_id} className="text-xs px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-md font-medium">
                      {c.display_name}: ×{c.quantity}
                    </span>
                  ))}
                  {anySplit && (
                    <span className="text-xs px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-300 rounded-md font-medium">
                      💰 Splitting: {claims.filter(c => c.splitting_cost).map(c => c.display_name).join(' + ')}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: actions */}
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {/* qty === 1: single-person claim toggle */}
            {!item.is_checked && qty === 1 && onClaimChange && (() => {
              const someoneClaimed = claimsWithQty.length > 0
              const iClaimedIt = myClaimQty > 0
              return (
                <button
                  onClick={() => onClaimChange(item.id, iClaimedIt ? 0 : 1, isSplitting)}
                  disabled={someoneClaimed && !iClaimedIt}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                    iClaimedIt
                      ? 'bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 hover:bg-amber-300'
                      : someoneClaimed
                      ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                  )}
                  title={iClaimedIt ? 'Unclaim' : someoneClaimed ? `${claimsWithQty[0]?.display_name} is buying this` : "I'll buy this"}
                >
                  <Hand size={12} />
                  {iClaimedIt ? 'Claimed' : someoneClaimed ? 'Taken' : "I'll buy"}
                </button>
              )
            })()}

            {/* qty > 1: per-person stepper, capped at total qty */}
            {!item.is_checked && qty > 1 && onClaimChange && (
              <div className={cn(
                'flex items-center rounded-lg overflow-hidden border transition-colors',
                myClaimQty > 0
                  ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/40'
                  : 'border-zinc-200 bg-white dark:bg-zinc-800'
              )}>
                <span className="pl-2 text-xs font-semibold text-zinc-500 select-none whitespace-nowrap">Mine</span>
                <button
                  onClick={() => handleClaimQty(-1)}
                  className="px-2 py-1.5 text-zinc-500 hover:bg-zinc-100 text-sm font-bold leading-none transition-colors"
                >−</button>
                <span className={cn('px-1 text-xs font-bold select-none min-w-[14px] text-center', myClaimQty > 0 ? 'text-amber-700' : 'text-zinc-400')}>
                  {myClaimQty}
                </span>
                <button
                  onClick={() => handleClaimQty(1)}
                  disabled={myClaimQty >= qty}
                  className="px-2 py-1.5 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold leading-none transition-colors"
                >+</button>
              </div>
            )}

            {/* Split cost toggle */}
            {!item.is_checked && onClaimChange && (
              <button
                onClick={handleSplitToggle}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  isSplitting
                    ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700'
                    : 'text-zinc-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/30'
                )}
                title="Split the cost of this item with roommates"
              >
                <DollarSign size={12} />
                {isSplitting ? 'Splitting' : 'Split'}
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
                <ShoppingCart size={12} /> Buy
              </a>
            )}

            <button
              onClick={() => onOwnedChange?.(item.id, !item.owned)}
              className={cn(
                'p-2 rounded-lg transition-colors',
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
                'p-2 rounded-lg transition-colors',
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
                className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="View details & reviews"
              >
                <ExternalLink size={14} />
              </Link>
            )}

            <div className="flex items-center gap-0.5 border border-zinc-200 rounded-lg overflow-hidden">
              <button
                onClick={() => qty > 1 ? onQuantityChange(item.id, qty - 1) : onDelete(item.id)}
                className="px-2.5 py-2 text-zinc-500 hover:bg-zinc-100 transition-colors text-sm font-bold leading-none"
              >−</button>
              <span className="px-1.5 text-xs font-semibold text-zinc-700 select-none">{qty}</span>
              <button
                onClick={() => onQuantityChange(item.id, qty + 1)}
                className="px-2.5 py-2 text-zinc-500 hover:bg-zinc-100 transition-colors text-sm font-bold leading-none"
              >+</button>
            </div>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
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
            onBlur={saveNote}
            placeholder="Add a note for your roommates…"
            className="flex-1 text-sm border border-emerald-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300 text-zinc-700 placeholder-zinc-400"
          />
          <div className="flex flex-col gap-1.5">
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={saveNote}
              className="px-3 py-1.5 bg-zinc-950 text-white text-xs font-bold rounded-lg hover:bg-zinc-800"
            >Save</button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { setDraftNote(item.notes ?? ''); setShowNote(false) }}
              className="px-3 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-lg hover:bg-zinc-200"
            >Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
