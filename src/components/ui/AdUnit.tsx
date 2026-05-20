'use client'

import { useEffect, useRef } from 'react'

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

export default function AdUnit({ slot, format = 'auto', className }: AdUnitProps) {
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    pushed.current = true
    try {
      // @ts-expect-error adsbygoogle is injected by Google's script
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  // Don't render anything until a real slot ID is configured
  if (!slot || slot === 'XXXXXXXXXX') return null

  return (
    <div className={`w-full${className ? ` ${className}` : ''}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7336988558032518"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
