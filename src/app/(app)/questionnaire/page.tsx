'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/layout/Navbar'
import { ClipboardList, Home, Check, X } from 'lucide-react'

const QUESTIONS = [
  { id: 'sleep', label: 'Sleep schedule', options: ['Night owl', 'Early bird', 'Flexible'] },
  { id: 'wakeup', label: 'Wake-up time', options: ['Before 8am', '8–10am', 'After 10am'] },
  { id: 'clean', label: 'Cleanliness', options: ['Spotless', 'Tidy', 'Relaxed'] },
  { id: 'guests', label: 'Having guests over', options: ['Often', 'Sometimes', 'Rarely'] },
  { id: 'noise', label: 'Noise level', options: ['Loud', 'Moderate', 'Quiet'] },
  { id: 'temp', label: 'Room temperature', options: ['Cold', 'Moderate', 'Warm'] },
  { id: 'study', label: 'Study in room?', options: ['Always', 'Sometimes', 'Never — library'] },
  { id: 'lights', label: 'Lights out by', options: ['11pm', 'Midnight', 'After midnight'] },
  { id: 'food', label: 'Sharing food', options: ['Yes please!', 'Ask first', 'No thanks'] },
  { id: 'shower', label: 'Shower time', options: ['Morning', 'Evening', 'Whenever'] },
]

type Answers = Record<string, string>

interface RoomMember {
  display_name: string
  questionnaire_answers: Answers | null
}

interface Room {
  id: string
  name: string
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function QuestionnairePage() {
  const supabase = createClient()

  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [myAnswers, setMyAnswers] = useState<Answers>({})
  const [draft, setDraft] = useState<Answers>({})
  const [roommateAnswers, setRoommateAnswers] = useState<RoomMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState<SaveState>('idle')

  // Load user, rooms, existing answers
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)

      // Get rooms the user belongs to
      const { data: memberRows } = await supabase
        .from('room_members')
        .select('room_id')
        .eq('user_id', user.id)

      if (!memberRows?.length) { setLoading(false); return }

      const roomIds = memberRows.map((r: { room_id: string }) => r.room_id)
      const { data: roomData } = await supabase
        .from('rooms')
        .select('id, name')
        .in('id', roomIds)
        .order('created_at', { ascending: false })

      const roomList = roomData ?? []
      setRooms(roomList)

      // Pick first room or restore from localStorage
      const stored = localStorage.getItem('questionnaire_room_id')
      const defaultRoom = stored && roomIds.includes(stored) ? stored : roomIds[0]
      setSelectedRoomId(defaultRoom)

