import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Profile } from '@/types'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Reset state when user changes
    setProfile(null)
    setError(null)
    setLoading(true)

    if (!user) {
      setLoading(false)
      return
    }

    async function fetchProfile() {
      try {
        // Ensure we have a session before making the request
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user!.id)
          .single()

        if (error) {
          // If it's a "not found" error (PGRST116), that's expected - user hasn't completed onboarding
          // Handle 406 errors (Not Acceptable) - might be a configuration issue
          if (error.code === 'PGRST116') {
            setProfile(null)
          } else if (error.code === '406' || error.message?.includes('406') || error.message?.includes('Not Acceptable')) {
            // 406 error - log it but don't throw, try to continue
            console.error('Supabase 406 error:', error)
            setProfile(null)
          } else {
            throw error
          }
        } else {
          setProfile(data)
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      setProfile(data)
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return { profile, loading, error, updateProfile }
}

