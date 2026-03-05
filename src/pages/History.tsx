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
  const { t } = useTranslation()

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-8 text-muted-foreground">{t.loading}</div>
      </AppLayout>
    )
  }

  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
  )

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
            {sortedLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t.noLogsYet}
              </div>
            ) : (
              <div className="space-y-2">
                {sortedLogs.slice(0, 30).map((log) => {
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
                          <div className="font-medium truncate">{formatDate(log.log_date)}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
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
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