      setLoading(false)
    }
    load()
  }, [])

  // Load answers when room changes
  useEffect(() => {
    if (!selectedRoomId || !userId) return

    async function loadAnswers() {
      const { data: members } = await supabase
        .from('room_members')
        .select('display_name, questionnaire_answers')
        .eq('room_id', selectedRoomId!)

      if (!members) return

      // Find my own answers
      const { data: { user } } = await supabase.auth.getUser()
      const { data: myRow } = await supabase
        .from('room_members')
        .select('questionnaire_answers')
        .eq('room_id', selectedRoomId!)
        .eq('user_id', userId!)
        .single()

      const saved: Answers = myRow?.questionnaire_answers ?? {}
      setMyAnswers(saved)
      setDraft(saved)

      // Roommates (everyone with answers, for comparison display)
      setRoommateAnswers(members ?? [])
    }

    loadAnswers()
  }, [selectedRoomId, userId])

  async function handleSave() {
    if (!selectedRoomId || !userId) return

    const unanswered = QUESTIONS.filter((q) => !draft[q.id])
    if (unanswered.length > 0) {
      alert(`Please answer all questions before saving. Missing: ${unanswered.map((q) => q.label).join(', ')}`)
      return
    }

    setSaveState('saving')
    localStorage.setItem('questionnaire_room_id', selectedRoomId)

    const { error } = await supabase
      .from('room_members')
      .update({ questionnaire_answers: draft })
      .eq('room_id', selectedRoomId)
      .eq('user_id', userId)

    if (error) {
      setSaveState('error')
      return
    }

    setMyAnswers(draft)
    setSaveState('saved')

    // Refresh roommate answers
    const { data: members } = await supabase
      .from('room_members')
      .select('display_name, questionnaire_answers')
      .eq('room_id', selectedRoomId)

    setRoommateAnswers(members ?? [])

    setTimeout(() => setSaveState('idle'), 3000)
  }

  function getCompatibilityColor(questionId: string) {
    const answered = roommateAnswers.filter((m) => m.questionnaire_answers?.[questionId])
    if (answered.length < 2) return null

    const values = answered.map((m) => m.questionnaire_answers![questionId])
    const unique = new Set(values)

    if (unique.size === 1) return 'green'
    if (unique.size === values.length) return 'red'
    return 'amber'
  }

  const hasSubmitted = Object.keys(myAnswers).length > 0
  const membersWithAnswers = roommateAnswers.filter((m) => m.questionnaire_answers && Object.keys(m.questionnaire_answers).length > 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-20 text-zinc-400 text-sm animate-pulse">
          Loading...
        </div>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
            <Home size={24} className="text-zinc-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">No rooms yet</h2>
          <p className="text-zinc-500 text-sm">Join or create a room first to fill out the questionnaire.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8 mb-8">
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">Living preferences</p>
          <h1
            className="text-3xl font-bold italic text-zinc-950 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Questionnaire
          </h1>
          <p className="text-zinc-500 mt-1">Share your living preferences with your roommates.</p>
        </div>

        {/* Room picker (if multiple rooms) */}
        {rooms.length > 1 && (
          <div className="bg-white rounded-2xl border border-zinc-100 p-4 mb-6">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Room</label>
            <select
              value={selectedRoomId ?? ''}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Toast */}
        {saveState === 'saved' && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-medium mb-6 flex items-center gap-2">
            <Check size={14} strokeWidth={2.5} /> Answers saved!
          </div>
        )}
        {saveState === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium mb-6 flex items-center gap-2">
            <X size={14} strokeWidth={2.5} /> Failed to save. Please try again.
          </div>
        )}

        {/* Questionnaire form */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-zinc-800 mb-5">
            {hasSubmitted ? 'Update your answers' : 'Your preferences'}
          </h2>

          <div className="space-y-6">
            {QUESTIONS.map((q) => (
              <div key={q.id}>
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const color = getCompatibilityColor(q.id)
                    return color ? (
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          color === 'green' ? 'bg-emerald-400' :
                          color === 'amber' ? 'bg-amber-400' :
                          'bg-red-400'
                        }`}
                        title={color === 'green' ? 'Everyone agrees' : color === 'amber' ? 'Mixed opinions' : 'Split opinions'}
                      />
                    ) : null
                  })()}
                  <p className="text-sm font-medium text-zinc-700">{q.label}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setDraft((prev) => ({ ...prev, [q.id]: opt }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        draft[q.id] === opt
                          ? 'bg-zinc-950 text-white border-zinc-950'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className="mt-8 w-full bg-zinc-950 hover:bg-zinc-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors active:scale-[0.98]"
          >
            {saveState === 'saving' ? 'Saving...' : hasSubmitted ? 'Update answers' : 'Save my answers'}
          </button>
        </div>

        {/* Comparison section */}
        {membersWithAnswers.length > 0 && (
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <h2 className="font-semibold text-zinc-800 mb-1">Roommate comparison</h2>
            <p className="text-xs text-zinc-400 mb-5 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" /> Everyone agrees
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 ml-1" /> Mixed
              <span className="inline-block w-2 h-2 rounded-full bg-red-400 ml-1" /> Split
            </p>

            <div className="space-y-5">
              {QUESTIONS.map((q) => {
                const color = getCompatibilityColor(q.id)
                return (
                  <div key={q.id}>
                    <div className="flex items-center gap-2 mb-2">
                      {color && (
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                            color === 'green' ? 'bg-emerald-400' :
                            color === 'amber' ? 'bg-amber-400' :
                            'bg-red-400'
                          }`}
                        />
                      )}
                      <p className="text-sm font-medium text-zinc-600">{q.label}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 pl-4">
                      {membersWithAnswers.map((member) => {
                        const answer = member.questionnaire_answers?.[q.id]
                        if (!answer) return null
                        return (
                          <div key={member.display_name} className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400 w-24 truncate">{member.display_name}</span>
                            <span className="text-xs bg-zinc-50 border border-zinc-200 text-zinc-700 px-2.5 py-1 rounded-full">
                              {answer}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
