'use client'

import { useState } from 'react'
import { useDroppable, useDraggable } from '@dnd-kit/core'
import type { Semester, UserCourse } from '@/lib/types'

const GRADES: { label: string; points: number }[] = [
  { label: 'A+', points: 4.0 },
  { label: 'A',  points: 4.0 },
  { label: 'A-', points: 3.7 },
  { label: 'B+', points: 3.3 },
  { label: 'B',  points: 3.0 },
  { label: 'B-', points: 2.7 },
  { label: 'C+', points: 2.3 },
  { label: 'C',  points: 2.0 },
  { label: 'C-', points: 1.7 },
  { label: 'D+', points: 1.3 },
  { label: 'D',  points: 1.0 },
  { label: 'D-', points: 0.7 },
  { label: 'F',  points: 0.0 },
]

interface PlannedCourseCardProps {
  course: UserCourse
  onRemove: (id: number) => void
  onSetGrade: (id: number, grade: string | null, gradePoints: number | null) => void
}

function PlannedCourseCard({ course, onRemove, onSetGrade }: PlannedCourseCardProps) {
  const [editingGrade, setEditingGrade] = useState(false)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `planned-${course.id}`,
    data: { type: 'planned', userCourse: course },
  })

  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined

  const gradeColor = !course.grade ? 'text-gray-300'
    : (course.grade_points ?? 0) >= 3.7 ? 'text-green-600'
    : (course.grade_points ?? 0) >= 2.0 ? 'text-yellow-600'
    : 'text-red-500'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start justify-between bg-white border border-gray-200 rounded-md px-2 py-1.5 text-xs shadow-sm cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
      {...listeners}
      {...attributes}
    >
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-gray-800 truncate">{course.course_code}</div>
        <div className="text-gray-500 truncate text-[11px]">{course.course_name}</div>
        <div className="text-gray-400 text-[10px]">{course.credits} cr</div>
      </div>

      <div className="flex flex-col items-end gap-0.5 ml-1 flex-shrink-0">
        {editingGrade ? (
          <select
            autoFocus
            className="text-[11px] border border-gray-200 rounded px-1 py-0.5 bg-white focus:outline-none focus:border-[#A51417] w-14"
            value={course.grade ?? ''}
            onChange={e => {
              const g = GRADES.find(g => g.label === e.target.value)
              onSetGrade(course.id, g?.label ?? null, g?.points ?? null)
              setEditingGrade(false)
            }}
            onBlur={() => setEditingGrade(false)}
            onPointerDown={e => e.stopPropagation()}
          >
            <option value="">—</option>
            {GRADES.map(g => <option key={g.label} value={g.label}>{g.label}</option>)}
          </select>
        ) : (
          <button
            className={`font-bold text-[11px] ${gradeColor} hover:opacity-70 transition-opacity min-w-[20px] text-right`}
            onClick={e => { e.stopPropagation(); setEditingGrade(true) }}
            onPointerDown={e => e.stopPropagation()}
            title="Set expected grade"
          >
            {course.grade ?? '+'}
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(course.id) }}
          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          onPointerDown={e => e.stopPropagation()}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

function CompletedCourseCard({ course }: { course: UserCourse }) {
  const gradeColor = course.grade === 'A+' || course.grade === 'A' ? 'text-green-600'
    : course.grade === 'W' ? 'text-gray-400'
    : 'text-gray-600'

  return (
    <div className="flex items-start justify-between bg-white border border-gray-100 rounded-md px-2 py-1.5 text-xs">
      <div className="min-w-0">
        <div className="font-semibold text-gray-700 truncate">{course.course_code}</div>
        <div className="text-gray-400 truncate text-[11px]">{course.course_name}</div>
        <div className="text-gray-300 text-[10px]">{course.credits} cr</div>
      </div>
      {course.grade && (
        <span className={`ml-1 font-bold flex-shrink-0 text-[11px] ${gradeColor}`}>{course.grade}</span>
      )}
    </div>
  )
}

interface SemesterColumnProps {
  semester: Semester
  courses: UserCourse[]
  onRemove: (id: number) => void
  onSetGrade: (id: number, grade: string | null, gradePoints: number | null) => void
}

