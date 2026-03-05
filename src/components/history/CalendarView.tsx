import { useDailyLogs } from '@/hooks/useDailyLogs'
import { useProfile } from '@/hooks/useProfile'
import { isDailyLogComplete, getCompletionPercentage } from '@/lib/daily-log-utils'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns'
import { getTodayInTimezone } from '@/lib/date-utils'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, XCircle, Circle } from 'lucide-react'

export function CalendarView() {
  const { profile } = useProfile()
  const today = profile ? getTodayInTimezone(profile.timezone) : ''
  const currentMonth = new Date()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get logs for the current month
  const startDate = format(monthStart, 'yyyy-MM-dd')
  const endDate = format(monthEnd, 'yyyy-MM-dd')
  const { logs, loading } = useDailyLogs(startDate, endDate)

  const getLogForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return logs.find(log => log.log_date === dateStr)
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
            <h3 className="text-base sm:text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-[#a8c090]" />
                <span>Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-[#e8d4b8]" />
                <span>Partial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-muted" />
                <span>None</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {days.map(day => {
              const log = getLogForDate(day)
              const isComplete = log ? isDailyLogComplete(log) : false
              const percentage = log ? getCompletionPercentage(log) : 0
              const isCurrentDay = today && format(day, 'yyyy-MM-dd') === today
              const isCurrentMonth = isSameMonth(day, currentMonth)

              let bgColor = 'bg-muted'
              if (log) {
                if (isComplete) {
                  bgColor = 'bg-[#a8c090]'
                } else if (percentage > 0) {
                  bgColor = 'bg-[#e8d4b8]'
                }
              }

              return (
                <div
                  key={day.toISOString()}
                  className={`aspect-square p-1 ${!isCurrentMonth ? 'opacity-30' : ''}`}
                >
                  <div
                    className={`h-full rounded flex flex-col items-center justify-center text-xs ${
                      bgColor
                    } ${isCurrentDay ? 'ring-2 ring-primary' : ''}`}
                  >
                    <span className={isComplete ? 'text-white font-bold' : 'text-foreground'}>
                      {format(day, 'd')}
                    </span>
                    {log && (
                      <div className="mt-1">
                        {isComplete ? (
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        ) : percentage > 0 ? (
                          <Circle className="h-3 w-3 text-white" />
                        ) : (
                          <XCircle className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

