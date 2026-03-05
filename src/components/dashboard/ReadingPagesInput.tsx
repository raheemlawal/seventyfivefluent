import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'

interface ReadingPagesInputProps {
  value: number
  onChange: (value: number) => void
}

export function ReadingPagesInput({ value, onChange }: ReadingPagesInputProps) {
  const { t } = useTranslation()
  const goal = 5
  const percentage = Math.min((value / goal) * 100, 100)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="reading-pages">{t.readingPages}</Label>
            <span className="text-sm text-muted-foreground">
              {value} / {goal} {t.pages}
            </span>
          </div>
          <Input
            id="reading-pages"
            type="number"
            min="0"
            max="100"
            value={value || ''}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            placeholder="0"
          />
          <Progress value={percentage} className="h-2" />
          {value >= goal && (
            <p className="text-sm text-[#2d5016]">{t.goalReached}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

