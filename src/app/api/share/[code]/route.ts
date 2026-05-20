import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getItemById } from '@/data/presets'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const supabase = createAdminClient()

  const { data: room } = await supabase
    .from('rooms')
    .select('id, name, invite_code')
    .eq('invite_code', code)
    .single()

  if (!room) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const [{ data: items }, { data: members }] = await Promise.all([
    supabase.from('room_items').select('*').eq('room_id', room.id).order('added_at'),
    supabase.from('room_members').select('display_name').eq('room_id', room.id),
  ])

  // Enrich items with preset data
  const enriched = (items ?? []).map((item: any) => {
    const preset = item.preset_id ? getItemById(item.preset_id) : null
    return {
      ...item,
      name: preset?.name ?? item.custom_name ?? 'Item',
      emoji: preset?.image_emoji ?? '📦',
      price_estimate: preset?.price_estimate ?? null,
      amazon_url: preset?.amazon_url ?? item.custom_url ?? null,
    }
  })

  return NextResponse.json({ room, items: enriched, members: members ?? [] })
}
