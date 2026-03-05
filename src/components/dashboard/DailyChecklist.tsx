import { useState, useEffect, useMemo, useCallback } from 'react'
import { useDailyLogs } from '@/hooks/useDailyLogs'
import { useProfile } from '@/hooks/useProfile'
import { useTranslation } from '@/hooks/useTranslation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { getTodayInTimezone } from '@/lib/date-utils'
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
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { getCompletionPercentage, isDailyLogComplete } from '@/lib/daily-log-utils'
import { CheckCircle2, Save } from 'lucide-react'
import type { DailyLog, DailyLogInsert, DailyLogUpdate } from '@/types'

export function DailyChecklist() {
  const { profile } = useProfile()
  const { user } = useAuth()
  const { t } = useTranslation()
  const today = profile ? getTodayInTimezone(profile.timezone) : ''
  
  // Fetch all logs for today (all languages)
  const { logs: todayLogs, loading } = useDailyLogs(today, today)
  
  const hasMultipleLanguages = profile?.target_languages && profile.target_languages.length > 1
  const targetLanguages = profile?.target_languages || []
  
  // Get or create log for a specific language
  const getLogForLanguage = useCallback((language: string | null) => {
    if (!language) {
      // For backward compatibility, return log with null language
      return todayLogs.find(log => !log.language) || null
    }
    return todayLogs.find(log => log.language === language) || null
  }, [todayLogs])

  const [saving, setSaving] = useState(false)
  
  // State for each activity with language selection
  const [activities, setActivities] = useState<{
    study_minutes: { value: number; language: string | null }
    reading_pages: { value: number; language: string | null }
    speaking_done: { value: boolean; language: string | null }
    media: { done: boolean; title: string; url: string; language: string | null }
    journal: { value: string; language: string | null }
    immersion: { done: boolean; note: string; language: string | null }
    study_log: { value: string; language: string | null }
  }>({
    study_minutes: { value: 0, language: targetLanguages[0] || null },
    reading_pages: { value: 0, language: targetLanguages[0] || null },
    speaking_done: { value: false, language: targetLanguages[0] || null },
    media: { done: false, title: '', url: '', language: targetLanguages[0] || null },
    journal: { value: '', language: targetLanguages[0] || null },
    immersion: { done: false, note: '', language: targetLanguages[0] || null },
    study_log: { value: '', language: targetLanguages[0] || null },
  })

  // Initialize activities from logs when they load
  useEffect(() => {
    if (todayLogs.length > 0) {
      // Initialize from existing logs
      const firstLog = todayLogs[0]
      setActivities(prev => ({
        study_minutes: { 
          value: firstLog.study_minutes || 0, 
          language: firstLog.language || targetLanguages[0] || null 
        },
        reading_pages: { 
          value: firstLog.reading_pages || 0, 
          language: firstLog.language || targetLanguages[0] || null 
        },
        speaking_done: { 
          value: firstLog.speaking_done || false, 
          language: firstLog.language || targetLanguages[0] || null 
        },
        media: { 
          done: firstLog.media_done || false, 
          title: firstLog.media_title || '', 
          url: firstLog.media_url || '', 
          language: firstLog.language || targetLanguages[0] || null 
        },
        journal: { 
          value: firstLog.journal_entry || '', 
          language: firstLog.language || targetLanguages[0] || null 
        },
        immersion: { 
          done: firstLog.immersion_done || false, 
          note: firstLog.immersion_note || '', 
          language: firstLog.language || targetLanguages[0] || null 
        },
        study_log: { 
          value: firstLog.study_log_note || '', 
          language: firstLog.language || targetLanguages[0] || null 
        },
      }))
    }
  }, [todayLogs, targetLanguages])

  // Save activity to a specific language's log
  const saveActivity = useCallback(async (
    activityType: keyof typeof activities,
    updates: Partial<DailyLogUpdate>
  ) => {
    if (!user || !today) return

    const activity = activities[activityType]
    const language = activity.language
    const existingLog = getLogForLanguage(language)

    try {
      if (existingLog) {
        // Update existing log
        await supabase
          .from('daily_logs')
          .update(updates)
          .eq('id', existingLog.id)
      } else {
        // Create new log for this language
        const newLog: DailyLogInsert = {
          user_id: user.id,
          log_date: today,
          language: language || null,
          ...updates,
        }
        await supabase
          .from('daily_logs')
          .insert(newLog)
      }
    } catch (error) {
      console.error(`Failed to save ${activityType}:`, error)
      throw error
    }
  }, [user, today, activities, getLogForLanguage])

  // Save all activities
  const handleSave = useCallback(async () => {
    if (!user || !today || saving) return

    setSaving(true)
    try {
      // Group activities by language and merge them into complete log entries
      const logsByLanguage = new Map<string | null, Partial<DailyLogUpdate>>()

      // First, load existing data for each language to preserve fields not being updated
      todayLogs.forEach(log => {
        logsByLanguage.set(log.language, {
          study_minutes: log.study_minutes || 0,
          reading_pages: log.reading_pages || 0,
          speaking_done: log.speaking_done || false,
          media_done: log.media_done || false,
          media_title: log.media_title || null,
          media_url: log.media_url || null,
          journal_entry: log.journal_entry || null,
          immersion_done: log.immersion_done || false,
          immersion_note: log.immersion_note || null,
          study_log_note: log.study_log_note || null,
        })
      })

      // Update with current activity values
      Object.entries(activities).forEach(([key, activity]) => {
        const language = activity.language
        if (!logsByLanguage.has(language)) {
          logsByLanguage.set(language, {})
        }
        const log = logsByLanguage.get(language)!

        switch (key) {
          case 'study_minutes':
            log.study_minutes = activity.value
            break
          case 'reading_pages':
            log.reading_pages = activity.value
            break
          case 'speaking_done':
            log.speaking_done = activity.value
            break
          case 'media':
            log.media_done = activity.done
            log.media_title = activity.title || null
            log.media_url = activity.url || null
            break
          case 'journal':
            log.journal_entry = activity.value || null
            break
          case 'immersion':
            log.immersion_done = activity.done
            log.immersion_note = activity.note || null
            break
          case 'study_log':
            log.study_log_note = activity.value || null
            break
        }
      })

      // Save each language's log using upsert pattern to handle conflicts
      for (const [language, updates] of logsByLanguage.entries()) {
        const languageValue = language || null
        
        // Build query to find existing log - handle null language correctly
        let query = supabase
          .from('daily_logs')
          .select('id')
          .eq('user_id', user.id)
          .eq('log_date', today)
        
        if (languageValue === null) {
          query = query.is('language', null)
        } else {
          query = query.eq('language', languageValue)
        }
        
        const { data: existingLog } = await query.maybeSingle()
        
        if (existingLog) {
          // Update existing log
          const { error } = await supabase
            .from('daily_logs')
            .update(updates)
            .eq('id', existingLog.id)
          
          if (error) {
            console.error('Error updating log:', error)
            throw error
          }
        } else {
          // Try to insert new log
          const newLog: DailyLogInsert = {
            user_id: user.id,
            log_date: today,
            language: languageValue,
            ...updates,
          }
          
          const { error, data } = await supabase
            .from('daily_logs')
            .insert(newLog)
            .select()
          
          // If we get a conflict (unique constraint violation), update instead
          if (error) {
            if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique constraint')) {
              // Log was created between our check and insert, find and update it
              let conflictQuery = supabase
                .from('daily_logs')
                .select('id')
                .eq('user_id', user.id)
                .eq('log_date', today)
              
              if (languageValue === null) {
                conflictQuery = conflictQuery.is('language', null)
              } else {
                conflictQuery = conflictQuery.eq('language', languageValue)
              }
              
              const { data: conflictLog, error: conflictError } = await conflictQuery.maybeSingle()
              
              if (conflictLog) {
                const { error: updateError } = await supabase
                  .from('daily_logs')
                  .update(updates)
                  .eq('id', conflictLog.id)
                
                if (updateError) {
                  console.error('Error updating conflict log:', updateError)
                  throw updateError
                }
              } else {
                console.error('Conflict detected but log not found:', conflictError)
                throw error
              }
            } else {
              console.error('Error inserting log:', error)
              throw error
            }
          }
        }
      }

      // Success - the logs will be refetched automatically by useDailyLogs
      // Force a page refresh to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }, [user, today, activities, getLogForLanguage, todayLogs, saving])

  // Calculate overall completion by aggregating across all languages for today
  const overallCompletion = useMemo(() => {
    if (todayLogs.length === 0) return 0

    // Aggregate activities across all languages
    const aggregated = {
      study_minutes: todayLogs.reduce((sum, log) => sum + (log.study_minutes || 0), 0),
      reading_pages: todayLogs.reduce((sum, log) => sum + (log.reading_pages || 0), 0),
      speaking_done: todayLogs.some(log => log.speaking_done),
      media_done: todayLogs.some(log => log.media_done),
      journal_entry: todayLogs.some(log => log.journal_entry && log.journal_entry.trim() !== '') ? 'done' : null,
      immersion_done: todayLogs.some(log => log.immersion_done),
      study_log_note: todayLogs.some(log => log.study_log_note && log.study_log_note.trim() !== '') ? 'done' : null,
    }

    // Calculate completion percentage
    let completed = 0
    const total = 7

    if (aggregated.study_minutes >= 60) completed++
    if (aggregated.reading_pages >= 5) completed++
    if (aggregated.speaking_done) completed++
    if (aggregated.media_done) completed++
    if (aggregated.immersion_done) completed++
    if (aggregated.journal_entry) completed++
    if (aggregated.study_log_note) completed++

    return Math.round((completed / total) * 100)
  }, [todayLogs])

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t.todaysChecklist}</CardTitle>
            <Badge variant={overallCompletion === 100 ? "default" : "secondary"}>
              {overallCompletion}% {t.complete}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Study Minutes */}
            <div className="space-y-2">
              {hasMultipleLanguages && (
                <Label htmlFor="study-minutes-lang" className="text-xs text-muted-foreground">
                  {t.selectLanguage || 'Language'}
                </Label>
              )}
              {hasMultipleLanguages && (
                <Select
                  id="study-minutes-lang"
                  value={activities.study_minutes.language || ''}
                  onChange={(e) => {
                    const lang = e.target.value || null
                    const log = getLogForLanguage(lang)
                    setActivities(prev => ({
                      ...prev,
                      study_minutes: {
                        value: log?.study_minutes || 0,
                        language: lang,
                      },
                    }))
                  }}
                >
                  {targetLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </Select>
              )}
              <StudyMinutesInput
                value={activities.study_minutes.value}
                onChange={(value) => setActivities(prev => ({
                  ...prev,
                  study_minutes: { ...prev.study_minutes, value },
                }))}
              />
            </div>

            {/* Reading Pages */}
            <div className="space-y-2">
              {hasMultipleLanguages && (
                <Label htmlFor="reading-pages-lang" className="text-xs text-muted-foreground">
                  {t.selectLanguage || 'Language'}
                </Label>
              )}
              {hasMultipleLanguages && (
                <Select
                  id="reading-pages-lang"
                  value={activities.reading_pages.language || ''}
                  onChange={(e) => {
                    const lang = e.target.value || null
                    const log = getLogForLanguage(lang)
                    setActivities(prev => ({
                      ...prev,
                      reading_pages: {
                        value: log?.reading_pages || 0,
                        language: lang,
                      },
                    }))
                  }}
                >
                  {targetLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </Select>
              )}
              <ReadingPagesInput
                value={activities.reading_pages.value}
                onChange={(value) => setActivities(prev => ({
                  ...prev,
                  reading_pages: { ...prev.reading_pages, value },
                }))}
              />
            </div>

            {/* Speaking Timer */}
            <div className="space-y-2">
              {hasMultipleLanguages && (
                <Label htmlFor="speaking-lang" className="text-xs text-muted-foreground">
                  {t.selectLanguage || 'Language'}
                </Label>
              )}
              {hasMultipleLanguages && (
                <Select
                  id="speaking-lang"
                  value={activities.speaking_done.language || ''}
                  onChange={(e) => {
                    const lang = e.target.value || null
                    const log = getLogForLanguage(lang)
                    setActivities(prev => ({
                      ...prev,
                      speaking_done: {
                        value: log?.speaking_done || false,
                        language: lang,
                      },
                    }))
                  }}
                >
                  {targetLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </Select>
              )}
              <SpeakingTimer
                done={activities.speaking_done.value}
                onDoneChange={(done) => setActivities(prev => ({
                  ...prev,
                  speaking_done: { ...prev.speaking_done, value: done },
                }))}
              />
            </div>

            {/* Media Log */}
            <div className="space-y-2">
              {hasMultipleLanguages && (
                <Label htmlFor="media-lang" className="text-xs text-muted-foreground">
                  {t.selectLanguage || 'Language'}
                </Label>
              )}
              {hasMultipleLanguages && (
                <Select
                  id="media-lang"
                  value={activities.media.language || ''}
                  onChange={(e) => {
                    const lang = e.target.value || null
                    const log = getLogForLanguage(lang)
                    setActivities(prev => ({
                      ...prev,
                      media: {
                        done: log?.media_done || false,
                        title: log?.media_title || '',
                        url: log?.media_url || '',
                        language: lang,
                      },
                    }))
                  }}
                >
                  {targetLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </Select>
              )}
              <MediaLog
                done={activities.media.done}
                title={activities.media.title}
                url={activities.media.url}
                onDoneChange={(done) => setActivities(prev => ({
                  ...prev,
                  media: { ...prev.media, done },
                }))}
                onTitleChange={(title) => setActivities(prev => ({
                  ...prev,
                  media: { ...prev.media, title },
                }))}
                onUrlChange={(url) => setActivities(prev => ({
                  ...prev,
                  media: { ...prev.media, url },
                }))}
              />
            </div>

            {/* Journal */}
            <div className="space-y-2">
              {hasMultipleLanguages && (
                <Label htmlFor="journal-lang" className="text-xs text-muted-foreground">
                  {t.selectLanguage || 'Language'}
                </Label>
              )}
              {hasMultipleLanguages && (
                <Select
                  id="journal-lang"
                  value={activities.journal.language || ''}
                  onChange={(e) => {
                    const lang = e.target.value || null
                    const log = getLogForLanguage(lang)
                    setActivities(prev => ({
                      ...prev,
                      journal: {
                        value: log?.journal_entry || '',
                        language: lang,
                      },
                    }))
                  }}
                >
                  {targetLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </Select>
              )}
              <JournalInput
                value={activities.journal.value}
                onChange={(value) => setActivities(prev => ({
                  ...prev,
                  journal: { ...prev.journal, value },
                }))}
                targetLanguages={targetLanguages}
              />
            </div>

            {/* Immersion */}
            <div className="space-y-2">
              {hasMultipleLanguages && (
                <Label htmlFor="immersion-lang" className="text-xs text-muted-foreground">
                  {t.selectLanguage || 'Language'}
                </Label>
              )}
              {hasMultipleLanguages && (
                <Select
                  id="immersion-lang"
                  value={activities.immersion.language || ''}
                  onChange={(e) => {
                    const lang = e.target.value || null
                    const log = getLogForLanguage(lang)
                    setActivities(prev => ({
                      ...prev,
                      immersion: {
                        done: log?.immersion_done || false,
                        note: log?.immersion_note || '',
                        language: lang,
                      },
                    }))
                  }}
                >
                  {targetLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </Select>
              )}
              <ImmersionToggle
                done={activities.immersion.done}
                note={activities.immersion.note}
                onDoneChange={(done) => setActivities(prev => ({
                  ...prev,
                  immersion: { ...prev.immersion, done },
                }))}
                onNoteChange={(note) => setActivities(prev => ({
                  ...prev,
                  immersion: { ...prev.immersion, note },
                }))}
              />
            </div>

            {/* Study Log */}
            <div className="md:col-span-2 space-y-2">
              {hasMultipleLanguages && (
                <Label htmlFor="study-log-lang" className="text-xs text-muted-foreground">
                  {t.selectLanguage || 'Language'}
                </Label>
              )}
              {hasMultipleLanguages && (
                <Select
                  id="study-log-lang"
                  value={activities.study_log.language || ''}
                  onChange={(e) => {
                    const lang = e.target.value || null
                    const log = getLogForLanguage(lang)
                    setActivities(prev => ({
                      ...prev,
                      study_log: {
                        value: log?.study_log_note || '',
                        language: lang,
                      },
                    }))
                  }}
                >
                  {targetLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </Select>
              )}
              <StudyLogInput
                value={activities.study_log.value}
                onChange={(value) => setActivities(prev => ({
                  ...prev,
                  study_log: { ...prev.study_log, value },
                }))}
              />
            </div>
          </div>
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
