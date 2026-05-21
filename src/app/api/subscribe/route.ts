import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildWelcomeEmail } from '@/lib/emails/welcome'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email || !String(email).includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const normalizedEmail = String(email).toLowerCase().trim()

  const supabase = await createClient()
  const { error } = await supabase.from('email_signups').insert({ email: normalizedEmail })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ message: "You're already on the list!" })
    }
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }

  // Send welcome email (fire and forget — don't block the response)
  resend.emails.send({
    from: 'Roomd <hello@roomdapp.com>',
    to: normalizedEmail,
    subject: 'Your dorm room era starts now.',
    html: buildWelcomeEmail(),
  }).catch(() => {})

  return NextResponse.json({ message: "You're on the list!" })
}
