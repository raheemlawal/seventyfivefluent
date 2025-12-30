import { useDailyLogs } from '@/hooks/useDailyLogs'
import { AppLayout } from '@/components/layout/AppLayout'
import { CalendarView } from '@/components/history/CalendarView'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isDailyLogComplete, getCompletionPercentage } from '@/lib/daily-log-utils'
import { formatDate } from '@/lib/date-utils'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function History() {
  const { logs, loading } = useDailyLogs()

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      </AppLayout>
    )
  }

  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
  )

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">History</h1>
          <p className="text-muted-foreground">
            View your daily completion history and track your progress
          </p>
        </div>

        <CalendarView />

        <Card>
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No logs yet. Start tracking your daily progress!
              </div>
            ) : (
              <div className="space-y-2">
                {sortedLogs.slice(0, 30).map((log) => {
                  const isComplete = isDailyLogComplete(log)
                  const percentage = getCompletionPercentage(log)
                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        {isComplete ? (
                          <CheckCircle2 className="h-5 w-5 text-[#2d5016]" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-medium">{formatDate(log.log_date)}</div>
                          <div className="text-sm text-muted-foreground">
                            {log.study_minutes} min study • {log.reading_pages} pages
                          </div>
                        </div>
                      </div>
                      <Badge variant={isComplete ? "default" : "secondary"}>
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

