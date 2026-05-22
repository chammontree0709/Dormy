import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildWelcomeEmail } from '@/lib/emails/welcome'

const resend = new Resend(process.env.RESEND_API_KEY)

// Simple in-memory rate limiter: 5 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (entry.count >= 5) return true
  entry.count++
  return false
}

function sendWelcomeEmail(email: string) {
  return resend.emails.send({
    from: 'Roomd <hello@roomdapp.com>',
    to: email,
    subject: 'Your dorm room era starts now.',
    html: buildWelcomeEmail(),
  }).catch(() => {})
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { email } = await request.json()

  if (!email || !String(email).includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const normalizedEmail = String(email).toLowerCase().trim()

  const supabase = await createClient()
  const { error } = await supabase.from('email_signups').insert({ email: normalizedEmail })

  if (error) {
    if (error.code === '23505') {
      // Already signed up — still send the email in case they never got it
      sendWelcomeEmail(normalizedEmail)
      return NextResponse.json({ message: "You're already on the list!" })
    }
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }

  sendWelcomeEmail(normalizedEmail)
  return NextResponse.json({ message: "You're on the list!" })
}
