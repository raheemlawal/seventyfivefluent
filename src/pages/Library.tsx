import { useState, useMemo } from 'react'
import { useDailyLogs } from '@/hooks/useDailyLogs'
import { useTranslation } from '@/hooks/useTranslation'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JournalEntries } from '@/components/library/JournalEntries'
import { SavedMedia } from '@/components/library/SavedMedia'
import { BookOpen, Video } from 'lucide-react'

export default function Library() {
  const { logs, loading } = useDailyLogs()
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'journals' | 'media'>('journals')

  // Filter logs with journal entries
  const journalLogs = useMemo(() => {
    return logs.filter(log => 
      log.journal_entry && 
      log.journal_entry.trim() !== '' &&
      (searchQuery === '' || 
       log.journal_entry.toLowerCase().includes(searchQuery.toLowerCase()) ||
       log.log_date.includes(searchQuery))
    ).sort((a, b) => 
      new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
    )
  }, [logs, searchQuery])

  // Filter logs with media
  const mediaLogs = useMemo(() => {
    return logs.filter(log => 
      log.media_done && 
      log.media_title &&
      log.media_title.trim() !== '' &&
      (searchQuery === '' || 
       log.media_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       log.log_date.includes(searchQuery))
    ).sort((a, b) => 
      new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
    )
  }, [logs, searchQuery])

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.libraryTitle}</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {t.browsePastEntries}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle>Your Content</CardTitle>
              <div className="w-full sm:w-auto sm:min-w-[300px]">
                <Label htmlFor="search" className="sr-only">Search</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'journals' | 'media')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="journals" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.journalEntries}</span>
                  <span className="sm:hidden">{t.journalEntries}</span>
                  {journalLogs.length > 0 && (
                    <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                      {journalLogs.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.savedMedia}</span>
                  <span className="sm:hidden">{t.savedMedia}</span>
                  {mediaLogs.length > 0 && (
                    <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                      {mediaLogs.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="journals" className="mt-4">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">{t.loading}</div>
                ) : (
                  <JournalEntries logs={journalLogs} />
                )}
              </TabsContent>
              <TabsContent value="media" className="mt-4">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">{t.loading}</div>
                ) : (
                  <SavedMedia logs={mediaLogs} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
