'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { LogOut, Home, LayoutTemplate, BookOpen, Sparkles, ClipboardList, Moon, Sun, Check, X, KeyRound } from 'lucide-react'

interface NavbarProps {
  roomName?: string
  roomId?: string
}

export default function Navbar({ roomName, roomId }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()
  const [dark, setDark] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [savingName, setSavingName] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('roomd-dark') === 'true'
    setDark(saved)
    document.documentElement.classList.toggle('dark', saved)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data?.user
      if (!user) return
      const name = user.user_metadata?.display_name ?? user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'You'
      setUserName(name)
      setUserEmail(user.email ?? '')
      setNameDraft(name)
    })
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProfile(false)
        setEditingName(false)
      }
    }
    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProfile])

  function toggleDark() {
    const next = !dark
    setDark(next)
    localStorage.setItem('roomd-dark', String(next))
    document.documentElement.classList.toggle('dark', next)
  }

  async function saveName() {
    if (!nameDraft.trim() || nameDraft === userName) {
      setEditingName(false)
      return
    }
    setSavingName(true)
    await supabase.auth.updateUser({ data: { display_name: nameDraft.trim() } })
    setUserName(nameDraft.trim())
    setSavingName(false)
    setEditingName(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = userName ? userName.charAt(0).toUpperCase() : '?'

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center">
            <Image src="/logo.png" alt="Roomd" height={36} width={36} className="rounded-lg" priority />
            <span className="font-bold text-emerald-600 text-lg hidden sm:block ml-2">Roomd</span>
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
          <Link
            href="/inspo"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Sparkles size={16} />
            <span className="hidden sm:block">Inspo</span>
          </Link>
          <Link
            href="/questionnaire"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ClipboardList size={16} />
            <span className="hidden sm:block">Quiz</span>
          </Link>
          <Link
            href="/guides"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <BookOpen size={16} />
            <span className="hidden sm:block">Guides</span>
          </Link>

          {/* Profile avatar button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => { setShowProfile((v) => !v); setEditingName(false) }}
              className="w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center hover:bg-emerald-700 transition-colors ml-1 flex-shrink-0"
              title="Profile & settings"
            >
              {initials}
            </button>

            {showProfile && (
              <div className="absolute right-0 top-11 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                {/* Header */}
                <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white text-base font-bold flex items-center justify-center flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      {editingName ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            autoFocus
                            value={nameDraft}
                            onChange={(e) => setNameDraft(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false) }}
                            className="text-sm font-semibold text-gray-900 border border-emerald-300 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-emerald-300"
                          />
                          <button
                            onClick={saveName}
                            disabled={savingName}
                            className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex-shrink-0"
                            title="Save"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => { setEditingName(false); setNameDraft(userName) }}
                            className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingName(true)}
                          className="text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors text-left truncate max-w-full block"
                          title="Click to edit name"
                        >
                          {userName}
                        </button>
                      )}
                      <p className="text-xs text-gray-400 truncate mt-0.5">{userEmail}</p>
                    </div>
                  </div>
                  {!editingName && (
                    <button
                      onClick={() => setEditingName(true)}
                      className="mt-2.5 w-full text-xs text-emerald-600 hover:text-emerald-700 font-medium text-left"
                    >
                      ✏️ Edit display name
                    </button>
                  )}
                </div>

                {/* Settings */}
                <div className="py-1.5">
                  {/* Dark mode toggle */}
                  <button
                    onClick={toggleDark}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {dark ? <Sun size={15} className="text-amber-500" /> : <Moon size={15} className="text-emerald-500" />}
                      <span>{dark ? 'Light mode' : 'Dark mode'}</span>
                    </div>
                    <div className={`w-9 h-5 rounded-full transition-colors relative ${dark ? 'bg-emerald-600' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${dark ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                  </button>

                  {/* Change password */}
                  <Link
                    href="/reset-password"
                    onClick={() => setShowProfile(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <KeyRound size={15} className="text-gray-400" />
                    <span>Change password</span>
                  </Link>
                </div>

                {/* Sign out */}
                <div className="border-t border-gray-100 py-1.5">
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
