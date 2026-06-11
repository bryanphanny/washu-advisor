'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MeasuringStrategy, pointerWithin } from '@dnd-kit/core'
import NavBar from '@/components/NavBar'
import RequirementsSidebar from '@/components/RequirementsSidebar'
import SemesterGrid from '@/components/SemesterGrid'
import CourseCatalog from '@/components/CourseCatalog'
import Chat from '@/components/Chat'
import { api } from '@/lib/api'
import { useAuth } from '@/components/AuthProvider'
import type { AuditCategory, UserCourse, Course, Semester } from '@/lib/types'

export default function Page() {
  const { session } = useAuth()
  const router = useRouter()
  const [audit, setAudit] = useState<AuditCategory[]>([])
  const [userCourses, setUserCourses] = useState<UserCourse[]>([])
  const [catalog, setCatalog] = useState<Course[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [activeCourse, setActiveCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const computeGPA = useCallback((courses: UserCourse[], includePlanned: boolean) => {
    const gradable = courses.filter(c =>
      (includePlanned ? true : !c.is_planned) && c.grade_points != null
    )
    if (gradable.length === 0) return null
    const totalPoints = gradable.reduce((s, c) => s + (c.grade_points! * c.credits), 0)
    const totalCredits = gradable.reduce((s, c) => s + c.credits, 0)
    return totalCredits > 0 ? totalPoints / totalCredits : null
  }, [])

  const computeTotalCredits = useCallback((courses: UserCourse[]) => {
    return courses.filter(c => c.grade !== 'W').reduce((s, c) => s + c.credits, 0)
  }, [])

  const loadAll = useCallback(async () => {
    try {
      const [auditData, coursesData, userCoursesData, semestersData] = await Promise.all([
        api.requirements.audit(),
        api.courses.list(),
        api.planner.all(),
        api.planner.semesters(),
      ])
      setAudit(auditData)
      setCatalog(coursesData)
      setUserCourses(userCoursesData)
      setSemesters(semestersData)
    } catch {
      setError('Could not connect to backend. Make sure the FastAPI server is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session) { router.push('/login'); return }
    loadAll()
  }, [session, router, loadAll])

  const refreshAudit = async () => {
    const auditData = await api.requirements.audit()
    setAudit(auditData)
  }

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'catalog') {
      setActiveCourse(event.active.data.current.course)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCourse(null)
    if (!over) return

    const semesterId = Number(String(over.id).replace('semester-', ''))
    const semester = semesters.find(s => s.id === semesterId)
    if (!semester || semester.is_completed) return

    if (active.data.current?.type === 'catalog') {
      const course = active.data.current.course as Course
      const alreadyInSem = userCourses.some(
        uc => uc.course_code === course.code && uc.semester_id === semesterId
      )
      if (alreadyInSem) return

      const added = await api.planner.add({
        semester_id: semesterId,
        course_code: course.code,
        course_name: course.name,
        credits: course.credits,
      })
      setUserCourses(prev => [...prev, added])
      await refreshAudit()
    } else if (active.data.current?.type === 'planned') {
      const uc = active.data.current.userCourse as UserCourse
      if (uc.semester_id === semesterId) return
      const updated = await api.planner.move(uc.id, semesterId)
      setUserCourses(prev => prev.map(c => c.id === updated.id ? updated : c))
    }
  }

  const handleRemovePlanned = async (id: number) => {
    await api.planner.remove(id)
    setUserCourses(prev => prev.filter(c => c.id !== id))
    await refreshAudit()
  }

  const handleSetGrade = async (id: number, grade: string | null, gradePoints: number | null) => {
    const updated = await api.planner.setGrade(id, grade, gradePoints)
    setUserCourses(prev => prev.map(c => c.id === updated.id ? updated : c))
  }

  const handleAddAP = async (course: { course_code: string; course_name: string; credits: number }) => {
    const added = await api.planner.addAP(course)
    setUserCourses(prev => [...prev, added])
    await refreshAudit()
  }

  const handleRemoveAP = async (id: number) => {
    await api.planner.removeAP(id)
    setUserCourses(prev => prev.filter(c => c.id !== id))
    await refreshAudit()
  }

  if (!session) return null

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <NavBar onTranscriptImported={loadAll} />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Loading your degree plan...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <NavBar onTranscriptImported={loadAll} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-red-500 font-semibold mb-2">Connection Error</div>
            <div className="text-gray-500 text-sm">{error}</div>
            <button
              onClick={loadAll}
              className="mt-4 px-4 py-2 text-white text-sm rounded-md"
              style={{ backgroundColor: '#A51417' }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const plannedCodes = new Set(
    userCourses.filter(c => c.is_planned).map(c => c.course_code)
  )

  return (
    <DndContext
      collisionDetection={pointerWithin}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full">
        <NavBar onTranscriptImported={loadAll} />
        <div className="flex flex-1 overflow-hidden">
          <RequirementsSidebar audit={audit} currentGPA={computeGPA(userCourses, false) ?? 0} />
          <SemesterGrid
            semesters={semesters}
            userCourses={userCourses}
            onRemovePlanned={handleRemovePlanned}
            onSetGrade={handleSetGrade}
            onAddAP={handleAddAP}
            onRemoveAP={handleRemoveAP}
            currentGPA={computeGPA(userCourses, false) ?? 0}
            projectedGPA={computeGPA(userCourses, true)}
            totalCredits={computeTotalCredits(userCourses)}
          />
          <CourseCatalog catalog={catalog} plannedCodes={plannedCodes} />
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeCourse && (
          <div
            className="bg-white border-2 rounded-lg px-3 py-2 shadow-2xl text-xs font-semibold text-gray-800 pointer-events-none"
            style={{ borderColor: '#A51417', minWidth: 160 }}
          >
            <div>{activeCourse.code}</div>
            <div className="text-gray-500 font-normal">{activeCourse.name}</div>
          </div>
        )}
      </DragOverlay>

      <Chat />
    </DndContext>
  )
}
