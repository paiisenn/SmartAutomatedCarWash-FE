import { quickActions } from '@/features/client/data/client-dashboard'
import { Card, CardContent } from '@/shared/components/ui/card'

export function QuickActions() {
  return (
    <section className="lg:col-span-4">
      <div className="grid h-full grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon

          return (
            <Card className="group transition-colors hover:border-primary" key={action.label}>
              <CardContent className="flex min-h-[134px] flex-col items-center justify-center gap-3 p-4 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-surface-container-low text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon aria-hidden="true" size={24} />
                </span>
                <span className="text-sm font-medium leading-4 text-on-surface">{action.label}</span>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
