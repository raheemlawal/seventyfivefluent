import { useMemo } from 'react'
import { useDailyLogs } from '@/hooks/useDailyLogs'
import { useTranslation } from '@/hooks/useTranslation'
import { AppLayout } from '@/components/layout/AppLayout'
import { CalendarView } from '@/components/history/CalendarView'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isDailyLogComplete, getCompletionPercentage } from '@/lib/daily-log-utils'
import { formatDate } from '@/lib/date-utils'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function History() {
  const { logs, loading } = useDailyLogs()
  const { t, language } = useTranslation()

  // Group logs by date and language
  // IMPORTANT: All hooks (including useMemo) must be called before any conditional returns
  const groupedLogs = useMemo(() => {
    const grouped = new Map<string, typeof logs>()
    logs.forEach(log => {
      const key = log.log_date
      if (!grouped.has(key)) {
        grouped.set(key, [])
      }
      grouped.get(key)!.push(log)
    })
    return Array.from(grouped.entries())
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
  }, [logs])

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-8 text-muted-foreground">{t.loading}</div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.historyTitle}</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {t.viewDailyCompletion}
          </p>
        </div>


        <CalendarView />

        <Card>
          <CardHeader>
            <CardTitle>{t.recentLogs}</CardTitle>
          </CardHeader>
          <CardContent>
            {groupedLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t.noLogsYet}
              </div>
            ) : (
              <div className="space-y-3">
                {groupedLogs.slice(0, 30).map(([date, dateLogs]) => (
                  <div key={date} className="space-y-2">
                    <div className="font-medium text-sm text-muted-foreground">
                      {formatDate(date, 'MMM d, yyyy', language)}
                    </div>
                    {dateLogs.map((log) => {
                      const isComplete = isDailyLogComplete(log)
                      const percentage = getCompletionPercentage(log)
                      return (
                        <div
                          key={log.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-3 border rounded-md hover:bg-accent"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {isComplete ? (
                              <CheckCircle2 className="h-5 w-5 text-[#2d5016] flex-shrink-0" />
                            ) : (
                              <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="font-medium flex items-center gap-2">
                                {log.language && (
                                  <Badge variant="outline" className="text-xs">
                                    {log.language}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                                {log.study_minutes} min study • {log.reading_pages} pages
                              </div>
                            </div>
                          </div>
                          <Badge variant={isComplete ? "default" : "secondary"} className="flex-shrink-0">
                            {percentage}%
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

