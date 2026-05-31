'use client'

import { useDroppable } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'
import type { Semester, UserCourse } from '@/lib/types'

interface PlannedCourseCardProps {
  course: UserCourse
  onRemove: (id: number) => void
}

function PlannedCourseCard({ course, onRemove }: PlannedCourseCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `planned-${course.id}`,
    data: { type: 'planned', userCourse: course },
  })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start justify-between bg-white border border-gray-200 rounded-md px-2 py-1.5 text-xs shadow-sm cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
      {...listeners}
      {...attributes}
    >
      <div className="min-w-0">
        <div className="font-semibold text-gray-800 truncate">{course.course_code}</div>
        <div className="text-gray-500 truncate text-[11px]">{course.course_name}</div>
        <div className="text-gray-400 text-[10px]">{course.credits} cr</div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(course.id) }}
        className="ml-1 mt-0.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
        onPointerDown={e => e.stopPropagation()}
      >
        ✕
      </button>
    </div>
  )
}

function CompletedCourseCard({ course }: { course: UserCourse }) {
  const gradeColor = course.grade === 'A+' || course.grade === 'A'
    ? 'text-green-600'
    : course.grade === 'W'
    ? 'text-gray-400'
    : 'text-gray-600'

  return (
    <div className="flex items-start justify-between bg-white border border-gray-100 rounded-md px-2 py-1.5 text-xs">
      <div className="min-w-0">
        <div className="font-semibold text-gray-700 truncate">{course.course_code}</div>
        <div className="text-gray-400 truncate text-[11px]">{course.course_name}</div>
        <div className="text-gray-300 text-[10px]">{course.credits} cr</div>
      </div>
      {course.grade && (
        <span className={`ml-1 font-bold flex-shrink-0 text-[11px] ${gradeColor}`}>
          {course.grade}
        </span>
      )}
    </div>
  )
}

interface SemesterColumnProps {
  semester: Semester
  courses: UserCourse[]
  onRemove: (id: number) => void
}

function SemesterColumn({ semester, courses, onRemove }: SemesterColumnProps) {
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
          {totalCredits > 0 && (
            <span className="text-[10px] text-gray-400">{totalCredits} cr</span>
          )}
        </div>
      </div>

      <div
        ref={!semester.is_completed ? setNodeRef : undefined}
        className={`flex-1 min-h-48 rounded-lg p-2 space-y-1.5 border-2 transition-all ${
          semester.is_completed
            ? 'bg-gray-50 border-transparent'
            : isOver
            ? 'bg-red-50 border-[#A51417] border-dashed'
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
            : <PlannedCourseCard key={c.id} course={c} onRemove={onRemove} />
        )}
      </div>
    </div>
  )
}

interface Props {
  semesters: Semester[]
  userCourses: UserCourse[]
  onRemovePlanned: (id: number) => void
}

export default function SemesterGrid({ semesters, userCourses, onRemovePlanned }: Props) {
  const transferCourses = userCourses.filter(c => c.is_transfer)

  const coursesBySemester = (semId: number) =>
    userCourses.filter(c => c.semester_id === semId && !c.is_transfer)

  return (
    <main className="flex-1 overflow-hidden flex flex-col bg-white">
      <div className="px-6 py-3 border-b border-gray-100">
        <h1 className="text-sm font-bold text-gray-800">Semester Planner</h1>
        <p className="text-xs text-gray-400">Drag courses from the catalog into future semesters</p>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto px-6 py-4">
        <div className="flex gap-4 min-w-max">
          {/* Transfer credits column */}
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

          {/* Semester columns */}
          {semesters.map(s => (
            <SemesterColumn
              key={s.id}
              semester={s}
              courses={coursesBySemester(s.id)}
              onRemove={onRemovePlanned}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
