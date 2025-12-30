import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { DailyChecklist } from '@/components/dashboard/DailyChecklist'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, getTodayInTimezone } from '@/lib/date-utils'

export default function Dashboard() {
  const { profile, loading } = useProfile()
  const navigate = useNavigate()

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
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      </AppLayout>
    )
  }

  if (!profile) {
    return null
  }

  const today = getTodayInTimezone(profile.timezone)

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            {formatDate(today, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.current_streak}</div>
              <p className="text-xs text-muted-foreground">days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.longest_streak}</div>
              <p className="text-xs text-muted-foreground">days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.total_completed}</div>
              <p className="text-xs text-muted-foreground">days</p>
            </CardContent>
          </Card>
        </div>

        <DailyChecklist />
      </div>
    </AppLayout>
  )
}

