import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'

interface JournalInputProps {
  value: string | null
  onChange: (value: string) => void
  targetLanguages: string[]
}

export function JournalInput({ value, onChange, targetLanguages }: JournalInputProps) {
  const { t } = useTranslation()
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label htmlFor="journal">
            {t.journalEntry} ({targetLanguages.length > 0 ? targetLanguages.join(', ') : 'target language'})
          </Label>
          <Textarea
            id="journal"
            placeholder={t.journalPlaceholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={6}
          />
          <p className="text-sm text-muted-foreground">
            {t.journalHint}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

