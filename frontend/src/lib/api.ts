import type { AuditCategory, Course, Semester, UserCourse, UserPermission } from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

let _authToken: string | null = null

export function setAuthToken(token: string | null) {
  _authToken = token
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> ?? {}),
  }
  if (_authToken) headers['Authorization'] = `Bearer ${_authToken}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
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
      request<{ reply: string; history: object[] }>('/api/chat/', {
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
    init: () => request<{ status: string; count: number }>('/api/planner/init', { method: 'POST' }),
    semesters: () => request<Semester[]>('/api/planner/semesters'),
    all: () => request<UserCourse[]>('/api/planner/all'),
    add: (course: { semester_id: number; course_code: string; course_name: string; credits: number }) =>
      request<UserCourse>('/api/planner/', { method: 'POST', ...json(course) }),
    remove: (id: number) =>
      request<void>(`/api/planner/${id}`, { method: 'DELETE' }),
    move: (id: number, semester_id: number) =>
      request<UserCourse>(`/api/planner/${id}/move?semester_id=${semester_id}`, { method: 'PATCH' }),
    setGrade: (id: number, grade: string | null, gradePoints: number | null) =>
      request<UserCourse>(`/api/planner/${id}/grade`, { method: 'PATCH', ...json({ grade, grade_points: gradePoints }) }),
    addAP: (course: { course_code: string; course_name: string; credits: number }) =>
      request<UserCourse>('/api/planner/ap-credit', { method: 'POST', ...json(course) }),
    removeAP: (id: number) =>
      request<void>(`/api/planner/ap-credit/${id}`, { method: 'DELETE' }),
    uploadTranscript: (file: File) => {
      const form = new FormData()
      form.append('file', file)
      return request<{ imported_courses: number; transfer_credits: number; semesters_updated: number }>(
        '/api/planner/upload-transcript',
        { method: 'POST', body: form },
      )
    },
  },
  admin: {
    me: () => request<{ role: string; can_use_ai: boolean; is_admin: boolean }>('/api/admin/me'),
    users: () => request<UserPermission[]>('/api/admin/users'),
    setAIAccess: (userId: string, canUseAI: boolean) =>
      request<UserPermission>(`/api/admin/users/${userId}/ai-access`, {
        method: 'PATCH',
        ...json({ can_use_ai: canUseAI }),
      }),
    claimData: () =>
      request<{ semesters_claimed: number; user_courses_claimed: number }>('/api/admin/claim-existing-data', { method: 'POST' }),
  },
}
