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

  return (
    <div className={`relative w-full${className ? ` ${className}` : ''}`}>
      {/* Placeholder visible until the ad loads */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg pointer-events-none z-0">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ad</span>
      </div>
      <ins
        className="adsbygoogle relative z-10"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client="ca-pub-7336988558032518"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
