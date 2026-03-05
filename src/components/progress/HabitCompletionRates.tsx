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

  const habits: HabitCompletion[] = [
    {
      habit: t.habit60MinutesStudy,
      completed: logs.filter(log => log.study_minutes >= 60).length,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: t.habit5PagesReading,
      completed: logs.filter(log => log.reading_pages >= 5).length,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: t.habit5MinutesSpeaking,
      completed: logs.filter(log => log.speaking_done).length,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: t.habitMediaConsumption,
      completed: logs.filter(log => log.media_done).length,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: t.habitJournalEntry,
      completed: logs.filter(log => log.journal_entry && log.journal_entry.trim() !== '').length,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: t.habitImmersion,
      completed: logs.filter(log => log.immersion_done).length,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: t.habitStudyLog,
      completed: logs.filter(log => log.study_log_note && log.study_log_note.trim() !== '').length,
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

