import { useEffect, useRef, useState } from 'react'
import { useNavigate, useBlocker } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useTranslation } from '@/hooks/useTranslation'
import { DailyChecklist, type DailyChecklistHandle } from '@/components/dashboard/DailyChecklist'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate, getTodayInTimezone } from '@/lib/date-utils'
import { Loader2 } from 'lucide-react'

export default function Dashboard() {
  const { profile, loading } = useProfile()
  const { t, language } = useTranslation()
  const navigate = useNavigate()
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const checklistRef = useRef<DailyChecklistHandle>(null)
  const blocker = useBlocker(hasUnsavedChanges)
  const [savingBeforeLeave, setSavingBeforeLeave] = useState(false)

  useEffect(() => {
    // Only redirect to onboarding if we've finished loading and there's no profile
    // This prevents redirect loops and race conditions
    if (!loading && !profile) {
      navigate('/onboarding', { replace: true })
    }
  }, [profile, loading, navigate])

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-8 text-muted-foreground">{t.loading}</div>
      </AppLayout>
    )
  }

  if (!profile) {
    return null
  }

  const today = getTodayInTimezone(profile.timezone)

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.dashboardTitle}</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {formatDate(today, 'EEEE, MMMM d, yyyy', language)}
          </p>
        </div>

        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t.currentStreak}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.current_streak}</div>
              <p className="text-xs text-muted-foreground">{t.days}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t.longestStreak}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.longest_streak}</div>
              <p className="text-xs text-muted-foreground">{t.days}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t.totalCompleted}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.total_completed}</div>
              <p className="text-xs text-muted-foreground">{t.days}</p>
            </CardContent>
          </Card>
        </div>

        <DailyChecklist
          ref={checklistRef}
          onUnsavedChange={setHasUnsavedChanges}
        />
      </div>

      {/* Unsaved changes: confirm before leaving */}
      <Dialog
        open={blocker.state === 'blocked'}
        onOpenChange={(open) => {
          if (!open && blocker.state === 'blocked') blocker.reset?.()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.saveBeforeLeaveTitle}</DialogTitle>
            <DialogDescription>{t.saveBeforeLeaveMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => blocker.reset?.()}
              disabled={savingBeforeLeave}
            >
              {t.cancel}
            </Button>
            <Button
              variant="ghost"
              onClick={() => blocker.proceed?.()}
              disabled={savingBeforeLeave}
            >
              {t.leaveWithoutSaving}
            </Button>
            <Button
              onClick={async () => {
                setSavingBeforeLeave(true)
                try {
                  const handle = checklistRef.current
                  if (handle) await handle.save({ skipReload: true })
                  blocker.proceed?.()
                } finally {
                  setSavingBeforeLeave(false)
                }
              }}
              disabled={savingBeforeLeave}
            >
              {savingBeforeLeave ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t.saving}
                </>
              ) : (
                t.saveAndLeave
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}

