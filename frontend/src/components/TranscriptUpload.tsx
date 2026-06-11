'use client'

import { useRef, useState } from 'react'
import { api } from '@/lib/api'

interface Props {
  onImported: () => void
}

type Step = 'warn' | 'uploading' | 'done' | 'error'

export default function TranscriptUpload({ onImported }: Props) {
  const [step, setStep]     = useState<Step | null>(null)
  const [result, setResult] = useState<{ imported_courses: number; transfer_credits: number; semesters_updated: number } | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const open = () => setStep('warn')

  const cancel = () => {
    setStep(null)
    setResult(null)
    setErrorMsg('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const confirmUpload = () => {
    fileRef.current?.click()
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setStep('uploading')
    try {
      const res = await api.planner.uploadTranscript(file)
      setResult(res)
      setStep('done')
      onImported()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed')
      setStep('error')
    }
  }

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={handleFile}
      />

      {/* Trigger button */}
      <button
        onClick={open}
        className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
        title="Upload WashU transcript (.xlsx)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        Transcript
      </button>

      {/* Modal overlay */}
      {step !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">

            {step === 'warn' && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A51417" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-base font-bold text-gray-900">Reset planner from transcript?</div>
                    <div className="text-sm text-gray-500 mt-0.5">This cannot be undone</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  Uploading your WashU transcript will:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-5 ml-4 list-disc">
                  <li>Delete all courses currently in your planner</li>
                  <li>Import your completed coursework into the correct semesters</li>
                  <li>Import AP/transfer credits into the AP column</li>
                  <li>Mark completed semesters automatically</li>
                </ul>
                <p className="text-xs text-gray-400 mb-5">
                  Export your transcript from Student Web as <span className="font-semibold">View My Academic Record → Download (.xlsx)</span>.
                  Courses not in the catalog will still be imported and count toward requirements.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={confirmUpload}
                    className="flex-1 text-sm font-semibold text-white py-2.5 rounded-xl transition-colors"
                    style={{ backgroundColor: '#A51417' }}
                  >
                    Choose file & import
                  </button>
                  <button
                    onClick={cancel}
                    className="flex-1 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 py-2.5 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {step === 'uploading' && (
              <div className="flex flex-col items-center py-6 gap-4">
                <div className="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#A51417' }} />
                <div className="text-base font-semibold text-gray-700">Importing transcript...</div>
                <div className="text-sm text-gray-400">Parsing your coursework</div>
              </div>
            )}

            {step === 'done' && result && (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-base font-bold text-gray-900">Transcript imported</div>
                    <div className="text-sm text-gray-500 mt-0.5">Your planner has been updated</div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Courses imported</span>
                    <span className="font-semibold text-gray-800">{result.imported_courses}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">AP / transfer credits</span>
                    <span className="font-semibold text-gray-800">{result.transfer_credits}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Semesters marked complete</span>
                    <span className="font-semibold text-gray-800">{result.semesters_updated}</span>
                  </div>
                </div>
                <button
                  onClick={cancel}
                  className="w-full text-sm font-semibold text-white py-2.5 rounded-xl transition-colors"
                  style={{ backgroundColor: '#A51417' }}
                >
                  Done
                </button>
              </>
            )}

            {step === 'error' && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-base font-bold text-gray-900">Import failed</div>
                    <div className="text-sm text-gray-500 mt-0.5">{errorMsg}</div>
                  </div>
                </div>
                <button
                  onClick={cancel}
                  className="w-full text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 py-2.5 rounded-xl transition-colors"
                >
                  Close
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  )
}
