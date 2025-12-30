import { useDailyLogs } from '@/hooks/useDailyLogs'
import { useProfile } from '@/hooks/useProfile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isDailyLogComplete } from '@/lib/daily-log-utils'
import { format, parseISO, eachDayOfInterval, subDays } from 'date-fns'
import { getTodayInTimezone } from '@/lib/date-utils'

export function StreakVisualization() {
  const { profile } = useProfile()
  const today = profile ? getTodayInTimezone(profile.timezone) : ''
  const { logs, loading } = useDailyLogs()

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
  }

  // Show last 30 days
  const endDate = today ? parseISO(today) : new Date()
  const startDate = subDays(endDate, 29)
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const getLogForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return logs.find(log => log.log_date === dateStr)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>30-Day Streak View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex gap-1">
            {days.map((day) => {
              const log = getLogForDate(day)
              const isComplete = log ? isDailyLogComplete(log) : false
              const dateStr = format(day, 'yyyy-MM-dd')
              const isToday = dateStr === today

              return (
                <div
                  key={dateStr}
                  className={`flex-1 aspect-square rounded ${
                    isComplete
                      ? 'bg-[#a8c090]'
                      : log
                      ? 'bg-[#e8d4b8]'
                      : 'bg-muted'
                  } ${isToday ? 'ring-2 ring-primary' : ''}`}
                  title={format(day, 'MMM d, yyyy')}
                />
              )
            })}
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-[#a8c090]" />
              <span>Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-[#e8d4b8]" />
              <span>Partial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-muted" />
              <span>None</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

