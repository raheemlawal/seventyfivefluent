import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { DailyLog } from '@/types'

export function useDailyLogs(startDate?: string, endDate?: string) {
  const { user } = useAuth()
  const [logs, setLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setLogs([])
      setLoading(false)
      return
    }

    async function fetchLogs() {
      try {
        // Retry logic for 406 errors
        let retries = 0
        const maxRetries = 3

        while (retries < maxRetries) {
          let query = supabase
            .from('daily_logs')
            .select('*')
            .eq('user_id', user!.id)
            .order('log_date', { ascending: false })

          if (startDate) {
            query = query.gte('log_date', startDate)
          }
          if (endDate) {
            query = query.lte('log_date', endDate)
          }

          const { data, error } = await query

          if (error) {
            // Handle 406 errors (Not Acceptable) - retry
            if (error.status === 406 || error.code === '406') {
              retries++
              if (retries < maxRetries) {
                // Exponential backoff: 1s, 2s, 3s
                await new Promise(resolve => setTimeout(resolve, 1000 * retries))
                continue
              }
              // After max retries, log and set empty array
              console.error('Supabase 406 error after retries:', error)
              setLogs([])
              return
            } else {
              throw error
            }
          } else {
            // Success - set the logs and return
            setLogs(data || [])
            return
          }
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [user, startDate, endDate])

  return { logs, loading, error }
}

