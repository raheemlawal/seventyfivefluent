import { useDailyLogs } from '@/hooks/useDailyLogs'
import { useProfile } from '@/hooks/useProfile'
import { useTranslation } from '@/hooks/useTranslation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { HabitCompletion } from '@/types'
import { differenceInDays } from 'date-fns'
import { getTodayInTimezone } from '@/lib/date-utils'

export function HabitCompletionRates() {
  const { logs, loading } = useDailyLogs()
  const { profile, loading: profileLoading } = useProfile()
  const { t } = useTranslation()

  if (loading || profileLoading || !profile) {
    return <div className="text-center py-8 text-muted-foreground">{t.loading}</div>
  }

  // Calculate total days from start_date to today
  if (!profile.start_date) {
    return <div className="text-center py-8 text-muted-foreground">No start date set</div>
  }
  
  const startDate = new Date(profile.start_date)
  const today = new Date(getTodayInTimezone(profile.timezone))
  
  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(today.getTime())) {
    return <div className="text-center py-8 text-muted-foreground">Invalid date configuration</div>
  }
  
  const totalDays = Math.max(1, differenceInDays(today, startDate) + 1) // +1 to include both start and end days

  // Group logs by date and aggregate across languages
  const logsByDate = new Map<string, typeof logs>()
  logs.forEach(log => {
    if (!logsByDate.has(log.log_date)) {
      logsByDate.set(log.log_date, [])
    }
    logsByDate.get(log.log_date)!.push(log)
  })

  // Calculate habit completions by aggregating across languages per day
  let studyMinutesCompleted = 0
  let readingPagesCompleted = 0
  let speakingCompleted = 0
  let mediaCompleted = 0
  let journalCompleted = 0
  let immersionCompleted = 0
  let studyLogCompleted = 0

  logsByDate.forEach((dateLogs) => {
    // Sum study minutes across all languages for this date
    const totalStudyMinutes = dateLogs.reduce((sum, log) => sum + (log.study_minutes || 0), 0)
    if (totalStudyMinutes >= 60) studyMinutesCompleted++

    // Sum reading pages across all languages for this date
    const totalReadingPages = dateLogs.reduce((sum, log) => sum + (log.reading_pages || 0), 0)
    if (totalReadingPages >= 5) readingPagesCompleted++

    // Check if ANY language has speaking done for this date
    if (dateLogs.some(log => log.speaking_done)) speakingCompleted++

    // Check if ANY language has media done for this date
    if (dateLogs.some(log => log.media_done)) mediaCompleted++

    // Check if ANY language has journal entry for this date
    if (dateLogs.some(log => log.journal_entry && log.journal_entry.trim() !== '')) journalCompleted++

    // Check if ANY language has immersion done for this date
    if (dateLogs.some(log => log.immersion_done)) immersionCompleted++

    // Check if ANY language has study log for this date
    if (dateLogs.some(log => log.study_log_note && log.study_log_note.trim() !== '')) studyLogCompleted++
  })

  const habits: HabitCompletion[] = [
    {
      habit: t.habit60MinutesStudy,
      completed: studyMinutesCompleted,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: t.habit5PagesReading,
      completed: readingPagesCompleted,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: t.habit5MinutesSpeaking,
      completed: speakingCompleted,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: t.habitMediaConsumption,
      completed: mediaCompleted,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: t.habitJournalEntry,
      completed: journalCompleted,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: t.habitImmersion,
      completed: immersionCompleted,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: t.habitStudyLog,
      completed: studyLogCompleted,
      total: totalDays,
      percentage: 0,
    },
  ]

  habits.forEach(habit => {
    habit.percentage = habit.total > 0 ? Math.round((habit.completed / habit.total) * 100) : 0
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.habitCompletionRates}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {habits.map((habit) => (
          <div key={habit.habit} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{habit.habit}</span>
              <span className="text-muted-foreground">
                {habit.completed} / {habit.total} ({habit.percentage}%)
              </span>
            </div>
            <Progress value={habit.percentage} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

