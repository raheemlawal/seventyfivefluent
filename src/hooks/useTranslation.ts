import { useEffect, useMemo } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { getTranslations } from '@/lib/i18n'

const LANGUAGE_STORAGE_KEY = '75fluent_ui_language'

// Get language from localStorage (available immediately on page load)
function getStoredLanguage(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY)
  } catch {
    return null
  }
}

// Store language in localStorage
function storeLanguage(language: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Ignore localStorage errors (e.g., private browsing mode)
  }
}

export function useTranslation() {
  const { profile } = useProfile()
  
  // Get language priority: profile > localStorage > default to English
  const language = useMemo(() => {
    // First, use profile language if available
    if (profile?.primary_language) {
      return profile.primary_language
    }
    // Second, check localStorage (available immediately on page load)
    const stored = getStoredLanguage()
    const supportedLanguages = ['English', 'Spanish', 'Dutch', 'Danish', 'Italian']
    if (stored && supportedLanguages.includes(stored)) {
      return stored
    }
    // Default to English
    return 'English'
  }, [profile?.primary_language])

  // Update localStorage whenever profile language changes
  useEffect(() => {
    if (profile?.primary_language) {
      storeLanguage(profile.primary_language)
    }
  }, [profile?.primary_language])

  const translations = useMemo(() => getTranslations(language), [language])

  return {
    t: translations,
    language,
  }
}

// Export function to clear stored language (useful on sign out)
export function clearStoredLanguage(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY)
  } catch {
    // Ignore localStorage errors
  }
}
