import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#a78bfa',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        {/* Yellow checkbox square */}
        <div
          style={{
            background: '#fbbf24',
            width: '18px',
            height: '18px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ color: '#92400e', fontSize: '12px', fontWeight: 900, lineHeight: 1 }}>✓</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
