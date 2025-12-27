import { useProfile } from '@/hooks/useProfile'
import { AppLayout } from '@/components/layout/AppLayout'
import { StatsCards } from '@/components/progress/StatsCards'
import { HabitCompletionRates } from '@/components/progress/HabitCompletionRates'
import { StreakVisualization } from '@/components/progress/StreakVisualization'

export default function Progress() {
  const { profile, loading } = useProfile()

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      </AppLayout>
    )
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="text-center py-8 text-muted-foreground">No profile found</div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Progress</h1>
          <p className="text-muted-foreground">
            Track your language learning journey and completion statistics
          </p>
        </div>

        <StatsCards profile={profile} />

        <StreakVisualization />

        <HabitCompletionRates />
      </div>
    </AppLayout>
  )
}

