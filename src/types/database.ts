export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          timezone: string
          primary_language: string
          target_languages: string[]
          start_date: string
          is_public: boolean
          current_streak: number
          longest_streak: number
          total_completed: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          timezone?: string
          primary_language: string
          target_languages?: string[]
          start_date: string
          is_public?: boolean
          current_streak?: number
          longest_streak?: number
          total_completed?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          timezone?: string
          primary_language?: string
          target_languages?: string[]
          start_date?: string
          is_public?: boolean
          current_streak?: number
          longest_streak?: number
          total_completed?: number
          created_at?: string
          updated_at?: string
        }
      }
      daily_logs: {
        Row: {
          id: string
          user_id: string
          log_date: string
          study_minutes: number
          reading_pages: number
          speaking_done: boolean
          media_done: boolean
          media_title: string | null
          media_url: string | null
          journal_entry: string | null
          immersion_done: boolean
          immersion_note: string | null
          study_log_note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          log_date: string
          study_minutes?: number
          reading_pages?: number
          speaking_done?: boolean
          media_done?: boolean
          media_title?: string | null
          media_url?: string | null
          journal_entry?: string | null
          immersion_done?: boolean
          immersion_note?: string | null
          study_log_note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          log_date?: string
          study_minutes?: number
          reading_pages?: number
          speaking_done?: boolean
          media_done?: boolean
          media_title?: string | null
          media_url?: string | null
          journal_entry?: string | null
          immersion_done?: boolean
          immersion_note?: string | null
          study_log_note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

