'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { api, setAuthToken } from '@/lib/api'

interface AuthContextType {
  session: Session | null
  user: User | null
  isAdmin: boolean
  canUseAI: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [canUseAI, setCanUseAI] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)

      if (session) {
        setAuthToken(session.access_token)
      } else {
        setAuthToken(null)
        setIsAdmin(false)
        setCanUseAI(false)
      }

      if (event === 'INITIAL_SESSION') {
        setInitialized(true)
        if (session) {
          try {
            const perms = await api.admin.me()
            setIsAdmin(perms.is_admin)
            setCanUseAI(perms.can_use_ai)
            if (perms.is_admin) await api.admin.claimData()  // claim before init
            await api.planner.init()
          } catch {
            // permissions check failed; leave defaults
          }
        }
      } else if (event === 'SIGNED_IN') {
        try {
          const perms = await api.admin.me()
          setIsAdmin(perms.is_admin)
          setCanUseAI(perms.can_use_ai)
          if (perms.is_admin) await api.admin.claimData()  // claim before init
          await api.planner.init()
        } catch {
          // permissions check failed; leave defaults
        }
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setAuthToken(session.access_token)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  if (!initialized) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, isAdmin, canUseAI, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
