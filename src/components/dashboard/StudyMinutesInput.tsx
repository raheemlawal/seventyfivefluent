import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'

interface StudyMinutesInputProps {
  value: number
  onChange: (value: number) => void
}

export function StudyMinutesInput({ value, onChange }: StudyMinutesInputProps) {
  const goal = 60
  const percentage = Math.min((value / goal) * 100, 100)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="study-minutes">Study Minutes</Label>
            <span className="text-sm text-muted-foreground">
              {value} / {goal} min
            </span>
          </div>
          <Input
            id="study-minutes"
            type="number"
            min="0"
            max="600"
            value={value || ''}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            placeholder="0"
          />
          <Progress value={percentage} className="h-2" />
          {value >= goal && (
            <p className="text-sm text-green-600">✓ Goal reached!</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

