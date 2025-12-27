import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'

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
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Podcast / Video / Episode</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="media-done"
                checked={done}
                onCheckedChange={(checked) => onDoneChange(checked === true)}
              />
              <Label htmlFor="media-done" className="cursor-pointer">
                Done
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Title (e.g., 'Spanish Podcast Episode 5')"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
            <Input
              type="url"
              placeholder="URL (optional)"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

