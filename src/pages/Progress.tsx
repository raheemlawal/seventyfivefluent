import { useProfile } from '@/hooks/useProfile'
import { useTranslation } from '@/hooks/useTranslation'
import { AppLayout } from '@/components/layout/AppLayout'
import { StatsCards } from '@/components/progress/StatsCards'
import { HabitCompletionRates } from '@/components/progress/HabitCompletionRates'
import { StreakVisualization } from '@/components/progress/StreakVisualization'

export default function Progress() {
  const { profile, loading } = useProfile()
  const { t } = useTranslation()

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-8 text-muted-foreground">{t.loading}</div>
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
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.progressTitle}</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {t.trackLanguageLearning}
          </p>
        </div>

        <StatsCards profile={profile} />

        <StreakVisualization />

        <HabitCompletionRates />
      </div>
    </AppLayout>
  )
}

