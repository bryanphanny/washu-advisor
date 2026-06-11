'use client'

import { useState } from 'react'
import type { AuditCategory } from '@/lib/types'

interface Props {
  audit: AuditCategory[]
  currentGPA: number
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: pct >= 100 ? '#16a34a' : '#A51417' }}
      />
    </div>
  )
}

function CategoryCard({ cat }: { cat: AuditCategory }) {
  const [open, setOpen] = useState(!cat.is_complete)

  const plannedRequired  = cat.planned_required  ?? []
  const plannedElectives = cat.planned_electives ?? []

  const creditsDone =
    cat.satisfied_required.reduce((s, r) => s + r.credits, 0) +
    cat.satisfied_electives.reduce((s, r) => s + r.credits, 0) +
    plannedRequired.reduce((s, r) => s + r.credits, 0) +
    plannedElectives.reduce((s, r) => s + r.credits, 0)

  const isTotalCredits  = cat.category === 'Total Credits to Graduate'
  const displayCredits  = isTotalCredits
    ? (cat.total_completed_credits ?? 0) + (cat.total_planned_credits ?? 0)
    : creditsDone
  const pct = cat.credits_required > 0 ? (displayCredits / cat.credits_required) * 100 : 0

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`w-3 h-3 rounded-full flex-shrink-0 ${cat.is_complete ? 'bg-green-500' : 'bg-red-400'}`} />
          <span className="text-base font-semibold text-gray-800 truncate">{cat.category}</span>
        </div>
        <span className="text-base text-gray-500 ml-3 flex-shrink-0 font-medium">
          {displayCredits}/{cat.credits_required} cr
        </span>
      </button>

      <div className="px-4 pt-2 pb-2.5">
        <ProgressBar pct={pct} />
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-1.5">
          {isTotalCredits ? (
            <div className="text-sm text-gray-400">
              {cat.total_completed_credits} completed · {cat.total_planned_credits} planned
            </div>
          ) : (
            <>
              {cat.satisfied_required.map(r => (
                <div key={r.id} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{r.course_code} — {r.course_name}</span>
                </div>
              ))}
              {plannedRequired.map(r => (
                <div key={r.id} className="flex items-start gap-2 text-sm text-blue-500">
                  <span className="mt-0.5">◷</span>
                  <span>{r.course_code} — {r.course_name} (planned)</span>
                </div>
              ))}
              {cat.unsatisfied_required.map(r => (
                <div key={r.id} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-red-400 mt-0.5">○</span>
                  <span>{r.course_code} — {r.course_name}</span>
                </div>
              ))}
              {(cat.satisfied_electives.length > 0 || plannedElectives.length > 0) && (
                <>
                  <div className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wide">Electives</div>
                  {cat.satisfied_electives.map(r => (
                    <div key={r.id} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{r.course_code} — {r.course_name}</span>
                    </div>
                  ))}
                  {plannedElectives.map(r => (
                    <div key={r.id} className="flex items-start gap-2 text-sm text-blue-500">
                      <span className="mt-0.5">◷</span>
                      <span>{r.course_code} — planned</span>
                    </div>
                  ))}
                </>
              )}
              {cat.elective_credits_still_needed > 0 && (
                <div className="text-sm text-gray-400 mt-1">
                  {cat.elective_credits_still_needed} elective credits still needed
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function RequirementsSidebar({ audit, currentGPA }: Props) {
  const csMajor = audit.filter(a => a.program === 'CS_MAJOR')
  const finance  = audit.filter(a => a.program === 'FINANCE_MINOR')
  const totalComplete = audit.filter(a => a.is_complete).length

  return (
    <aside className="flex-shrink-0 flex flex-col border-r border-gray-200 bg-gray-50 overflow-hidden" style={{ width: '420px' }}>
      <div className="px-5 py-4 border-b border-gray-200 bg-white">
        <div className="text-lg font-bold text-gray-900">Degree Progress</div>
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>{totalComplete}/{audit.length} categories complete</span>
          <span className="font-semibold text-base" style={{ color: '#A51417' }}>GPA {currentGPA.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">CS Major</div>
          <div className="space-y-2.5">
            {csMajor.map(cat => <CategoryCard key={cat.category} cat={cat} />)}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Finance Minor</div>
          <div className="space-y-2.5">
            {finance.map(cat => <CategoryCard key={cat.category} cat={cat} />)}
          </div>
        </div>
      </div>
    </aside>
  )
}
