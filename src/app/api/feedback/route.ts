import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { rating, category, message } = await request.json()

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('app_feedback').insert({
    user_id: user?.id ?? null,
    display_name: user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? null,
    email: user?.email ?? null,
    rating: rating ?? null,
    category: category ?? 'general',
    message: message.trim(),
  })

  if (error) {
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Thanks for your feedback!' })
}
