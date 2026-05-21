import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const invite = searchParams.get('invite')
  const next = searchParams.get('next') ?? '/dashboard'

  const redirectResponse = NextResponse.redirect(`${origin}${next}`)

  if (code) {
    const cookieStore = await cookies()
    // Build a Supabase client that writes session cookies onto the redirect response
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Write onto the response so they survive the redirect
              redirectResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

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

  return redirectResponse
}
