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
        let query = supabase
          .from('daily_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('log_date', { ascending: false })

        if (startDate) {
          query = query.gte('log_date', startDate)
        }
        if (endDate) {
          query = query.lte('log_date', endDate)
        }

        const { data, error } = await query

        if (error) throw error
        setLogs(data || [])
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

