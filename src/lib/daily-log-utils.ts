import type { DailyLog } from '@/types'

/**
 * Check if a daily log is complete (all 7 rules met)
 */
export function isDailyLogComplete(log: DailyLog | null): boolean {
  if (!log) return false

  return (
    log.study_minutes >= 60 &&
    log.reading_pages >= 5 &&
    log.speaking_done === true &&
    log.media_done === true &&
    log.immersion_done === true &&
    log.journal_entry !== null &&
    log.journal_entry.trim() !== '' &&
    log.study_log_note !== null &&
    log.study_log_note.trim() !== ''
  )
}

/**
 * Get completion percentage for a daily log
 */
export function getCompletionPercentage(log: DailyLog | null): number {
  if (!log) return 0

  let completed = 0
  const total = 7

  if (log.study_minutes >= 60) completed++
  if (log.reading_pages >= 5) completed++
  if (log.speaking_done) completed++
  if (log.media_done) completed++
  if (log.immersion_done) completed++
  if (log.journal_entry && log.journal_entry.trim() !== '') completed++
  if (log.study_log_note && log.study_log_note.trim() !== '') completed++

  return Math.round((completed / total) * 100)
}

