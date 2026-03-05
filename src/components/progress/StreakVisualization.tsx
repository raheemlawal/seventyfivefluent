import { useDailyLogs } from '@/hooks/useDailyLogs'
import { useProfile } from '@/hooks/useProfile'
import { useTranslation } from '@/hooks/useTranslation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isDailyLogComplete, getCompletionPercentage } from '@/lib/daily-log-utils'
import { format, parseISO, eachDayOfInterval, subDays } from 'date-fns'
import { getTodayInTimezone, getLocale } from '@/lib/date-utils'

export function StreakVisualization() {
  const { profile } = useProfile()
  const { t, language: uiLanguage } = useTranslation()
  const today = profile ? getTodayInTimezone(profile.timezone) : ''
  const { logs, loading } = useDailyLogs()

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">{t.loading}</div>
  }

  // Show last 30 days
  const endDate = today ? parseISO(today) : new Date()
  const startDate = subDays(endDate, 29)
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const getLogForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    // For backward compatibility: if no language filter, show any log for that date
    // This allows old logs (without language) to still show
    // If multiple logs exist for a date, prefer the most complete one
    const dateLogs = logs.filter(log => log.log_date === dateStr)
    if (dateLogs.length === 0) return undefined
    // Return the most complete log, or the first one if all are equal
    return dateLogs.reduce((best, current) => {
      const bestComplete = isDailyLogComplete(best)
      const currentComplete = isDailyLogComplete(current)
      if (currentComplete && !bestComplete) return current
      if (bestComplete && !currentComplete) return best
      const bestPct = getCompletionPercentage(best)
      const currentPct = getCompletionPercentage(current)
      return currentPct > bestPct ? current : best
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.streakView30Days}</CardTitle>
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
                  title={(() => {
                    const formatted = format(day, 'MMM d, yyyy', { locale: getLocale(uiLanguage) })
                    return uiLanguage === 'Spanish' ? formatted.charAt(0).toUpperCase() + formatted.slice(1) : formatted
                  })()}
                />
              )
            })}
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-[#a8c090]" />
              <span>{t.complete}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-[#e8d4b8]" />
              <span>{t.partial}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-muted" />
              <span>{t.none}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

