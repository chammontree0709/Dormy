'use client'

import { useState } from 'react'
import { Copy, Check, X, Users } from 'lucide-react'
import Button from '@/components/ui/Button'
import { RoomMember } from '@/types'

interface InviteModalProps {
  inviteCode: string
  roomName: string
  members: RoomMember[]
  onClose: () => void
}

export default function InviteModal({ inviteCode, roomName, members, onClose }: InviteModalProps) {
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/join/${inviteCode}`
    : ''

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">Invite Roommates</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <p className="text-sm text-gray-600">
            Share this code with your roommates to give them access to <strong>{roomName}</strong>.
          </p>

          <div className="text-center">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Room Code</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-black tracking-widest text-indigo-600 font-mono">
                {inviteCode}
              </span>
              <button
                onClick={copyCode}
                className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 text-center break-all">{joinUrl}</p>
          </div>

          {members.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {members.length} member{members.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="space-y-2">
                {members.map((m) => (
                  <div key={m.user_id} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                      {m.display_name[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700">{m.display_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button className="w-full" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  )
}
