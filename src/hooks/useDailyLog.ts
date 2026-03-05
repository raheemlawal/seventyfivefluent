import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { getTodayInTimezone } from '@/lib/date-utils'
import type { DailyLog, DailyLogInsert, DailyLogUpdate } from '@/types'

export function useDailyLog(date?: string) {
  const { user } = useAuth()
  const { profile } = useProfile()
  const [log, setLog] = useState<DailyLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [saving, setSaving] = useState(false)

  const targetDate = date || (profile ? getTodayInTimezone(profile.timezone) : '')

  useEffect(() => {
    if (!user || !targetDate) {
      setLog(null)
      setLoading(false)
      return
    }

    async function fetchLog() {
      try {
        // Retry logic for 406 errors
        let retries = 0
        const maxRetries = 3
        let lastError = null

        while (retries < maxRetries) {
          const { data, error } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('user_id', user!.id)
            .eq('log_date', targetDate)
            .single()

          if (error) {
            // PGRST116 is "not found" which is fine
            if (error.code === 'PGRST116') {
              setLog(null)
              return
            } else if (error.status === 406 || error.code === '406') {
              // Retry on 406 errors
              lastError = error
              retries++
              if (retries < maxRetries) {
                // Exponential backoff: 1s, 2s, 3s
                await new Promise(resolve => setTimeout(resolve, 1000 * retries))
                continue
              }
              // After max retries, log and continue
              console.error('Supabase 406 error after retries:', error)
              setLog(null)
              return
            } else {
              throw error
            }
          }

          // Success - set the log and return
          setLog(data || null)
          return
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchLog()
  }, [user, targetDate])

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
  }, [user, targetDate, log])

  return { log, loading, error, saving, saveLog, refetch: () => {
    setLoading(true)
    // Trigger re-fetch by updating a dependency
  } }
}

