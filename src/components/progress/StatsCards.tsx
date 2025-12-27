import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Profile } from '@/types'

interface StatsCardsProps {
  profile: Profile
}

export function StatsCards({ profile }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{profile.current_streak}</div>
          <p className="text-xs text-muted-foreground mt-1">consecutive days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{profile.longest_streak}</div>
          <p className="text-xs text-muted-foreground mt-1">best streak</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{profile.total_completed}</div>
          <p className="text-xs text-muted-foreground mt-1">days completed</p>
        </CardContent>
      </Card>
    </div>
  )
}

