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

  const gradeColor = !course.grade       ? 'text-gray-300'
    : (course.grade_points ?? 0) >= 3.7  ? 'text-green-600'
    : (course.grade_points ?? 0) >= 2.0  ? 'text-yellow-600'
    : 'text-red-500'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
      {...listeners}
      {...attributes}
    >
      <div className="min-w-0 flex-1">
        <div className="text-base font-semibold text-gray-800 truncate">{course.course_code}</div>
        <div className="text-sm text-gray-500 truncate mt-0.5">{course.course_name}</div>
        <div className="text-sm text-gray-400 mt-0.5">{course.credits} cr</div>
      </div>
      <div className="flex flex-col items-end gap-1.5 ml-3 flex-shrink-0">
        {editingGrade ? (
          <select
            autoFocus
            className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#A51417] w-20"
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
            className={`font-bold text-base ${gradeColor} hover:opacity-70 transition-opacity min-w-[28px] text-right`}
            onClick={e => { e.stopPropagation(); setEditingGrade(true) }}
            onPointerDown={e => e.stopPropagation()}
            title="Set expected grade"
          >
            {course.grade ?? '+'}
          </button>
        )}
        <button
          onClick={e => { e.stopPropagation(); onRemove(course.id) }}
          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-base"
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
    <div className="flex items-start justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
      <div className="min-w-0">
        <div className="text-base font-semibold text-gray-700 truncate">{course.course_code}</div>
        <div className="text-sm text-gray-400 truncate mt-0.5">{course.course_name}</div>
        <div className="text-sm text-gray-300 mt-0.5">{course.credits} cr</div>
      </div>
      {course.grade && (
        <span className={`ml-3 font-bold flex-shrink-0 text-base ${gradeColor}`}>{course.grade}</span>
      )}
    </div>
  )
}

// Maps common AP exams to their WashU course equivalents (codes match requirements system)
const AP_EXAM_MAP = [
  { exam: 'AP Calculus AB',          code: 'MATH 131',   name: 'Calculus I',                             credits: 3 },
  { exam: 'AP Calculus BC',          code: 'MATH 132',   name: 'Calculus II',                            credits: 3 },
  { exam: 'AP Computer Science A',   code: 'CSE 1301',   name: 'Introduction to Computer Science',       credits: 3 },
  { exam: 'AP Statistics',           code: 'SDS 2200',   name: 'Elementary Probability and Statistics',  credits: 3 },
  { exam: 'AP Biology',              code: 'BIOL 100A',  name: 'An Introduction to Biology',             credits: 6 },
  { exam: 'AP Chemistry',            code: 'CHEM 105',   name: 'Principles of General Chemistry I',      credits: 3 },
  { exam: 'AP Microeconomics',       code: 'ECON 1011',  name: 'Introduction to Microeconomics',         credits: 3 },
  { exam: 'AP Macroeconomics',       code: 'ECON 1021',  name: 'Introduction to Macroeconomics',         credits: 3 },
  { exam: 'AP Psychology',           code: 'PSYCH 100B', name: 'Introduction to Psychology',             credits: 3 },
  { exam: 'AP English Language',     code: 'CWP 118',    name: 'College Writing',                        credits: 3 },
  { exam: 'AP US History',           code: 'HISTORY 163',name: 'History Elective',                       credits: 3 },
  { exam: 'AP Physics C: Mechanics', code: 'PHYS 191',   name: 'Physics I: Classical Mechanics',         credits: 3 },
  { exam: 'AP Physics C: E&M',       code: 'PHYS 192',   name: 'Physics II: Electromagnetism',           credits: 3 },
] as const

interface APCreditColumnProps {
  apCourses: UserCourse[]
  onAddAP: (course: { course_code: string; course_name: string; credits: number }) => Promise<void>
  onRemoveAP: (id: number) => void
}

