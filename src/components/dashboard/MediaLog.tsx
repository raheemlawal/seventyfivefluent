import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'

interface MediaLogProps {
  done: boolean
  title: string
  url: string
  onDoneChange: (done: boolean) => void
  onTitleChange: (title: string) => void
  onUrlChange: (url: string) => void
}

export function MediaLog({
  done,
  title,
  url,
  onDoneChange,
  onTitleChange,
  onUrlChange,
}: MediaLogProps) {
  const { t } = useTranslation()
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{t.podcastVideoEpisode}</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="media-done"
                checked={done}
                onCheckedChange={(checked) => onDoneChange(checked === true)}
              />
              <Label htmlFor="media-done" className="cursor-pointer">
                {t.done}
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Input
              placeholder={t.mediaTitlePlaceholder}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
            <Input
              type="url"
              placeholder={t.mediaUrlPlaceholder}
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

