'use client'

interface NavBarProps {
  onOpenChat: () => void
}

export default function NavBar({ onOpenChat }: NavBarProps) {
  return (
    <nav className="h-14 flex-shrink-0 flex items-center justify-between px-6 shadow-md" style={{ backgroundColor: '#A51417' }}>
      <div className="flex items-center gap-3">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2L4 7V16C4 22.6 9.4 28.6 16 30C22.6 28.6 28 22.6 28 16V7L16 2Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5"/>
          <text x="16" y="20" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="serif">WU</text>
        </svg>
        <div>
          <div className="text-white font-bold text-base tracking-wide leading-tight">
            Academic Advisor
          </div>
          <div className="text-red-200 text-xs leading-tight">
            Washington University in St. Louis
          </div>
        </div>
      </div>
      <button
        onClick={onOpenChat}
        className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        AI Advisor
      </button>
    </nav>
  )
}
