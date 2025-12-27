import { useDailyLogs } from '@/hooks/useDailyLogs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { HabitCompletion } from '@/types'

export function HabitCompletionRates() {
  const { logs, loading } = useDailyLogs()

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
  }

  const habits: HabitCompletion[] = [
    {
      habit: '60 Minutes Study',
      completed: logs.filter(log => log.study_minutes >= 60).length,
      total: logs.length,
      percentage: 0,
    },
    {
      habit: '5 Pages Reading',
      completed: logs.filter(log => log.reading_pages >= 5).length,
      total: logs.length,
      percentage: 0,
    },
    {
      habit: '5 Minutes Speaking',
      completed: logs.filter(log => log.speaking_done).length,
      total: logs.length,
      percentage: 0,
    },
    {
      habit: 'Media Consumption',
      completed: logs.filter(log => log.media_done).length,
      total: logs.length,
      percentage: 0,
    },
    {
      habit: 'Journal Entry',
      completed: logs.filter(log => log.journal_entry && log.journal_entry.trim() !== '').length,
      total: logs.length,
      percentage: 0,
    },
    {
      habit: 'Immersion',
      completed: logs.filter(log => log.immersion_done).length,
      total: logs.length,
      percentage: 0,
    },
    {
      habit: 'Study Log',
      completed: logs.filter(log => log.study_log_note && log.study_log_note.trim() !== '').length,
      total: logs.length,
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

