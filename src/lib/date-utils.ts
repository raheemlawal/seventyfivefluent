import { format, formatInTimeZone, toDate } from 'date-fns-tz'
import { parseISO, startOfDay } from 'date-fns'

/**
 * Get today's date in the user's timezone as a date string (YYYY-MM-DD)
 */
export function getTodayInTimezone(timezone: string = 'UTC'): string {
  const now = new Date()
  return formatInTimeZone(now, timezone, 'yyyy-MM-dd')
}

/**
 * Convert a date string to a Date object in the user's timezone
 */
export function parseDateInTimezone(dateString: string, timezone: string = 'UTC'): Date {
  // Parse the date string and create a date in the user's timezone
  const date = parseISO(dateString)
  return date
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string, formatStr: string = 'MMM d, yyyy'): string {
  const date = parseISO(dateString)
  return format(date, formatStr)
}

/**
 * Check if a date string is today in the given timezone
 */
export function isToday(dateString: string, timezone: string = 'UTC'): boolean {
  const today = getTodayInTimezone(timezone)
  return dateString === today
}

/**
 * Get the start of day in the user's timezone
 */
export function getStartOfDayInTimezone(date: Date, timezone: string = 'UTC'): Date {
  const dateStr = formatInTimeZone(date, timezone, 'yyyy-MM-dd')
  return parseISO(dateStr)
}

