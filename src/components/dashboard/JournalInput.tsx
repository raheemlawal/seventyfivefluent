import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface JournalInputProps {
  value: string | null
  onChange: (value: string) => void
  targetLanguages: string[]
}

export function JournalInput({ value, onChange, targetLanguages }: JournalInputProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label htmlFor="journal">
            Journal Entry ({targetLanguages.length > 0 ? targetLanguages.join(', ') : 'target language'})
          </Label>
          <Textarea
            id="journal"
            placeholder="Write your daily journal entry in your target language..."
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={6}
          />
          <p className="text-sm text-muted-foreground">
            Write at least a few sentences in your target language
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

