import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDate } from '@/lib/date-utils'
import { useTranslation } from '@/hooks/useTranslation'
import type { DailyLog } from '@/types'
import { BookOpen } from 'lucide-react'

interface JournalEntriesProps {
  logs: DailyLog[]
}

export function JournalEntries({ logs }: JournalEntriesProps) {
  const { t, language } = useTranslation()
  
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">{t.noJournalEntries}</p>
        <p className="text-sm">{t.startWritingJournal}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <Card key={log.id} className="hover:bg-accent/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">
                {formatDate(log.log_date, 'EEEE, MMMM d, yyyy', language)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
              {log.journal_entry}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
