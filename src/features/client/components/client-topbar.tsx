import { Bell, HelpCircle, Settings, Smartphone } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Link } from '@/app/router'
import { routes } from '@/app/routes'
import { Button } from '@/shared/components/ui/button'
import type { RootState } from '@/app/store'

type ClientTopbarProps = {
  title?: string
  utility?: 'help' | 'settings'
}

export function ClientTopbar({ title, utility = 'help' }: ClientTopbarProps) {
  const user = useSelector((state: RootState) => state.auth.user)
  const displayName = user?.name || user?.phone || 'Khách hàng'
  const displayTitle = title || `Xin chào, ${displayName}`
  const UtilityIcon = utility === 'settings' ? Settings : HelpCircle
  const utilityLabel = utility === 'settings' ? 'Cài đặt' : 'Trợ giúp'

  return (
    <header className="fixed right-0 top-0 z-30 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface px-6 lg:w-[calc(100%-16rem)]">
      <h2 className="text-xl font-medium leading-7 text-on-surface">{displayTitle}</h2>

      <div className="flex items-center gap-4">
        <Button aria-label="Thông báo" asChild size="icon" variant="ghost">
          <Link to={routes.notifications}>
            <Bell className="size-5 text-on-surface-variant" />
          </Link>
        </Button>
        <Button aria-label={utilityLabel} size="icon" type="button" variant="ghost">
          <UtilityIcon className="size-5 text-on-surface-variant" />
        </Button>
        <div className="h-8 w-px bg-outline-variant" />
        <button
          aria-label="Hồ sơ"
          className="grid size-10 place-items-center rounded-full border border-outline-variant bg-surface-container-low text-on-surface-variant"
          type="button"
        >
          <Smartphone size={22} />
        </button>
      </div>
    </header>
  )
}
