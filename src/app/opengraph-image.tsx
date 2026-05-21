import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Roomd — Shared Dorm Room Checklist'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '80px',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: '#09090b',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 900,
            }}
          >
            R
          </div>
          <span style={{ fontSize: '44px', fontWeight: 900, color: '#09090b', letterSpacing: '-2px' }}>
            Roomd
          </span>
        </div>

        {/* Eyebrow */}
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>
          Shared dorm checklist
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 900,
            color: '#09090b',
            lineHeight: 1.05,
            marginBottom: '28px',
            letterSpacing: '-3px',
            maxWidth: '820px',
          }}
        >
          Your dorm room,
          <br />
          packed together.
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: '24px',
            color: '#71717a',
            maxWidth: '600px',
            lineHeight: 1.5,
          }}
        >
          The shared checklist app for you and your roommates. Never buy the same thing twice.
        </div>

        {/* Pill badge */}
        <div
          style={{
            marginTop: '40px',
            background: '#f4f4f5',
            color: '#09090b',
            fontSize: '18px',
            fontWeight: 700,
            padding: '10px 24px',
            borderRadius: '100px',
          }}
        >
          Built for college move-in day
        </div>
      </div>
    ),
    { ...size }
  )
}