function APCreditColumn({ apCourses, onAddAP, onRemoveAP }: APCreditColumnProps) {
  const [showForm, setShowForm] = useState(false)
  const [selectedExam, setSelectedExam] = useState('')
  const [code, setCode]         = useState('')
  const [name, setName]         = useState('')
  const [credits, setCredits]   = useState('')
  const [saving, setSaving]     = useState(false)

  const totalCredits = apCourses.reduce((s, c) => s + c.credits, 0)

  const handleExamSelect = (exam: string) => {
    setSelectedExam(exam)
    if (exam === 'other') {
      setCode(''); setName(''); setCredits('')
      return
    }
    const match = AP_EXAM_MAP.find(e => e.exam === exam)
    if (match) {
      setCode(match.code)
      setName(match.name)
      setCredits(String(match.credits))
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setSelectedExam(''); setCode(''); setName(''); setCredits('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !credits) return
    setSaving(true)
    try {
      await onAddAP({
        course_code: code.trim().toUpperCase(),
        course_name: name.trim() || code.trim().toUpperCase(),
        credits: parseFloat(credits),
      })
      resetForm()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex-shrink-0 flex flex-col" style={{ width: '220px' }}>
      <div className="mb-3">
        <div className="text-base font-bold text-gray-800">AP / Transfer</div>
        <div className="flex items-center gap-2.5 mt-1.5">
          <span className="text-sm bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-semibold">Credits</span>
          {totalCredits > 0 && (
            <span className="text-sm text-gray-400 font-medium">{totalCredits} cr</span>
          )}
        </div>
      </div>

      <div className="flex-1 rounded-2xl p-3 space-y-2.5 border-2 border-purple-100 bg-purple-50 min-h-40">
        {apCourses.length === 0 && !showForm && (
          <div className="flex items-center justify-center h-full text-gray-300 text-sm text-center py-8">
            No AP credits
          </div>
        )}

        {apCourses.map(c => (
          <div key={c.id} className="group flex items-start justify-between bg-white border border-purple-100 rounded-xl px-3 py-2.5">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-gray-700 truncate">{c.course_code}</div>
              <div className="text-xs text-gray-400 truncate mt-0.5">{c.course_name}</div>
              <div className="text-xs text-purple-400 mt-0.5">{c.credits} cr · AP</div>
            </div>
            <button
              onClick={() => onRemoveAP(c.id)}
              className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-sm ml-2 flex-shrink-0 mt-0.5"
            >
              ✕
            </button>
          </div>
        ))}

        {showForm ? (
          <form onSubmit={handleSubmit} className="bg-white border border-purple-200 rounded-xl p-3 space-y-2">
            <select
              autoFocus
              value={selectedExam}
              onChange={e => handleExamSelect(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-purple-400 bg-white text-gray-700"
            >
              <option value="">Select AP exam...</option>
              {AP_EXAM_MAP.map(e => (
                <option key={e.exam} value={e.exam}>{e.exam}</option>
              ))}
              <option value="other">Other / Transfer Credit</option>
            </select>

            <input
              placeholder="WashU course code"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-purple-400"
            />
            <input
              placeholder="Course name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-purple-400"
            />
            <input
              placeholder="Credits"
              type="number"
              min="0"
              step="0.5"
              value={credits}
              onChange={e => setCredits(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-purple-400"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving || !code.trim() || !credits}
                className="flex-1 text-xs font-semibold text-white rounded-lg py-1.5 transition-colors disabled:opacity-40"
                style={{ backgroundColor: '#7c3aed' }}
              >
                {saving ? '...' : 'Add'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg py-1.5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full text-sm font-semibold text-purple-600 border-2 border-purple-200 border-dashed rounded-xl py-2 hover:bg-purple-100 transition-colors"
          >
            + Add AP credit
          </button>
        )}
      </div>
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
  const label        = `${semester.term} ${semester.year}`
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0)

  return (
    <div className="flex flex-col">
      <div className="mb-3">
        <div className="text-base font-bold text-gray-800">{label}</div>
        <div className="flex items-center gap-2.5 mt-1.5">
          {semester.is_completed
            ? <span className="text-sm bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-semibold">Completed</span>
            : <span className="text-sm bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">Planned</span>
          }
          {totalCredits > 0 && (
            <span className="text-sm text-gray-400 font-medium">{totalCredits} cr</span>
          )}
        </div>
      </div>

      <div
        ref={!semester.is_completed ? setNodeRef : undefined}
        className={`flex-1 min-h-40 rounded-2xl p-3 space-y-2.5 border-2 transition-all ${
          semester.is_completed
            ? 'bg-gray-50 border-transparent'
            : isOver
            ? 'bg-red-50 border-[#A51417] border-dashed'
            : 'bg-white border-gray-200 border-dashed'
        }`}
      >
        {courses.length === 0 && !semester.is_completed && (
          <div className="flex items-center justify-center h-full text-gray-300 text-base text-center py-8">
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
  onAddAP: (course: { course_code: string; course_name: string; credits: number }) => Promise<void>
  onRemoveAP: (id: number) => void
  currentGPA: number
  projectedGPA: number | null
  totalCredits: number
}

export default function SemesterGrid({ semesters, userCourses, onRemovePlanned, onSetGrade, onAddAP, onRemoveAP, currentGPA, projectedGPA, totalCredits }: Props) {
  const apCourses         = userCourses.filter(c => c.is_transfer)
  const coursesBySemester = (semId: number) =>
    userCourses.filter(c => c.semester_id === semId && !c.is_transfer)

  return (
    <main className="flex-1 overflow-hidden flex flex-col bg-white min-w-0">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Semester Planner</h1>
          <p className="text-sm text-gray-400 mt-0.5">Drag courses from the catalog · click grade to set expected</p>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-sm text-gray-400 font-medium">Current GPA</div>
            <div className="font-bold text-xl text-gray-900">{currentGPA.toFixed(2)}</div>
          </div>
          {projectedGPA !== null && projectedGPA !== currentGPA && (
            <div className="text-center">
              <div className="text-sm text-gray-400 font-medium">Projected</div>
              <div className="font-bold text-xl" style={{ color: projectedGPA >= currentGPA ? '#16a34a' : '#dc2626' }}>
                {projectedGPA.toFixed(2)}
              </div>
            </div>
          )}
          <div className="text-center">
            <div className="text-sm text-gray-400 font-medium">Credits</div>
            <div className="font-bold text-xl text-gray-900">{totalCredits}/120</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="flex gap-5">
          {/* AP / Transfer Credits column */}
          <APCreditColumn
            apCourses={apCourses}
            onAddAP={onAddAP}
            onRemoveAP={onRemoveAP}
          />

          {/* Vertical divider */}
          <div className="flex-shrink-0 w-px bg-gray-200 self-stretch" />

          {/* Semester grid */}
          <div className="flex-1 grid grid-cols-2 gap-5 min-w-0">
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
      </div>
    </main>
  )
}
