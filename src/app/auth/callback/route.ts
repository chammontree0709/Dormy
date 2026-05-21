import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const invite = searchParams.get('invite')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)

    if (invite && user) {
      const displayName =
        user.user_metadata?.display_name ??
        user.user_metadata?.full_name ??
        user.email?.split('@')[0] ??
        'Roommate'
      await supabase.rpc('join_room_by_invite_code', {
        p_invite_code: invite.trim().toUpperCase(),
        p_display_name: displayName,
      })
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
