// Translation system for 75 Fluent

export type Language = 'Spanish' | 'English' | 'Dutch' | 'Danish' | 'Italian'

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
  
  // Dashboard components
  studyMinutes: string
  readingPages: string
  minutesOfSpeaking: string
  podcastVideoEpisode: string
  journalEntry: string
  immersion: string
  trackYourStudy: string
  done: string
  goalReached: string
  min: string
  pages: string
  journalPlaceholder: string
  journalHint: string
  immersionPlaceholder: string
  studyLogPlaceholder: string
  studyLogHint: string
  mediaTitlePlaceholder: string
  mediaUrlPlaceholder: string
  selectLanguage: string
  trackForLanguage: string
  allLanguages: string
  
  // Calendar
  partial: string
  none: string
  
  // Streak visualization
  streakView30Days: string
  
  // Library
  yourContent: string
  searchPlaceholder: string
  
  // Calendar days
  sunday: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  
  // Profile/Settings
  profile: string
  profileTitle: string
  profileDescription: string
  settings: string
  settingsTitle: string
  settingsDescription: string
  edit: string
  username: string
  changeUsername: string
  usernamePlaceholder: string
  usernameAvailable: string
  usernameUnavailable: string
  usernameChecking: string
  saveUsername: string
  savingUsername: string
  membershipStatus: string
  membershipBasic: string
  membershipUpgrade: string
  membershipUpgradeDisabled: string
  uiLanguage: string
  changeUILanguage: string
  targetLanguages: string
  languagesLearning: string
  resetAll: string
  resetAllDescription: string
  resetAllConfirm: string
  resetAllWarning: string
  resetAllButton: string
  restartAccount: string
  restartAccountDescription: string
  restartAccountConfirm: string
  restartAccountWarning: string
  restartAccountButton: string
  cancel: string
  confirm: string
  info: string
  keepLanguages: string
  changeLanguages: string
  languageChangeTitle: string
  languageChangeDescription: string
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
    studyMinutes: 'Study Minutes',
    readingPages: 'Reading Pages',
    minutesOfSpeaking: '5 Minutes of Speaking',
    podcastVideoEpisode: 'Podcast / Video / Episode',
    journalEntry: 'Journal Entry',
    immersion: 'Immersion',
    trackYourStudy: 'Track Your Study',
    done: 'Done',
    goalReached: '✓ Goal reached!',
    min: 'min',
    pages: 'pages',
    journalPlaceholder: 'Write your daily journal entry in your target language...',
    journalHint: 'Write at least a few sentences in your target language',
    immersionPlaceholder: 'What did you do to immerse yourself? (optional)',
    studyLogPlaceholder: 'What did you study? What resources did you use? Any notes?',
    studyLogHint: 'Log your study session details and resources',
    mediaTitlePlaceholder: "Title (e.g., 'Spanish Podcast Episode 5')",
    mediaUrlPlaceholder: 'URL (optional)',
    selectLanguage: 'Select Language',
    trackForLanguage: 'Track your activities for this language',
    allLanguages: 'All Languages',
    partial: 'Partial',
    none: 'None',
    streakView30Days: '30-Day Streak View',
    yourContent: 'Your Content',
    searchPlaceholder: 'Search entries...',
    sunday: 'Sun',
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
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
    settings: 'Settings',
    settingsTitle: 'Settings',
    settingsDescription: 'Manage your account settings and preferences',
    edit: 'Edit',
    cancel: 'Cancel',
    profile: 'Profile',
    profileTitle: 'Profile Settings',
    profileDescription: 'Manage your account settings and preferences',
    restartAccount: 'Restart Account',
    restartAccountDescription: 'This will delete all your daily logs and reset your streaks. Your profile settings will remain unchanged.',
    restartAccountConfirm: 'Are you sure you want to restart your account? This will delete all your progress and cannot be undone.',
    restartAccountWarning: 'This will permanently delete all your daily logs and reset your streaks.',
    restartAccountButton: 'Restart Account',
    info: 'Info',
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
    studyMinutes: 'Minutos de Estudio',
    readingPages: 'Páginas de Lectura',
    minutesOfSpeaking: '5 Minutos de Conversación',
    podcastVideoEpisode: 'Podcast / Video / Episodio',
    journalEntry: 'Entrada de Diario',
    immersion: 'Inmersión',
    trackYourStudy: 'Rastrea Tu Estudio',
    done: 'Hecho',
    goalReached: '✓ ¡Meta alcanzada!',
    min: 'min',
    pages: 'páginas',
    journalPlaceholder: 'Escribe tu entrada de diario diaria en tu idioma objetivo...',
    journalHint: 'Escribe al menos unas pocas oraciones en tu idioma objetivo',
    immersionPlaceholder: '¿Qué hiciste para sumergirte? (opcional)',
    studyLogPlaceholder: '¿Qué estudiaste? ¿Qué recursos usaste? ¿Algún apunte?',
    studyLogHint: 'Registra los detalles de tu sesión de estudio y recursos',
    mediaTitlePlaceholder: "Título (ej., 'Episodio 5 del Podcast de Español')",
    mediaUrlPlaceholder: 'URL (opcional)',
    selectLanguage: 'Seleccionar Idioma',
    trackForLanguage: 'Rastrea tus actividades para este idioma',
    allLanguages: 'Todos los Idiomas',
    partial: 'Parcial',
    none: 'Ninguno',
    streakView30Days: 'Vista de Racha de 30 Días',
    yourContent: 'Tu Contenido',
    searchPlaceholder: 'Buscar entradas...',
    sunday: 'Dom',
    monday: 'Lun',
    tuesday: 'Mar',
    wednesday: 'Mié',
    thursday: 'Jue',
    friday: 'Vie',
    saturday: 'Sáb',
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
    profile: 'Perfil',
    profileTitle: 'Configuración del Perfil',
    profileDescription: 'Administra la configuración y preferencias de tu cuenta',
    settings: 'Configuración',
    settingsTitle: 'Configuración',
    settingsDescription: 'Administra la configuración y preferencias de tu cuenta',
    edit: 'Editar',
    username: 'Nombre de Usuario',
    changeUsername: 'Cambiar Nombre de Usuario',
    usernamePlaceholder: 'Ingresa un nuevo nombre de usuario',
    usernameAvailable: 'El nombre de usuario está disponible',
    usernameUnavailable: 'El nombre de usuario ya está en uso',
    usernameChecking: 'Verificando disponibilidad...',
    saveUsername: 'Guardar Nombre de Usuario',
    savingUsername: 'Guardando...',
    membershipStatus: 'Estado de Membresía',
    membershipBasic: 'Básica',
    membershipUpgrade: 'Mejorar',
    membershipUpgradeDisabled: 'Mejorar (Próximamente)',
    uiLanguage: 'Idioma de la Interfaz',
    changeUILanguage: 'Cambiar Idioma de la Interfaz',
    targetLanguages: 'Idiomas Objetivo',
    languagesLearning: 'Idiomas que Estás Aprendiendo',
    resetAll: 'Restablecer Todos los Datos',
    resetAllDescription: 'Esto eliminará todo tu progreso, registros y configuraciones. Necesitarás completar el registro nuevamente.',
    resetAllConfirm: '¿Estás seguro de que deseas restablecer todos tus datos? Esta acción no se puede deshacer.',
    resetAllWarning: 'Esto eliminará permanentemente todos tus datos.',
    resetAllButton: 'Restablecer Todo',
    cancel: 'Cancelar',
    restartAccount: 'Reiniciar Cuenta',
    restartAccountDescription: 'Esto eliminará todos tus registros diarios y restablecerá tus rachas. Tus configuraciones de perfil permanecerán sin cambios.',
    restartAccountConfirm: '¿Estás seguro de que deseas reiniciar tu cuenta? Esto eliminará todo tu progreso y no se puede deshacer.',
    restartAccountWarning: 'Esto eliminará permanentemente todos tus registros diarios y restablecerá tus rachas.',
    restartAccountButton: 'Reiniciar Cuenta',
    confirm: 'Confirmar',
    info: 'Información',
    keepLanguages: 'Mantener Idiomas Actuales',
    changeLanguages: 'Cambiar Idiomas',
    languageChangeTitle: 'Cambiar Idioma de la Interfaz',
    languageChangeDescription: '¿Deseas mantener tus idiomas objetivo actuales o cambiarlos?',
  },
  Dutch: {
    dashboard: 'Dashboard',
    history: 'Geschiedenis',
    progress: 'Voortgang',
    library: 'Bibliotheek',
    signOut: 'Uitloggen',
    dashboardTitle: 'Dashboard',
    currentStreak: 'Huidige Reeks',
    longestStreak: 'Langste Reeks',
    totalCompleted: 'Totaal Voltooid',
    days: 'dagen',
    todaysChecklist: 'Checklist van Vandaag',
    complete: 'Voltooid',
    save: 'Opslaan',
    saving: 'Opslaan...',
    allTasksCompleted: 'Alle taken voltooid!',
    greatWork: 'Goed gedaan!',
    historyTitle: 'Geschiedenis',
    viewDailyCompletion: 'Bekijk je dagelijkse voltooiingsgeschiedenis en volg je voortgang',
    recentLogs: 'Recente Logs',
    noLogsYet: 'Nog geen logs. Begin met het bijhouden van je dagelijkse voortgang!',
    startTracking: 'Begin met het bijhouden van je dagelijkse voortgang!',
    progressTitle: 'Voortgang',
    trackLanguageLearning: 'Volg je taal leerreis en voltooiingsstatistieken',
    habitCompletionRates: 'Gewoonte Voltooiingspercentages',
    consecutiveDays: 'opeenvolgende dagen',
    bestStreak: 'beste reeks',
    daysCompleted: 'dagen voltooid',
    startWritingJournal: 'Begin met het schrijven van dagboekvermeldingen in je doeltaal om ze hier te zien.',
    logPodcastsVideos: 'Log podcasts, video\'s of afleveringen die je hebt bekeken om ze hier te zien.',
    habit60MinutesStudy: '60 Minuten Studeren',
    habit5PagesReading: '5 Pagina\'s Lezen',
    habit5MinutesSpeaking: '5 Minuten Spreken',
    habitMediaConsumption: 'Mediaconsumptie',
    habitJournalEntry: 'Dagboekvermelding',
    habitImmersion: 'Onderdompeling',
    habitStudyLog: 'Studielog',
    studyMinutes: 'Studieminuten',
    readingPages: 'Leespagina\'s',
    minutesOfSpeaking: '5 Minuten Spreken',
    podcastVideoEpisode: 'Podcast / Video / Aflevering',
    journalEntry: 'Dagboekvermelding',
    immersion: 'Onderdompeling',
    trackYourStudy: 'Volg Je Studie',
    done: 'Klaar',
    goalReached: '✓ Doel bereikt!',
    min: 'min',
    pages: 'pagina\'s',
    journalPlaceholder: 'Schrijf je dagelijkse dagboekvermelding in je doeltaal...',
    journalHint: 'Schrijf ten minste een paar zinnen in je doeltaal',
    immersionPlaceholder: 'Wat heb je gedaan om jezelf onder te dompelen? (optioneel)',
    studyLogPlaceholder: 'Wat heb je gestudeerd? Welke bronnen heb je gebruikt? Enige notities?',
    studyLogHint: 'Log de details van je studiesessie en bronnen',
    mediaTitlePlaceholder: 'Titel (bijv., \'Nederlandse Podcast Aflevering 5\')',
    mediaUrlPlaceholder: 'URL (optioneel)',
    selectLanguage: 'Selecteer Taal',
    trackForLanguage: 'Volg je activiteiten voor deze taal',
    allLanguages: 'Alle Talen',
    partial: 'Gedeeltelijk',
    none: 'Geen',
    streakView30Days: '30-Dagen Reeksweergave',
    yourContent: 'Jouw Inhoud',
    searchPlaceholder: 'Zoek vermeldingen...',
    sunday: 'Zon',
    monday: 'Maa',
    tuesday: 'Din',
    wednesday: 'Woe',
    thursday: 'Don',
    friday: 'Vri',
    saturday: 'Zat',
    libraryTitle: 'Bibliotheek',
    browsePastEntries: 'Blader door je eerdere dagboekvermeldingen en opgeslagen mediacontent',
    journalEntries: 'Dagboekvermeldingen',
    savedMedia: 'Opgeslagen Media',
    noJournalEntries: 'Nog geen dagboekvermeldingen',
    noSavedMedia: 'Nog geen opgeslagen media',
    openLink: 'Link Openen',
    loading: 'Laden...',
    error: 'Fout',
    back: 'Terug',
    next: 'Volgende',
    profile: 'Profiel',
    profileTitle: 'Profielinstellingen',
    profileDescription: 'Beheer je accountinstellingen en voorkeuren',
    settings: 'Instellingen',
    settingsTitle: 'Instellingen',
    settingsDescription: 'Beheer je accountinstellingen en voorkeuren',
    edit: 'Bewerken',
    username: 'Gebruikersnaam',
    changeUsername: 'Gebruikersnaam Wijzigen',
    usernamePlaceholder: 'Voer een nieuwe gebruikersnaam in',
    usernameAvailable: 'Gebruikersnaam is beschikbaar',
    usernameUnavailable: 'Gebruikersnaam is al in gebruik',
    usernameChecking: 'Beschikbaarheid controleren...',
    saveUsername: 'Gebruikersnaam Opslaan',
    savingUsername: 'Opslaan...',
    membershipStatus: 'Lidmaatschapsstatus',
    membershipBasic: 'Basis',
    membershipUpgrade: 'Upgraden',
    membershipUpgradeDisabled: 'Upgraden (Binnenkort)',
    uiLanguage: 'Interface Taal',
    changeUILanguage: 'Interface Taal Wijzigen',
    targetLanguages: 'Doeltalen',
    languagesLearning: 'Talen die Je Leert',
    resetAll: 'Alles Resetten',
    resetAllDescription: 'Dit verwijdert al je voortgang, logs en instellingen. Je moet de registratie opnieuw voltooien.',
    resetAllConfirm: 'Weet je zeker dat je al je gegevens wilt resetten? Deze actie kan niet ongedaan worden gemaakt.',
    resetAllWarning: 'Dit verwijdert permanent al je gegevens.',
    resetAllButton: 'Alles Resetten',
    cancel: 'Annuleren',
    restartAccount: 'Account Herstarten',
    restartAccountDescription: 'Dit verwijdert al je dagelijkse logs en reset je reeksen. Je profielinstellingen blijven ongewijzigd.',
    restartAccountConfirm: 'Weet je zeker dat je je account wilt herstarten? Dit verwijdert al je voortgang en kan niet ongedaan worden gemaakt.',
    restartAccountWarning: 'Dit verwijdert permanent al je dagelijkse logs en reset je reeksen.',
    restartAccountButton: 'Account Herstarten',
    confirm: 'Bevestigen',
    info: 'Informatie',
    keepLanguages: 'Huidige Talen Behouden',
    changeLanguages: 'Talen Wijzigen',
    languageChangeTitle: 'Interface Taal Wijzigen',
    languageChangeDescription: 'Wil je je huidige doeltalen behouden of wijzigen?',
  },
  Danish: {
    dashboard: 'Dashboard',
    history: 'Historik',
    progress: 'Fremskridt',
    library: 'Bibliotek',
    signOut: 'Log ud',
    dashboardTitle: 'Dashboard',
    currentStreak: 'Nuværende Række',
    longestStreak: 'Længste Række',
    totalCompleted: 'Samlet Fuldført',
    days: 'dage',
    todaysChecklist: 'Dagens Checkliste',
    complete: 'Fuldført',
    save: 'Gem',
    saving: 'Gemmer...',
    allTasksCompleted: 'Alle opgaver fuldført!',
    greatWork: 'Godt klaret!',
    historyTitle: 'Historik',
    viewDailyCompletion: 'Se din daglige fuldførelseshistorik og spoor din fremskridt',
    recentLogs: 'Seneste Logs',
    noLogsYet: 'Ingen logs endnu. Begynd at spore din daglige fremskridt!',
    startTracking: 'Begynd at spore din daglige fremskridt!',
    progressTitle: 'Fremskridt',
    trackLanguageLearning: 'Spor din sprog læringsrejse og fuldførelsesstatistikker',
    habitCompletionRates: 'Vane Fuldførelsesrater',
    consecutiveDays: 'fortløbende dage',
    bestStreak: 'bedste række',
    daysCompleted: 'dage fuldført',
    startWritingJournal: 'Begynd at skrive dagbogsindlæg på dit målsprog for at se dem her.',
    logPodcastsVideos: 'Log podcasts, videoer eller episoder du har set for at se dem her.',
    habit60MinutesStudy: '60 Minutters Studie',
    habit5PagesReading: '5 Sider Læsning',
    habit5MinutesSpeaking: '5 Minutters Tale',
    habitMediaConsumption: 'Medieforbrug',
    habitJournalEntry: 'Dagbogsindlæg',
    habitImmersion: 'Fordybelse',
    habitStudyLog: 'Studielog',
    studyMinutes: 'Studieminutter',
    readingPages: 'Læsesider',
    minutesOfSpeaking: '5 Minutters Tale',
    podcastVideoEpisode: 'Podcast / Video / Episode',
    journalEntry: 'Dagbogsindlæg',
    immersion: 'Fordybelse',
    trackYourStudy: 'Spor Din Studie',
    done: 'Færdig',
    goalReached: '✓ Mål nået!',
    min: 'min',
    pages: 'sider',
    journalPlaceholder: 'Skriv dit daglige dagbogsindlæg på dit målsprog...',
    journalHint: 'Skriv mindst et par sætninger på dit målsprog',
    immersionPlaceholder: 'Hvad gjorde du for at fordybe dig? (valgfrit)',
    studyLogPlaceholder: 'Hvad studerede du? Hvilke ressourcer brugte du? Nogen noter?',
    studyLogHint: 'Log dine studiesessionsdetaljer og ressourcer',
    mediaTitlePlaceholder: 'Titel (f.eks., \'Dansk Podcast Episode 5\')',
    mediaUrlPlaceholder: 'URL (valgfrit)',
    selectLanguage: 'Vælg Sprog',
    trackForLanguage: 'Spor dine aktiviteter for dette sprog',
    allLanguages: 'Alle Sprog',
    partial: 'Delvist',
    none: 'Ingen',
    streakView30Days: '30-Dages Rækkevisning',
    yourContent: 'Dit Indhold',
    searchPlaceholder: 'Søg indlæg...',
    sunday: 'Søn',
    monday: 'Man',
    tuesday: 'Tir',
    wednesday: 'Ons',
    thursday: 'Tor',
    friday: 'Fre',
    saturday: 'Lør',
    libraryTitle: 'Bibliotek',
    browsePastEntries: 'Gennemse dine tidligere dagbogsindlæg og gemt mediainhold',
    journalEntries: 'Dagbogsindlæg',
    savedMedia: 'Gemt Media',
    noJournalEntries: 'Ingen dagbogsindlæg endnu',
    noSavedMedia: 'Ingen gemt media endnu',
    openLink: 'Åbn Link',
    loading: 'Indlæser...',
    error: 'Fejl',
    back: 'Tilbage',
    next: 'Næste',
    profile: 'Profil',
    profileTitle: 'Profilindstillinger',
    profileDescription: 'Administrer dine kontoindstillinger og præferencer',
    settings: 'Indstillinger',
    settingsTitle: 'Indstillinger',
    settingsDescription: 'Administrer dine kontoindstillinger og præferencer',
    edit: 'Rediger',
    username: 'Brugernavn',
    changeUsername: 'Skift Brugernavn',
    usernamePlaceholder: 'Indtast et nyt brugernavn',
    usernameAvailable: 'Brugernavn er tilgængeligt',
    usernameUnavailable: 'Brugernavn er allerede i brug',
    usernameChecking: 'Tjekker tilgængelighed...',
    saveUsername: 'Gem Brugernavn',
    savingUsername: 'Gemmer...',
    membershipStatus: 'Medlemskabsstatus',
    membershipBasic: 'Basis',
    membershipUpgrade: 'Opgrader',
    membershipUpgradeDisabled: 'Opgrader (Kommer snart)',
    uiLanguage: 'Interface Sprog',
    changeUILanguage: 'Skift Interface Sprog',
    targetLanguages: 'Målsprog',
    languagesLearning: 'Sprog Du Lærer',
    resetAll: 'Nulstil Alt',
    resetAllDescription: 'Dette fjerner al din fremskridt, logs og indstillinger. Du skal gennemføre registreringen igen.',
    resetAllConfirm: 'Er du sikker på, at du vil nulstille alle dine data? Denne handling kan ikke fortrydes.',
    resetAllWarning: 'Dette fjerner permanent alle dine data.',
    resetAllButton: 'Nulstil Alt',
    cancel: 'Annuller',
    restartAccount: 'Genstart Konto',
    restartAccountDescription: 'Dette fjerner alle dine daglige logs og nulstiller dine rækker. Dine profilindstillinger forbliver uændrede.',
    restartAccountConfirm: 'Er du sikker på, at du vil genstarte din konto? Dette fjerner al din fremskridt og kan ikke fortrydes.',
    restartAccountWarning: 'Dette fjerner permanent alle dine daglige logs og nulstiller dine rækker.',
    restartAccountButton: 'Genstart Konto',
    confirm: 'Bekræft',
    info: 'Information',
    keepLanguages: 'Behold Nuværende Sprog',
    changeLanguages: 'Skift Sprog',
    languageChangeTitle: 'Skift Interface Sprog',
    languageChangeDescription: 'Vil du beholde dine nuværende målsprog eller ændre dem?',
  },
  Italian: {
    dashboard: 'Dashboard',
    history: 'Cronologia',
    progress: 'Progresso',
    library: 'Biblioteca',
    signOut: 'Esci',
    dashboardTitle: 'Dashboard',
    currentStreak: 'Serie Attuale',
    longestStreak: 'Serie Più Lunga',
    totalCompleted: 'Totale Completato',
    days: 'giorni',
    todaysChecklist: 'Checklist di Oggi',
    complete: 'Completo',
    save: 'Salva',
    saving: 'Salvataggio...',
    allTasksCompleted: 'Tutte le attività completate!',
    greatWork: 'Ottimo lavoro!',
    historyTitle: 'Cronologia',
    viewDailyCompletion: 'Visualizza la tua cronologia di completamento giornaliero e traccia i tuoi progressi',
    recentLogs: 'Log Recenti',
    noLogsYet: 'Nessun log ancora. Inizia a tracciare i tuoi progressi giornalieri!',
    startTracking: 'Inizia a tracciare i tuoi progressi giornalieri!',
    progressTitle: 'Progresso',
    trackLanguageLearning: 'Traccia il tuo percorso di apprendimento linguistico e le statistiche di completamento',
    habitCompletionRates: 'Tassi di Completamento delle Abitudini',
    consecutiveDays: 'giorni consecutivi',
    bestStreak: 'migliore serie',
    daysCompleted: 'giorni completati',
    startWritingJournal: 'Inizia a scrivere voci del diario nella tua lingua obiettivo per vederle qui.',
    logPodcastsVideos: 'Registra podcast, video o episodi che hai guardato per vederli qui.',
    habit60MinutesStudy: '60 Minuti di Studio',
    habit5PagesReading: '5 Pagine di Lettura',
    habit5MinutesSpeaking: '5 Minuti di Conversazione',
    habitMediaConsumption: 'Consumo di Media',
    habitJournalEntry: 'Voce del Diario',
    habitImmersion: 'Immersione',
    habitStudyLog: 'Log di Studio',
    studyMinutes: 'Minuti di Studio',
    readingPages: 'Pagine di Lettura',
    minutesOfSpeaking: '5 Minuti di Conversazione',
    podcastVideoEpisode: 'Podcast / Video / Episodio',
    journalEntry: 'Voce del Diario',
    immersion: 'Immersione',
    trackYourStudy: 'Traccia il Tuo Studio',
    done: 'Fatto',
    goalReached: '✓ Obiettivo raggiunto!',
    min: 'min',
    pages: 'pagine',
    journalPlaceholder: 'Scrivi la tua voce del diario giornaliera nella tua lingua obiettivo...',
    journalHint: 'Scrivi almeno alcune frasi nella tua lingua obiettivo',
    immersionPlaceholder: 'Cosa hai fatto per immergerti? (opzionale)',
    studyLogPlaceholder: 'Cosa hai studiato? Quali risorse hai usato? Qualche nota?',
    studyLogHint: 'Registra i dettagli della tua sessione di studio e le risorse',
    mediaTitlePlaceholder: 'Titolo (es., \'Podcast Italiano Episodio 5\')',
    mediaUrlPlaceholder: 'URL (opzionale)',
    selectLanguage: 'Seleziona Lingua',
    trackForLanguage: 'Traccia le tue attività per questa lingua',
    allLanguages: 'Tutte le Lingue',
    partial: 'Parziale',
    none: 'Nessuno',
    streakView30Days: 'Visualizzazione Serie 30 Giorni',
    yourContent: 'Il Tuo Contenuto',
    searchPlaceholder: 'Cerca voci...',
    sunday: 'Dom',
    monday: 'Lun',
    tuesday: 'Mar',
    wednesday: 'Mer',
    thursday: 'Gio',
    friday: 'Ven',
    saturday: 'Sab',
    libraryTitle: 'Biblioteca',
    browsePastEntries: 'Sfoglia le tue voci del diario passate e il contenuto multimediale salvato',
    journalEntries: 'Voci del Diario',
    savedMedia: 'Media Salvati',
    noJournalEntries: 'Nessuna voce del diario ancora',
    noSavedMedia: 'Nessun media salvato ancora',
    openLink: 'Apri Link',
    loading: 'Caricamento...',
    error: 'Errore',
    back: 'Indietro',
    next: 'Avanti',
    profile: 'Profilo',
    profileTitle: 'Impostazioni del Profilo',
    profileDescription: 'Gestisci le impostazioni e le preferenze del tuo account',
    settings: 'Impostazioni',
    settingsTitle: 'Impostazioni',
    settingsDescription: 'Gestisci le impostazioni e le preferenze del tuo account',
    edit: 'Modifica',
    username: 'Nome Utente',
    changeUsername: 'Cambia Nome Utente',
    usernamePlaceholder: 'Inserisci un nuovo nome utente',
    usernameAvailable: 'Il nome utente è disponibile',
    usernameUnavailable: 'Il nome utente è già in uso',
    usernameChecking: 'Verifica disponibilità...',
    saveUsername: 'Salva Nome Utente',
    savingUsername: 'Salvataggio...',
    membershipStatus: 'Stato dell\'Abbonamento',
    membershipBasic: 'Base',
    membershipUpgrade: 'Aggiorna',
    membershipUpgradeDisabled: 'Aggiorna (Prossimamente)',
    uiLanguage: 'Lingua dell\'Interfaccia',
    changeUILanguage: 'Cambia Lingua dell\'Interfaccia',
    targetLanguages: 'Lingue Obiettivo',
    languagesLearning: 'Lingue che Stai Imparando',
    resetAll: 'Reimposta Tutto',
    resetAllDescription: 'Questo rimuoverà tutti i tuoi progressi, log e impostazioni. Dovrai completare nuovamente la registrazione.',
    resetAllConfirm: 'Sei sicuro di voler reimpostare tutti i tuoi dati? Questa azione non può essere annullata.',
    resetAllWarning: 'Questo rimuoverà permanentemente tutti i tuoi dati.',
    resetAllButton: 'Reimposta Tutto',
    cancel: 'Annulla',
    restartAccount: 'Riavvia Account',
    restartAccountDescription: 'Questo rimuoverà tutti i tuoi log giornalieri e reimposterà le tue serie. Le tue impostazioni del profilo rimarranno invariate.',
    restartAccountConfirm: 'Sei sicuro di voler riavviare il tuo account? Questo rimuoverà tutti i tuoi progressi e non può essere annullato.',
    restartAccountWarning: 'Questo rimuoverà permanentemente tutti i tuoi log giornalieri e reimposterà le tue serie.',
    restartAccountButton: 'Riavvia Account',
    confirm: 'Conferma',
    info: 'Informazioni',
    keepLanguages: 'Mantieni Lingue Attuali',
    changeLanguages: 'Cambia Lingue',
    languageChangeTitle: 'Cambia Lingua dell\'Interfaccia',
    languageChangeDescription: 'Vuoi mantenere le tue lingue obiettivo attuali o cambiarle?',
  },
}

export function getTranslations(language: Language | string = 'English'): Translations {
  // Handle existing users who may have other languages selected
  // Fall back to English if language is not supported (backward compatibility)
  // This ensures existing users with unsupported languages still see the app in English
  if (language === 'Spanish' || language === 'English' || language === 'Dutch' || language === 'Danish' || language === 'Italian') {
    return translations[language as Language]
  }
  // Default to English for any unsupported language
  // This is safe for existing users - they'll see English instead of errors
  return translations.English
}

export function t(key: keyof Translations, language: Language | string = 'English'): string {
  const trans = getTranslations(language)
  return trans[key] || key
}
