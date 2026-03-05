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

        // Retry logic for 406 errors
        let retries = 0
        const maxRetries = 3

        while (retries < maxRetries) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user!.id)
            .single()

          if (error) {
            // If it's a "not found" error (PGRST116), that's expected - user hasn't completed onboarding
            if (error.code === 'PGRST116') {
              setProfile(null)
              return
            } else if (error.code === '406' || error.message?.includes('406') || error.message?.includes('Not Acceptable')) {
              // Retry on 406 errors
              retries++
              if (retries < maxRetries) {
                // Exponential backoff: 1s, 2s, 3s
                await new Promise(resolve => setTimeout(resolve, 1000 * retries))
                continue
              }
              // After max retries, log and continue
              console.error('Supabase 406 error after retries:', error)
              setProfile(null)
              return
            } else {
              throw error
            }
          } else {
            // Success - set the profile and return
            setProfile(data)
            return
          }
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

