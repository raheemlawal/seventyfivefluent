import { useDailyLogs } from '@/hooks/useDailyLogs'
import { useProfile } from '@/hooks/useProfile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { HabitCompletion } from '@/types'
import { differenceInDays } from 'date-fns'
import { getTodayInTimezone } from '@/lib/date-utils'

export function HabitCompletionRates() {
  const { logs, loading } = useDailyLogs()
  const { profile, loading: profileLoading } = useProfile()

  if (loading || profileLoading || !profile) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
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
      habit: '60 Minutes Study',
      completed: logs.filter(log => log.study_minutes >= 60).length,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: '5 Pages Reading',
      completed: logs.filter(log => log.reading_pages >= 5).length,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: '5 Minutes Speaking',
      completed: logs.filter(log => log.speaking_done).length,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: 'Media Consumption',
      completed: logs.filter(log => log.media_done).length,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: 'Journal Entry',
      completed: logs.filter(log => log.journal_entry && log.journal_entry.trim() !== '').length,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: 'Immersion',
      completed: logs.filter(log => log.immersion_done).length,
      total: totalDays,
      percentage: 0,
    },
    {
      habit: 'Study Log',
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
        <CardTitle>Habit Completion Rates</CardTitle>
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

