import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']

interface AuthContextType {
  user: User | null
  session: Session
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session>(null)
  const [loading, setLoading] = useState(true)
  const sessionRef = useRef<Session>(null)

  useEffect(() => {
    let mounted = true
    let subscription: { unsubscribe: () => void } | null = null

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      sessionRef.current = session
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      sessionRef.current = session
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })
    subscription = authSubscription

    // Refresh session when tab becomes visible - but only update state if session actually changed
    // This prevents unnecessary re-fetches (useProfile, useDailyLogs) when switching tabs
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        supabase.auth.getSession().then(({ data: { session: newSession } }) => {
          if (!mounted) return
          const prev = sessionRef.current
          const prevUserId = prev?.user?.id
          const prevToken = prev?.access_token
          const newUserId = newSession?.user?.id
          const newToken = newSession?.access_token
          // Only update if user changed, signed out, or token refreshed
          const changed =
            prevUserId !== newUserId ||
            prevToken !== newToken ||
            (prev && !newSession)
          if (changed) {
            sessionRef.current = newSession
            setSession(newSession)
            setUser(newSession?.user ?? null)
          }
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      mounted = false
      subscription?.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const signOut = useCallback(async () => {
    // Clear stored language preference on sign out
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('75fluent_ui_language')
      } catch {
        // Ignore localStorage errors
      }
    }
    await supabase.auth.signOut()
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

