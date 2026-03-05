import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'

interface ImmersionToggleProps {
  done: boolean
  note: string | null
  onDoneChange: (done: boolean) => void
  onNoteChange: (note: string) => void
}

export function ImmersionToggle({
  done,
  note,
  onDoneChange,
  onNoteChange,
}: ImmersionToggleProps) {
  const { t } = useTranslation()
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{t.immersion}</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="immersion-done"
                checked={done}
                onCheckedChange={(checked) => onDoneChange(checked === true)}
              />
              <Label htmlFor="immersion-done" className="cursor-pointer">
                {t.done}
              </Label>
            </div>
          </div>
          <Textarea
            placeholder={t.immersionPlaceholder}
            value={note || ''}
            onChange={(e) => onNoteChange(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}

