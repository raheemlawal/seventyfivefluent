import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/date-utils'
import { useTranslation } from '@/hooks/useTranslation'
import type { DailyLog } from '@/types'
import { Video, ExternalLink } from 'lucide-react'

interface SavedMediaProps {
  logs: DailyLog[]
}

export function SavedMedia({ logs }: SavedMediaProps) {
  const { t } = useTranslation()
  
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">{t.noSavedMedia}</p>
        <p className="text-sm">{t.logPodcastsVideos}</p>
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
                {formatDate(log.log_date, 'EEEE, MMMM d, yyyy')}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Video className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-base md:text-lg mb-1 break-words">
                    {log.media_title}
                  </h3>
                  {log.media_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="mt-2"
                    >
                      <a
                        href={log.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {t.openLink}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
