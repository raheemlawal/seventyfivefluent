import { Card, CardContent } from '@/components/ui/card'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

