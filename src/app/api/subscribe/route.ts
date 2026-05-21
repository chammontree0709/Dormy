import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email || !String(email).includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('email_signups').insert({ email: String(email).toLowerCase().trim() })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ message: "You're already on the list!" })
    }
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }

  return NextResponse.json({ message: "You're on the list!" })
}
