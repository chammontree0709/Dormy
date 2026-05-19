import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean
}

export function Card({ className, padding = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn('bg-white rounded-2xl shadow-sm border border-gray-100', padding && 'p-5', className)}
      {...props}
    >
      {children}
    </div>
  )
}
