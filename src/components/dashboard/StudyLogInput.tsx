import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'

interface StudyLogInputProps {
  value: string | null
  onChange: (value: string) => void
}

export function StudyLogInput({ value, onChange }: StudyLogInputProps) {
  const { t } = useTranslation()
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label htmlFor="study-log">{t.trackYourStudy}</Label>
          <Textarea
            id="study-log"
            placeholder={t.studyLogPlaceholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
          />
          <p className="text-sm text-muted-foreground">
            {t.studyLogHint}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

