'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function LoginPage() {
  const { session, signIn, signUp } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) router.push('/')
  }, [session, router])

  if (session) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
        router.push('/')
      } else {
        await signUp(email, password)
        setMessage('Account created! Check your email to confirm, then sign in.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (next: 'signin' | 'signup') => {
    setMode(next)
    setError(null)
    setMessage(null)
  }

  return (
    <div className="flex h-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm px-4">
        <div className="flex flex-col items-center mb-8">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L4 7V16C4 22.6 9.4 28.6 16 30C22.6 28.6 28 22.6 28 16V7L16 2Z" fill="#A51417" fillOpacity="0.15" stroke="#A51417" strokeWidth="1.5"/>
            <text x="16" y="20" textAnchor="middle" fill="#A51417" fontSize="11" fontWeight="bold" fontFamily="serif">WU</text>
          </svg>
          <h1 className="mt-3 text-xl font-bold text-gray-900">WashU Academic Advisor</h1>
          <p className="text-sm text-gray-500">Washington University in St. Louis</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#A51417] focus:ring-1 focus:ring-[#A51417]"
                placeholder="you@wustl.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#A51417] focus:ring-1 focus:ring-[#A51417]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {message && (
              <div className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white text-sm font-medium py-2.5 rounded-xl disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: '#A51417' }}
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-500">
            {mode === 'signin' ? (
              <>Don&apos;t have an account?{' '}
                <button onClick={() => switchMode('signup')} className="font-medium hover:underline" style={{ color: '#A51417' }}>
                  Sign up
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => switchMode('signin')} className="font-medium hover:underline" style={{ color: '#A51417' }}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
