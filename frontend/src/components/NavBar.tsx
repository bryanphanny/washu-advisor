'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import TranscriptUpload from '@/components/TranscriptUpload'

interface NavBarProps {
  onTranscriptImported: () => void
}

export default function NavBar({ onTranscriptImported }: NavBarProps) {
  const { user, isAdmin, signOut } = useAuth()

  return (
    <nav className="h-16 flex-shrink-0 flex items-center justify-between px-8 shadow-lg" style={{ backgroundColor: '#A51417' }}>
      <div className="flex items-center gap-4">
        <svg width="42" height="42" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2L4 7V16C4 22.6 9.4 28.6 16 30C22.6 28.6 28 22.6 28 16V7L16 2Z" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.5"/>
          <text x="16" y="21" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="serif">WU</text>
        </svg>
        <div>
          <div className="text-white font-bold text-xl tracking-wide leading-tight">
            Academic Advisor
          </div>
          <div className="text-red-200 text-sm leading-tight">
            Washington University in St. Louis
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {isAdmin && (
          <Link href="/admin" className="text-white/80 hover:text-white text-base font-medium transition-colors">
            Admin
          </Link>
        )}
        <TranscriptUpload onImported={onTranscriptImported} />
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-red-200 text-sm hidden sm:block truncate max-w-[200px]">{user.email}</span>
            <button onClick={signOut} className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
