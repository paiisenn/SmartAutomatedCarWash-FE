import { Bell, HelpCircle } from 'lucide-react'
import { Link } from '@/app/router'
import { routes } from '@/app/routes'
import { Button } from '@/shared/components/ui/button'

export function AppHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-6">
      <Link className="text-xl font-medium leading-7 text-primary hover:opacity-80" to={routes.home}>
        AutoWash Pro
      </Link>

      <div className="flex items-center gap-4" aria-label="Tác vụ tài khoản">
        <Button asChild className="hidden sm:inline-flex" size="sm" variant="outline">
          <Link to={routes.test}>Test routes</Link>
        </Button>
        <Button aria-label="Trợ giúp" size="icon" type="button" variant="ghost">
          <HelpCircle className="size-5 text-on-surface-variant" />
        </Button>
        <Button aria-label="Thông báo" asChild size="icon" variant="ghost">
          <Link to={routes.notifications}>
            <Bell className="size-5 text-on-surface-variant" />
          </Link>
        </Button>
        <Button
          aria-label="Hồ sơ"
          className="size-8 rounded-full border border-outline-variant bg-[linear-gradient(145deg,#edf7f8,#8cb6b2)] p-0 text-xs text-primary hover:bg-[linear-gradient(145deg,#edf7f8,#8cb6b2)]"
          type="button"
          variant="outline"
        >
          AP
        </Button>
      </div>
    </header>
  )
}
