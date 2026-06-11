'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import type { Course } from '@/lib/types'

interface DraggableCourseProps {
  course: Course
  isPlanned: boolean
}

function DraggableCourse({ course, isPlanned }: DraggableCourseProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `catalog-${course.code}`,
    data: { type: 'catalog', course },
  })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-xl px-4 py-3 cursor-grab active:cursor-grabbing transition-colors select-none ${
        isDragging
          ? 'opacity-40'
          : isPlanned
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-gray-200 hover:border-[#A51417] hover:bg-red-50'
      }`}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-base font-semibold text-gray-800">{course.code}</div>
          <div className="text-sm text-gray-500 leading-snug mt-0.5">{course.name}</div>
        </div>
        <div className="flex flex-col items-end flex-shrink-0 gap-1">
          <span className="text-sm font-medium text-gray-400">{course.credits} cr</span>
          {isPlanned && <span className="text-xs text-green-600 font-semibold">added</span>}
        </div>
      </div>
    </div>
  )
}

// Quick-access buttons tailored to CS + Finance Minor
const QUICK_DEPTS = ['CSE', 'FIN', 'ACCT']

interface Props {
  catalog: Course[]
  plannedCodes: Set<string>
}

export default function CourseCatalog({ catalog, plannedCodes }: Props) {
  const [search, setSearch] = useState('')
  const [dept, setDept]     = useState('All')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const otherDepts = useMemo(() => {
    const all = new Set(catalog.map(c => c.department).filter(Boolean))
    QUICK_DEPTS.forEach(d => all.delete(d))
    return Array.from(all).sort()
  }, [catalog])

  const isQuick = dept === 'All' || QUICK_DEPTS.includes(dept)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = catalog.filter(c => {
    const matchDept   = dept === 'All' || c.department === dept
    const q           = search.toLowerCase()
    const matchSearch = !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    return matchDept && matchSearch
  })

  return (
    <aside className="flex-shrink-0 flex flex-col border-l border-gray-200 bg-gray-50 overflow-hidden" style={{ width: '400px' }}>
      <div className="px-5 py-4 border-b border-gray-200 bg-white">
        <div className="text-lg font-bold text-gray-900 mb-3">Course Catalog</div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-base border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#A51417] transition-colors"
        />

        {/* Quick-access buttons */}
        <div className="flex gap-2 mt-3">
          {(['All', ...QUICK_DEPTS] as string[]).map(d => (
            <button
              key={d}
              onClick={() => { setDept(d); setDropdownOpen(false) }}
              className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors ${
                dept === d ? 'text-white' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
              style={dept === d ? { backgroundColor: '#A51417' } : {}}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Custom scrollable department dropdown */}
        <div className="relative mt-2" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="w-full text-sm border rounded-xl px-4 py-2.5 bg-white text-left flex items-center justify-between transition-colors"
            style={!isQuick
              ? { borderColor: '#A51417', color: '#A51417', fontWeight: 600 }
              : { borderColor: '#e5e7eb', color: '#374151' }
            }
          >
            <span>{isQuick ? 'Browse by department...' : dept}</span>
            <svg
              className={`w-4 h-4 flex-shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                <button
                  onClick={() => { setDept('All'); setDropdownOpen(false) }}
                  className="w-full text-left text-sm px-4 py-2.5 hover:bg-gray-50 text-gray-500 transition-colors"
                >
                  All departments
                </button>
                {otherDepts.map(d => (
                  <button
                    key={d}
                    onClick={() => { setDept(d); setDropdownOpen(false) }}
                    className={`w-full text-left text-sm px-4 py-2.5 hover:bg-red-50 transition-colors ${
                      dept === d ? 'font-semibold' : 'text-gray-700'
                    }`}
                    style={dept === d ? { color: '#A51417' } : {}}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
        {filtered.length === 0 && (
          <div className="text-base text-gray-400 text-center py-10">No courses found</div>
        )}
        {filtered.map(c => (
          <DraggableCourse key={c.code} course={c} isPlanned={plannedCodes.has(c.code)} />
        ))}
      </div>

      <div className="px-5 py-3 border-t border-gray-200 bg-white text-sm text-gray-400 text-center">
        {filtered.length} courses · drag to add to a semester
      </div>
    </aside>
  )
}
