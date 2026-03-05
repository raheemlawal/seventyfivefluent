import { useState, useEffect, useMemo, useCallback } from 'react'
import { useDailyLog } from '@/hooks/useDailyLog'
import { useProfile } from '@/hooks/useProfile'
import { useTranslation } from '@/hooks/useTranslation'
import { StudyMinutesInput } from './StudyMinutesInput'
import { ReadingPagesInput } from './ReadingPagesInput'
import { SpeakingTimer } from './SpeakingTimer'
import { MediaLog } from './MediaLog'
import { JournalInput } from './JournalInput'
import { ImmersionToggle } from './ImmersionToggle'
import { StudyLogInput } from './StudyLogInput'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getCompletionPercentage, isDailyLogComplete } from '@/lib/daily-log-utils'
import { CheckCircle2, Save } from 'lucide-react'

export function DailyChecklist() {
  const { profile } = useProfile()
  const { log, loading, saveLog, saving } = useDailyLog()
  const { t } = useTranslation()

  // Local state for form values
  const [formData, setFormData] = useState({
    study_minutes: 0,
    reading_pages: 0,
    speaking_done: false,
    media_done: false,
    media_title: '',
    media_url: '',
    journal_entry: '',
    immersion_done: false,
    immersion_note: '',
    study_log_note: '',
  })

  // Initialize form data from log when it loads
  useEffect(() => {
    if (log) {
      setFormData({
        study_minutes: log.study_minutes || 0,
        reading_pages: log.reading_pages || 0,
        speaking_done: log.speaking_done || false,
        media_done: log.media_done || false,
        media_title: log.media_title || '',
        media_url: log.media_url || '',
        journal_entry: log.journal_entry || '',
        immersion_done: log.immersion_done || false,
        immersion_note: log.immersion_note || '',
        study_log_note: log.study_log_note || '',
      })
    }
  }, [log])

  // Calculate completion from form data (memoized)
  // IMPORTANT: All hooks must be called before any conditional returns
  const currentLog = useMemo(() => ({
    ...log,
    ...formData,
    study_minutes: formData.study_minutes,
    reading_pages: formData.reading_pages,
    speaking_done: formData.speaking_done,
    media_done: formData.media_done,
    media_title: formData.media_title || null,
    media_url: formData.media_url || null,
    journal_entry: formData.journal_entry || null,
    immersion_done: formData.immersion_done,
    immersion_note: formData.immersion_note || null,
    study_log_note: formData.study_log_note || null,
  }), [log, formData])

  const completionPercentage = useMemo(() => getCompletionPercentage(currentLog), [currentLog])
  const isComplete = useMemo(() => isDailyLogComplete(currentLog), [currentLog])

  const handleSave = useCallback(async () => {
    try {
      await saveLog({
        study_minutes: formData.study_minutes,
        reading_pages: formData.reading_pages,
        speaking_done: formData.speaking_done,
        media_done: formData.media_done,
        media_title: formData.media_title || null,
        media_url: formData.media_url || null,
        journal_entry: formData.journal_entry || null,
        immersion_done: formData.immersion_done,
        immersion_note: formData.immersion_note || null,
        study_log_note: formData.study_log_note || null,
      })
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }, [formData, saveLog])

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t.todaysChecklist}</CardTitle>
            <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
              {completionPercentage}% {t.complete}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <StudyMinutesInput
              value={formData.study_minutes}
              onChange={(value) => setFormData(prev => ({ ...prev, study_minutes: value }))}
            />
            <ReadingPagesInput
              value={formData.reading_pages}
              onChange={(value) => setFormData(prev => ({ ...prev, reading_pages: value }))}
            />
            <SpeakingTimer
              done={formData.speaking_done}
              onDoneChange={(done) => setFormData(prev => ({ ...prev, speaking_done: done }))}
            />
            <MediaLog
              done={formData.media_done}
              title={formData.media_title}
              url={formData.media_url}
              onDoneChange={(done) => setFormData(prev => ({ ...prev, media_done: done }))}
              onTitleChange={(title) => setFormData(prev => ({ ...prev, media_title: title }))}
              onUrlChange={(url) => setFormData(prev => ({ ...prev, media_url: url }))}
            />
            <JournalInput
              value={formData.journal_entry}
              onChange={(value) => setFormData(prev => ({ ...prev, journal_entry: value }))}
              targetLanguages={profile?.target_languages || []}
            />
            <ImmersionToggle
              done={formData.immersion_done}
              note={formData.immersion_note}
              onDoneChange={(done) => setFormData(prev => ({ ...prev, immersion_done: done }))}
              onNoteChange={(note) => setFormData(prev => ({ ...prev, immersion_note: note }))}
            />
            <div className="md:col-span-2">
              <StudyLogInput
                value={formData.study_log_note}
                onChange={(value) => setFormData(prev => ({ ...prev, study_log_note: value }))}
              />
            </div>
          </div>
          {isComplete && (
            <div className="mt-4 p-4 bg-[#f0f5ed] rounded-md flex items-center gap-2 border border-[#331011]/10">
              <CheckCircle2 className="h-5 w-5 text-[#2d5016]" />
              <span className="text-[#2d5016] font-medium">
                {t.allTasksCompleted} {t.greatWork}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <>{t.saving}</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t.save}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

