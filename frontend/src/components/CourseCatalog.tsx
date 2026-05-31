'use client'

import { useState } from 'react'
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
      className={`border rounded-md px-2.5 py-2 text-xs cursor-grab active:cursor-grabbing transition-colors select-none ${
        isDragging
          ? 'opacity-40'
          : isPlanned
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-gray-200 hover:border-[#A51417] hover:bg-red-50'
      }`}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <div className="font-semibold text-gray-800">{course.code}</div>
          <div className="text-gray-500 text-[11px] leading-snug truncate">{course.name}</div>
        </div>
        <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
          <span className="text-gray-400 text-[10px]">{course.credits} cr</span>
          {isPlanned && (
            <span className="text-[10px] text-green-600 font-medium">added</span>
          )}
        </div>
      </div>
    </div>
  )
}

const DEPARTMENTS = ['All', 'CSE', 'FIN', 'ACCT']

interface Props {
  catalog: Course[]
  plannedCodes: Set<string>
}

export default function CourseCatalog({ catalog, plannedCodes }: Props) {
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All')

  const filtered = catalog.filter(c => {
    const matchDept = dept === 'All' || c.department === dept
    const q = search.toLowerCase()
    const matchSearch = !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    return matchDept && matchSearch
  })

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col border-l border-gray-200 bg-gray-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="text-sm font-bold text-gray-800 mb-2">Course Catalog</div>
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-xs border border-gray-200 rounded-md px-2.5 py-1.5 outline-none focus:border-[#A51417] transition-colors"
        />
        <div className="flex gap-1 mt-2">
          {DEPARTMENTS.map(d => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={`flex-1 text-[10px] font-semibold py-1 rounded transition-colors ${
                dept === d
                  ? 'text-white'
                  : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
              }`}
              style={dept === d ? { backgroundColor: '#A51417' } : {}}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
        {filtered.length === 0 && (
          <div className="text-xs text-gray-400 text-center py-8">No courses found</div>
        )}
        {filtered.map(c => (
          <DraggableCourse key={c.code} course={c} isPlanned={plannedCodes.has(c.code)} />
        ))}
      </div>

      <div className="px-4 py-2 border-t border-gray-200 bg-white text-[10px] text-gray-400 text-center">
        {filtered.length} courses · drag to add to a semester
      </div>
    </aside>
  )
}
