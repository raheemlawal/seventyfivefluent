import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface StudyLogInputProps {
  value: string | null
  onChange: (value: string) => void
}

export function StudyLogInput({ value, onChange }: StudyLogInputProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label htmlFor="study-log">Track Your Study</Label>
          <Textarea
            id="study-log"
            placeholder="What did you study? What resources did you use? Any notes?"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
          />
          <p className="text-sm text-muted-foreground">
            Log your study session details and resources
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