function SemesterColumn({ semester, courses, onRemove, onSetGrade }: SemesterColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `semester-${semester.id}` })
  const label = `${semester.term} ${semester.year}`
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0)

  return (
    <div className="flex-shrink-0 w-48 flex flex-col">
      <div className="mb-2">
        <div className="text-xs font-bold text-gray-700">{label}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {semester.is_completed
            ? <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Completed</span>
            : <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Planned</span>
          }
          {totalCredits > 0 && <span className="text-[10px] text-gray-400">{totalCredits} cr</span>}
        </div>
      </div>

      <div
        ref={!semester.is_completed ? setNodeRef : undefined}
        className={`flex-1 min-h-48 rounded-lg p-2 space-y-1.5 border-2 transition-all ${
          semester.is_completed ? 'bg-gray-50 border-transparent'
          : isOver ? 'bg-red-50 border-[#A51417] border-dashed'
          : 'bg-white border-gray-200 border-dashed'
        }`}
      >
        {courses.length === 0 && !semester.is_completed && (
          <div className="flex items-center justify-center h-full text-gray-300 text-xs text-center">
            Drop courses here
          </div>
        )}
        {courses.map(c =>
          semester.is_completed
            ? <CompletedCourseCard key={c.id} course={c} />
            : <PlannedCourseCard key={c.id} course={c} onRemove={onRemove} onSetGrade={onSetGrade} />
        )}
      </div>
    </div>
  )
}

interface Props {
  semesters: Semester[]
  userCourses: UserCourse[]
  onRemovePlanned: (id: number) => void
  onSetGrade: (id: number, grade: string | null, gradePoints: number | null) => void
  currentGPA: number
  projectedGPA: number | null
  totalCredits: number
}

export default function SemesterGrid({ semesters, userCourses, onRemovePlanned, onSetGrade, currentGPA, projectedGPA, totalCredits }: Props) {
  const transferCourses = userCourses.filter(c => c.is_transfer)
  const coursesBySemester = (semId: number) =>
    userCourses.filter(c => c.semester_id === semId && !c.is_transfer)

  return (
    <main className="flex-1 overflow-hidden flex flex-col bg-white">
      <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold text-gray-800">Semester Planner</h1>
          <p className="text-xs text-gray-400">Drag courses from the catalog · click grade to set expected</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <div className="text-gray-400">Current GPA</div>
            <div className="font-bold text-gray-800">{currentGPA.toFixed(2)}</div>
          </div>
          {projectedGPA !== null && projectedGPA !== currentGPA && (
            <div className="text-right">
              <div className="text-gray-400">Projected</div>
              <div className="font-bold" style={{ color: projectedGPA >= currentGPA ? '#16a34a' : '#dc2626' }}>
                {projectedGPA.toFixed(2)}
              </div>
            </div>
          )}
          <div className="text-right">
            <div className="text-gray-400">Credits</div>
            <div className="font-bold text-gray-800">{totalCredits}/120</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto px-6 py-4">
        <div className="flex gap-4 min-w-max">
          {transferCourses.length > 0 && (
            <div className="flex-shrink-0 w-48 flex flex-col">
              <div className="mb-2">
                <div className="text-xs font-bold text-gray-700">Transfer / AP</div>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                  {transferCourses.reduce((s, c) => s + c.credits, 0)} cr
                </span>
              </div>
              <div className="flex-1 min-h-48 rounded-lg p-2 space-y-1.5 bg-purple-50 border-2 border-purple-100">
                {transferCourses.map(c => (
                  <div key={c.id} className="bg-white border border-purple-100 rounded-md px-2 py-1.5 text-xs">
                    <div className="font-semibold text-gray-700 truncate">{c.course_code}</div>
                    <div className="text-gray-400 truncate text-[11px]">{c.course_name}</div>
                    <div className="text-purple-400 text-[10px]">{c.credits} cr · AP</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {semesters.map(s => (
            <SemesterColumn
              key={s.id}
              semester={s}
              courses={coursesBySemester(s.id)}
              onRemove={onRemovePlanned}
              onSetGrade={onSetGrade}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
