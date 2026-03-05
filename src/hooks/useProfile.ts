import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Profile } from '@/types'

export function useProfile() {
  const { user, loading: authLoading, session } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Reset state when user changes
    setProfile(null)
    setError(null)
    setLoading(true)

    // Don't fetch if auth is loading, no user, no session, or no access_token
    if (authLoading || !user || !session || !session.access_token) {
      setLoading(false)
      return
    }

    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user!.id)
          .maybeSingle() // Use maybeSingle() instead of single() - returns null instead of error when no rows

        if (error) {
          throw error
        }

        // maybeSingle() returns null when no rows found (user hasn't completed onboarding)
        setProfile(data || null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, session, authLoading])

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
      
      // Update localStorage if primary_language changed
      if (updates.primary_language && typeof window !== 'undefined') {
        try {
          localStorage.setItem('75fluent_ui_language', updates.primary_language)
        } catch {
          // Ignore localStorage errors
        }
      }
      
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return { profile, loading, error, updateProfile }
}
