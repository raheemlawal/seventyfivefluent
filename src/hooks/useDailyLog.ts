import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { getTodayInTimezone } from '@/lib/date-utils'
import type { DailyLog, DailyLogInsert, DailyLogUpdate } from '@/types'

export function useDailyLog(date?: string, language?: string | null) {
  const { user, loading: authLoading, session } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const [log, setLog] = useState<DailyLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [saving, setSaving] = useState(false)

  const targetDate = date || (profile ? getTodayInTimezone(profile.timezone) : '')
  
  // Determine which language to use:
  // 1. Explicit language parameter
  // 2. If user has only one target language, use that
  // 3. Otherwise, use null (for backward compatibility with single-log-per-day)
  const targetLanguage = language !== undefined 
    ? language 
    : (profile?.target_languages?.length === 1 ? profile.target_languages[0] : null)

  useEffect(() => {
    // Don't fetch if auth is loading, profile is loading, no session, no user, no targetDate, or no profile
    // Also check that session has a valid access_token
    if (
      authLoading || 
      profileLoading || 
      !session || 
      !session.access_token || 
      !user || 
      !targetDate || 
      !profile
    ) {
      setLog(null)
      setLoading(false)
      return
    }

    async function fetchLog() {
      try {
        let query = supabase
          .from('daily_logs')
          .select('*')
          .eq('user_id', user!.id)
          .eq('log_date', targetDate)

        // Filter by language if specified
        if (targetLanguage !== null && targetLanguage !== undefined) {
          query = query.eq('language', targetLanguage)
        } else {
          // For backward compatibility: if no language specified, get log with null language
          // (old logs don't have language set)
          query = query.is('language', null)
        }

        const { data, error } = await query.maybeSingle()

        if (error) {
          throw error
        }

        // maybeSingle() returns null when no rows found, which is what we want
        setLog(data || null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchLog()
  }, [user, session, targetDate, targetLanguage, profile, authLoading, profileLoading])

  const saveLog = useCallback(async (updates: Partial<DailyLogUpdate>) => {
    if (!user || !targetDate) return

    setSaving(true)
    setError(null)

    try {
      if (log) {
        // Update existing log
        const { data, error } = await supabase
          .from('daily_logs')
          .update(updates)
          .eq('id', log.id)
          .select()
          .single()

        if (error) throw error
        setLog(data)
      } else {
        // Create new log
        const newLog: DailyLogInsert = {
          user_id: user.id,
          log_date: targetDate,
          language: targetLanguage || null,
          ...updates,
        }

        const { data, error } = await supabase
          .from('daily_logs')
          .insert(newLog)
          .select()
          .single()

        if (error) throw error
        setLog(data)
      }
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setSaving(false)
    }
  }, [user, targetDate, targetLanguage, log])

  return { log, loading, error, saving, saveLog, refetch: () => {
    setLoading(true)
    // Trigger re-fetch by updating a dependency
  } }
}

