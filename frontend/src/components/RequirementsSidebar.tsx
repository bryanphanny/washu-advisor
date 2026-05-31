'use client'

import { useState } from 'react'
import type { AuditCategory } from '@/lib/types'

interface Props {
  audit: AuditCategory[]
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: pct >= 100 ? '#16a34a' : '#A51417' }}
      />
    </div>
  )
}

function CategoryCard({ cat }: { cat: AuditCategory }) {
  const [open, setOpen] = useState(!cat.is_complete)

  const satisfiedCount = cat.satisfied_required.length + cat.satisfied_electives.length
  const totalRequired = cat.satisfied_required.length + cat.unsatisfied_required.length
  const creditsDone = cat.satisfied_required.reduce((s, r) => s + r.credits, 0)
    + cat.satisfied_electives.reduce((s, r) => s + r.credits, 0)
  const pct = cat.credits_required > 0 ? (creditsDone / cat.credits_required) * 100 : 0

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cat.is_complete ? 'bg-green-500' : 'bg-red-400'}`} />
          <span className="text-xs font-semibold text-gray-800 truncate">{cat.category}</span>
        </div>
        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
          {creditsDone}/{cat.credits_required} cr
        </span>
      </button>

      <div className="px-3 pt-1 pb-2">
        <ProgressBar pct={pct} />
      </div>

      {open && (
        <div className="px-3 pb-2 space-y-0.5">
          {cat.satisfied_required.map(r => (
            <div key={r.id} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="text-green-600">✓</span>
              <span className="truncate">{r.course_code}</span>
            </div>
          ))}
          {cat.unsatisfied_required.map(r => (
            <div key={r.id} className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="text-red-400">○</span>
              <span className="truncate">{r.course_code} — {r.course_name}</span>
            </div>
          ))}
          {cat.satisfied_electives.length > 0 && (
            <>
              <div className="text-xs text-gray-400 mt-1">Electives taken:</div>
              {cat.satisfied_electives.map(r => (
                <div key={r.id} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span className="truncate">{r.course_code}</span>
                </div>
              ))}
            </>
          )}
          {cat.elective_credits_still_needed > 0 && (
            <div className="text-xs text-gray-400 mt-0.5">
              {cat.elective_credits_still_needed} elective credits still needed
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function RequirementsSidebar({ audit }: Props) {
  const csMajor = audit.filter(a => a.program === 'CS_MAJOR')
  const finance = audit.filter(a => a.program === 'FINANCE_MINOR')
  const totalComplete = audit.filter(a => a.is_complete).length
  const gpa = 3.96

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col border-r border-gray-200 bg-gray-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="text-sm font-bold text-gray-800">Degree Progress</div>
        <div className="flex justify-between text-xs text-gray-500 mt-0.5">
          <span>{totalComplete}/{audit.length} categories complete</span>
          <span className="font-semibold" style={{ color: '#A51417' }}>GPA {gpa}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            CS Major
          </div>
          <div className="space-y-2">
            {csMajor.map(cat => <CategoryCard key={cat.category} cat={cat} />)}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Finance Minor
          </div>
          <div className="space-y-2">
            {finance.map(cat => <CategoryCard key={cat.category} cat={cat} />)}
          </div>
        </div>
      </div>
    </aside>
  )
}
