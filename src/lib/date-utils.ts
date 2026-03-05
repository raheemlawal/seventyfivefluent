import { format, formatInTimeZone } from 'date-fns-tz'
import { parseISO } from 'date-fns'
import { es, enUS, nl, da, it } from 'date-fns/locale'
import type { Locale } from 'date-fns'

/**
 * Get the locale based on language string
 */
export function getLocale(language: string = 'English'): Locale {
  if (language === 'Spanish' || language === 'es' || language.toLowerCase() === 'spanish') {
    return es
  }
  if (language === 'Dutch' || language === 'nl' || language.toLowerCase() === 'dutch') {
    return nl
  }
  if (language === 'Danish' || language === 'da' || language.toLowerCase() === 'danish') {
    return da
  }
  if (language === 'Italian' || language === 'it' || language.toLowerCase() === 'italian') {
    return it
  }
  return enUS
}

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
export function parseDateInTimezone(dateString: string, _timezone: string = 'UTC'): Date {
  // Parse the date string and create a date in the user's timezone
  const date = parseISO(dateString)
  return date
}

/**
 * Capitalize the first letter of a string
 */
function capitalizeFirst(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Capitalize day and month names in Spanish date strings
 * Handles formats like "jueves, marzo 5, 2026" -> "Jueves, Marzo 5, 2026"
 */
function capitalizeSpanishDate(dateStr: string): string {
  // Split by comma to handle day and month separately
  const parts = dateStr.split(',')
  if (parts.length >= 2) {
    // Capitalize day name (first part)
    const day = capitalizeFirst(parts[0].trim())
    // Capitalize month name in the second part (before the number)
    const rest = parts.slice(1).join(',').trim()
    // Match month name (letters before the first number)
    const monthMatch = rest.match(/^([a-záéíóúñü]+)/i)
    if (monthMatch) {
      const month = capitalizeFirst(monthMatch[1])
      const afterMonth = rest.substring(monthMatch[1].length)
      return `${day}, ${month}${afterMonth}`
    }
    return `${day}, ${rest}`
  }
  // If no comma, just capitalize first letter
  return capitalizeFirst(dateStr)
}

/**
 * Format a date string for display with locale support
 * For Spanish, capitalizes the first letter of day and month names
 */
export function formatDate(dateString: string, formatStr: string = 'MMM d, yyyy', language: string = 'English'): string {
  const date = parseISO(dateString)
  const locale = getLocale(language)
  const formatted = format(date, formatStr, { locale })
  
  // Capitalize day and month names for Spanish dates (they're lowercase by default)
  if (language === 'Spanish' || language === 'es' || language.toLowerCase() === 'spanish') {
    return capitalizeSpanishDate(formatted)
  }
  
  return formatted
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

