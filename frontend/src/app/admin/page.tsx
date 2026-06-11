'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { api } from '@/lib/api'
import type { UserPermission } from '@/lib/types'

export default function AdminPage() {
  const { session } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserPermission[] | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    if (!session) { router.push('/login'); return }

    api.admin.users()
      .then(setUsers)
      .catch(() => router.push('/'))
  }, [session, router])

  if (!session || users === null) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    )
  }

  const toggleAI = async (userId: string, current: boolean) => {
    setToggling(userId)
    try {
      const updated = await api.admin.setAIAccess(userId, !current)
      setUsers(prev => prev!.map(u => u.user_id === userId ? { ...u, can_use_ai: updated.can_use_ai } : u))
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="h-14 flex-shrink-0 flex items-center px-6 shadow-md" style={{ backgroundColor: '#A51417' }}>
        <button onClick={() => router.push('/')} className="text-white/80 hover:text-white mr-4 transition-colors">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
          <path d="M16 2L4 7V16C4 22.6 9.4 28.6 16 30C22.6 28.6 28 22.6 28 16V7L16 2Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5"/>
          <text x="16" y="20" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="serif">WU</text>
        </svg>
        <span className="text-white font-semibold">Admin Panel</span>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Users <span className="text-gray-400 font-normal text-sm">({users.length})</span>
              </h2>
              <span className="text-xs text-gray-400">Toggle AI access per user</span>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-medium">Email</th>
                  <th className="text-left px-6 py-3 font-medium">Role</th>
                  <th className="text-left px-6 py-3 font-medium">AI Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.user_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAI(u.user_id, u.can_use_ai)}
                        disabled={toggling === u.user_id}
                        aria-label={u.can_use_ai ? 'Disable AI access' : 'Enable AI access'}
                        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50"
                        style={{ backgroundColor: u.can_use_ai ? '#22c55e' : '#d1d5db' }}
                      >
                        <span
                          className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
                          style={{ transform: u.can_use_ai ? 'translateX(18px)' : 'translateX(2px)' }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
