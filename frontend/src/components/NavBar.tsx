'use client'

export default function NavBar() {
  return (
    <nav className="h-14 flex-shrink-0 flex items-center px-6 shadow-md" style={{ backgroundColor: '#A51417' }}>
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
    </nav>
  )
}
