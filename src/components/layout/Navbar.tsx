'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Home, LayoutTemplate } from 'lucide-react'

interface NavbarProps {
  roomName?: string
  roomId?: string
}

export default function Navbar({ roomName, roomId }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="font-bold text-indigo-600 text-lg hidden sm:block">Dormy</span>
          </Link>
          {roomName && (
            <>
              <span className="text-gray-300">/</span>
              <span className="font-semibold text-gray-800 text-sm truncate max-w-[140px]">{roomName}</span>
            </>
          )}
        </div>

        <nav className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Home size={16} />
            <span className="hidden sm:block">Rooms</span>
          </Link>
          <Link
            href="/templates"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LayoutTemplate size={16} />
            <span className="hidden sm:block">Templates</span>
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:block">Sign out</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
