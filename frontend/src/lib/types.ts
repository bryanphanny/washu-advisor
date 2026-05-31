export interface Course {
  id: number
  code: string
  name: string
  credits: number
  department: string
  description?: string
}

export interface Semester {
  id: number
  term: string
  year: number
  is_completed: boolean
}

export interface UserCourse {
  id: number
  semester_id: number | null
  course_code: string
  course_name: string
  credits: number
  grade?: string
  grade_points?: number
  is_transfer: boolean
  is_planned: boolean
  semesters?: { term: string; year: number }
}

export interface Requirement {
  id: number
  category_id: number
  course_code: string
  course_name: string
  credits: number
  is_required: boolean
  elective_group?: string
}

export interface AuditCategory {
  category: string
  program: string
  credits_required: number
  notes?: string
  satisfied_required: Requirement[]
  unsatisfied_required: Requirement[]
  satisfied_electives: Requirement[]
  elective_credits_still_needed: number
  is_complete: boolean
}
