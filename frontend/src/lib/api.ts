import type { AuditCategory, Course, Semester, UserCourse } from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}

const json = (body: unknown) => ({
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export const api = {
  chat: {
    send: (message: string, history: object[]) =>
      request<{ reply: string; history: object[] }>('/api/chat', {
        method: 'POST',
        ...json({ message, history }),
      }),
  },
  courses: {
    list: (department?: string) =>
      request<Course[]>(`/api/courses${department ? `?department=${department}` : ''}`),
    add: (course: Omit<Course, 'id'>) =>
      request<Course>('/api/courses', { method: 'POST', ...json(course) }),
    delete: (code: string) =>
      request<void>(`/api/courses/${code}`, { method: 'DELETE' }),
  },
  requirements: {
    audit: () => request<AuditCategory[]>('/api/requirements/audit'),
  },
  planner: {
    semesters: () => request<Semester[]>('/api/planner/semesters'),
    all: () => request<UserCourse[]>('/api/planner/all'),
    add: (course: { semester_id: number; course_code: string; course_name: string; credits: number }) =>
      request<UserCourse>('/api/planner', { method: 'POST', ...json(course) }),
    remove: (id: number) =>
      request<void>(`/api/planner/${id}`, { method: 'DELETE' }),
    move: (id: number, semester_id: number) =>
      request<UserCourse>(`/api/planner/${id}/move?semester_id=${semester_id}`, { method: 'PATCH' }),
    setGrade: (id: number, grade: string | null, gradePoints: number | null) =>
      request<UserCourse>(`/api/planner/${id}/grade`, { method: 'PATCH', ...json({ grade, grade_points: gradePoints }) }),
  },
}
