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
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user!.id)
          .single()

        if (error) {
          // If it's a "not found" error (PGRST116), that's expected - user hasn't completed onboarding
          // For other errors, we still want to set the error
          if (error.code === 'PGRST116') {
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

