import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type DailyLog = Database['public']['Tables']['daily_logs']['Row']
export type DailyLogInsert = Database['public']['Tables']['daily_logs']['Insert']
export type DailyLogUpdate = Database['public']['Tables']['daily_logs']['Update']

export interface DailyLogWithCompletion extends DailyLog {
  completed: boolean
}

export interface HabitCompletion {
  habit: string
  completed: number
  total: number
  percentage: number
}

