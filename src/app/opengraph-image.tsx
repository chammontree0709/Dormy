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
          background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              background: '#4f46e5',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '40px',
              fontWeight: 900,
            }}
          >
            R
          </div>
          <span style={{ fontSize: '52px', fontWeight: 900, color: '#4f46e5', letterSpacing: '-2px' }}>
            Roomd
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 900,
            color: '#111827',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '20px',
            letterSpacing: '-2px',
          }}
        >
          Your dorm room,
          <br />
          <span style={{ color: '#4f46e5' }}>packed together.</span>
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: '26px',
            color: '#6b7280',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.4,
          }}
        >
          The shared checklist app for you and your roommates. Never buy the same thing twice.
        </div>

        {/* Pill badge */}
        <div
          style={{
            marginTop: '36px',
            background: '#eef2ff',
            color: '#4338ca',
            fontSize: '20px',
            fontWeight: 700,
            padding: '10px 24px',
            borderRadius: '100px',
          }}
        >
          🎓 Built for college move-in day
        </div>
      </div>
    ),
    { ...size }
  )
}
