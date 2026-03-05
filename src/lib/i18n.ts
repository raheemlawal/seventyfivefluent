// Translation system for 75 Fluent

export type Language = 'Spanish' | 'English'

export interface Translations {
  // Navigation
  dashboard: string
  history: string
  progress: string
  library: string
  signOut: string

  // Dashboard
  dashboardTitle: string
  currentStreak: string
  longestStreak: string
  totalCompleted: string
  days: string
  todaysChecklist: string
  complete: string
  save: string
  saving: string
  allTasksCompleted: string
  greatWork: string

  // History
  historyTitle: string
  viewDailyCompletion: string
  recentLogs: string
  noLogsYet: string
  startTracking: string

  // Progress
  progressTitle: string
  trackLanguageLearning: string
  habitCompletionRates: string
  consecutiveDays: string
  bestStreak: string
  daysCompleted: string

  // Library
  libraryTitle: string
  browsePastEntries: string
  journalEntries: string
  savedMedia: string
  noJournalEntries: string
  noSavedMedia: string
  openLink: string

  // Common
  loading: string
  error: string
  back: string
  next: string
  
  // Stats
  consecutiveDays: string
  bestStreak: string
  daysCompleted: string
  
  // Library empty states
  startWritingJournal: string
  logPodcastsVideos: string
  
  // Habits
  habit60MinutesStudy: string
  habit5PagesReading: string
  habit5MinutesSpeaking: string
  habitMediaConsumption: string
  habitJournalEntry: string
  habitImmersion: string
  habitStudyLog: string
}

const translations: Record<Language, Translations> = {
  English: {
    dashboard: 'Dashboard',
    history: 'History',
    progress: 'Progress',
    library: 'Library',
    signOut: 'Sign Out',
    dashboardTitle: 'Dashboard',
    currentStreak: 'Current Streak',
    longestStreak: 'Longest Streak',
    totalCompleted: 'Total Completed',
    days: 'days',
    todaysChecklist: "Today's Checklist",
    complete: 'Complete',
    save: 'Save',
    saving: 'Saving...',
    allTasksCompleted: 'All tasks completed!',
    greatWork: 'Great work!',
    historyTitle: 'History',
    viewDailyCompletion: 'View your daily completion history and track your progress',
    recentLogs: 'Recent Logs',
    noLogsYet: 'No logs yet. Start tracking your daily progress!',
    startTracking: 'Start tracking your daily progress!',
    progressTitle: 'Progress',
    trackLanguageLearning: 'Track your language learning journey and completion statistics',
    habitCompletionRates: 'Habit Completion Rates',
    consecutiveDays: 'consecutive days',
    bestStreak: 'best streak',
    daysCompleted: 'days completed',
    startWritingJournal: 'Start writing journal entries in your target language to see them here.',
    logPodcastsVideos: "Log podcasts, videos, or episodes you've watched to see them here.",
    habit60MinutesStudy: '60 Minutes Study',
    habit5PagesReading: '5 Pages Reading',
    habit5MinutesSpeaking: '5 Minutes Speaking',
    habitMediaConsumption: 'Media Consumption',
    habitJournalEntry: 'Journal Entry',
    habitImmersion: 'Immersion',
    habitStudyLog: 'Study Log',
    libraryTitle: 'Library',
    browsePastEntries: 'Browse your past journal entries and saved media content',
    journalEntries: 'Journal Entries',
    savedMedia: 'Saved Media',
    noJournalEntries: 'No journal entries yet',
    noSavedMedia: 'No saved media yet',
    openLink: 'Open Link',
    loading: 'Loading...',
    error: 'Error',
    back: 'Back',
    next: 'Next',
  },
  Spanish: {
    dashboard: 'Panel',
    history: 'Historial',
    progress: 'Progreso',
    library: 'Biblioteca',
    signOut: 'Cerrar Sesión',
    dashboardTitle: 'Panel',
    currentStreak: 'Racha Actual',
    longestStreak: 'Racha Más Larga',
    totalCompleted: 'Total Completado',
    days: 'días',
    todaysChecklist: 'Lista de Hoy',
    complete: 'Completo',
    save: 'Guardar',
    saving: 'Guardando...',
    allTasksCompleted: '¡Todas las tareas completadas!',
    greatWork: '¡Buen trabajo!',
    historyTitle: 'Historial',
    viewDailyCompletion: 'Ver tu historial de completado diario y rastrear tu progreso',
    recentLogs: 'Registros Recientes',
    noLogsYet: 'Aún no hay registros. ¡Comienza a rastrear tu progreso diario!',
    startTracking: '¡Comienza a rastrear tu progreso diario!',
    progressTitle: 'Progreso',
    trackLanguageLearning: 'Rastrea tu viaje de aprendizaje de idiomas y estadísticas de completado',
    habitCompletionRates: 'Tasas de Completado de Hábitos',
    consecutiveDays: 'días consecutivos',
    bestStreak: 'mejor racha',
    daysCompleted: 'días completados',
    startWritingJournal: 'Comienza a escribir entradas de diario en tu idioma objetivo para verlas aquí.',
    logPodcastsVideos: 'Registra podcasts, videos o episodios que hayas visto para verlos aquí.',
    habit60MinutesStudy: '60 Minutos de Estudio',
    habit5PagesReading: '5 Páginas de Lectura',
    habit5MinutesSpeaking: '5 Minutos de Conversación',
    habitMediaConsumption: 'Consumo de Medios',
    habitJournalEntry: 'Entrada de Diario',
    habitImmersion: 'Inmersión',
    habitStudyLog: 'Registro de Estudio',
    libraryTitle: 'Biblioteca',
    browsePastEntries: 'Navega tus entradas de diario pasadas y contenido de medios guardados',
    journalEntries: 'Entradas de Diario',
    savedMedia: 'Medios Guardados',
    noJournalEntries: 'Aún no hay entradas de diario',
    noSavedMedia: 'Aún no hay medios guardados',
    openLink: 'Abrir Enlace',
    loading: 'Cargando...',
    error: 'Error',
    back: 'Atrás',
    next: 'Siguiente',
  },
}

export function getTranslations(language: Language = 'Spanish'): Translations {
  return translations[language] || translations.Spanish
}

export function t(key: keyof Translations, language: Language = 'Spanish'): string {
  const trans = getTranslations(language)
  return trans[key] || key
}
