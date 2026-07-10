import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { TierRule } from '@/features/admin/data/admin-configuration'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'

export function TierRuleCard({ rule }: { rule: TierRule }) {
  const [open, setOpen] = useState(!rule.defaultCollapsed)

  return (
    <Card className="overflow-hidden shadow-sm">
      <button
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-surface-container-low"
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex items-center gap-3">
          <span className={cn('rounded px-3 py-1 text-xs font-medium leading-4 text-on-surface', rule.className)}>
            {rule.label}
          </span>
          <span className="text-sm font-medium leading-4 text-on-surface">{rule.name}</span>
        </span>
        <ChevronDown className={cn('text-on-surface-variant transition-transform', open && 'rotate-180')} size={20} />
      </button>

      {open && (
        <CardContent className="grid gap-4 border-t border-border p-4 pt-3 sm:grid-cols-2">
          <label className="grid gap-2 text-xs font-medium leading-4 text-on-surface-variant">
            Ngưỡng lần rửa
            <Input defaultValue={rule.threshold} type="number" />
          </label>
          <label className="grid gap-2 text-xs font-medium leading-4 text-on-surface-variant">
            Booking window (ngày)
            <Input defaultValue={rule.bookingWindow} type="number" />
          </label>
          <label className="grid gap-2 text-xs font-medium leading-4 text-on-surface-variant">
            Point multiplier (%)
            <Input defaultValue={rule.multiplier} type="number" />
          </label>
          <label className="grid gap-2 text-xs font-medium leading-4 text-on-surface-variant sm:col-span-2">
            Đặc quyền (Perks)
            <textarea
              className="min-h-24 resize-none rounded-lg border border-outline-variant bg-surface px-3 py-3 text-base leading-6 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              defaultValue={rule.perks}
            />
          </label>
        </CardContent>
      )}
    </Card>
  )
}
