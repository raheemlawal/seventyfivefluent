import { useProfile } from '@/hooks/useProfile'
import { getTranslations, type Language, type Translations } from '@/lib/i18n'

export function useTranslation() {
  const { profile } = useProfile()
  const language = (profile?.primary_language as Language) || 'Spanish'
  const translations = getTranslations(language)

  return {
    t: translations,
    language,
  }
}
