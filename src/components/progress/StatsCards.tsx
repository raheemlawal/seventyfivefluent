import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'
import type { Profile } from '@/types'

interface StatsCardsProps {
  profile: Profile
}

export function StatsCards({ profile }: StatsCardsProps) {
  const { t } = useTranslation()
  
  // Note: Stats cards show overall profile stats (not language-specific)
  // Language-specific stats would require calculating from logs, which is more complex
  // For now, we show overall stats but could add language breakdown in the future
  
  return (
    <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{t.currentStreak}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{profile.current_streak}</div>
          <p className="text-xs text-muted-foreground mt-1">{t.consecutiveDays}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{t.longestStreak}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{profile.longest_streak}</div>
          <p className="text-xs text-muted-foreground mt-1">{t.bestStreak}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{t.totalCompleted}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{profile.total_completed}</div>
          <p className="text-xs text-muted-foreground mt-1">{t.daysCompleted}</p>
        </CardContent>
      </Card>
    </div>
  )
}

