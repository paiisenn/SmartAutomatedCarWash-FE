import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Gift, Layers, Percent } from 'lucide-react'
import { ClientSidebar } from '@/features/client/components/client-sidebar'
import { ClientTopbar } from '@/features/client/components/client-topbar'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Card } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'
import { useRouter } from '@/app/router'
import { routes } from '@/app/routes'
import type { RootState } from '@/app/store'

export default function ClientPromotionsPage() {
  const { navigate } = useRouter()
  const { tier } = useSelector((state: RootState) => state.client.loyalty)
  const [activeTab, setActiveTab] = useState<'active' | 'used'>('active')

  const getTierRank = (t: string) => {
    const name = (t || '').toLowerCase()
    if (name === 'platinum') return 4
    if (name === 'gold') return 3
    if (name === 'silver') return 2
    return 1
  }

  const userRank = getTierRank(tier)

  const handleUsePromo = () => {
    navigate(routes.booking)
  }

  // Cards definitions with required ranks
  const promos = [
    {
      id: 'p1',
      title: 'Giảm 20% gói Premium',
      description: 'Áp dụng cho lần rửa tiếp theo',
      requiredRank: 3,
      badgeText: 'GOLD+',
      badgeVariant: 'gold' as const,
      bgClass: 'bg-[#FFFBEB]',
      iconColor: 'text-warning',
      icon: Percent,
      expiryText: 'Hạn dùng: 31/12/2026',
      requiredTierName: 'hạng Vàng'
    },
    {
      id: 'p2',
      title: 'Miễn phí rửa xe',
      description: 'Thưởng đặc biệt mừng sinh nhật',
      requiredRank: 1,
      badgeText: 'MEMBER+',
      badgeVariant: 'member' as const,
      bgClass: 'bg-[#F0FDF4]',
      iconColor: 'text-success',
      icon: Gift,
      expiryText: 'Hạn dùng: 15/12/2026',
      requiredTierName: 'hạng Thường'
    },
    {
      id: 'p3',
      title: 'Tặng phủ Nano',
      description: 'Nâng cấp dịch vụ miễn phí',
      requiredRank: 2,
      badgeText: 'SILVER+',
      badgeVariant: 'silver' as const,
      bgClass: 'bg-[#EFF6FF]',
      iconColor: 'text-info',
      icon: Layers,
      expiryText: 'Hạn dùng: 20/12/2026',
      requiredTierName: 'hạng Bạc'
    }
  ]

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <ClientSidebar />
      <ClientTopbar title="Khuyến mãi của bạn" />

      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-[calc(16rem+24px)]">
        <div className="mx-auto max-w-[1280px]">
          {/* Tabs */}
          <div className="mt-6 flex gap-6 border-b border-outline-variant">
            <button
              onClick={() => setActiveTab('active')}
              className={cn(
                'px-2 pb-4 text-sm font-medium transition-all cursor-pointer',
                activeTab === 'active'
                  ? 'border-b-2 border-primary text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              Đang có
            </button>
            <button
              onClick={() => setActiveTab('used')}
              className={cn(
                'px-2 pb-4 text-sm font-medium transition-all cursor-pointer',
                activeTab === 'used'
                  ? 'border-b-2 border-primary text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              Đã dùng
            </button>
          </div>

          {/* Promo Content */}
          {activeTab === 'active' && (
            <div className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {promos.map((promo) => {
                  const isUnlocked = userRank >= promo.requiredRank
                  const PromoIcon = promo.icon

                  return (
                    <Card
                      key={promo.id}
                      className={cn(
                        'relative flex h-full flex-col overflow-hidden p-4 transition-all shadow-xs border border-slate-200',
                        promo.bgClass,
                        !isUnlocked && 'opacity-65 saturate-[0.8]'
                      )}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="rounded-lg bg-white/50 p-2">
                          <PromoIcon className={promo.iconColor} size={24} />
                        </div>
                        <Badge variant={promo.badgeVariant}>{promo.badgeText}</Badge>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-on-surface">
                        {promo.title}
                      </h3>
                      <p className="mb-4 flex-grow text-sm text-on-surface-variant">
                        {promo.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-4">
                        <span className="text-xs text-on-surface-variant">
                          {promo.expiryText}
                        </span>
                        {isUnlocked ? (
                          <Button
                            variant="default"
                            onClick={handleUsePromo}
                            className="bg-primary text-on-primary hover:bg-info transition-colors"
                          >
                            Dùng ngay
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            disabled
                            className="cursor-not-allowed bg-slate-200 text-slate-500 border border-slate-300"
                          >
                            Yêu cầu {promo.requiredTierName}
                          </Button>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'used' && (
            <div className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Grayscale Used Card */}
                <Card className="relative flex h-full flex-col overflow-hidden bg-surface-container-low p-4 grayscale">
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                    <div className="border-4 border-secondary px-4 py-2 text-2xl font-bold uppercase text-secondary" style={{ transform: 'rotate(-15deg)' }}>
                      Đã dùng
                    </div>
                  </div>
                  <div className="mb-3 flex items-start justify-between opacity-50">
                    <div className="rounded-lg bg-white/50 p-2">
                      <Percent className="text-secondary" size={24} />
                    </div>
                    <Badge variant="platinum">PLATINUM</Badge>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-secondary">Giảm 50% Combo Thu</h3>
                  <p className="mb-4 flex-grow text-sm text-secondary opacity-70">
                    Áp dụng cho gói vệ sinh nội thất
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-4 opacity-50">
                    <span className="text-xs text-secondary">Hết hạn: 01/10/2026</span>
                    <Button
                      variant="secondary"
                      className="cursor-not-allowed text-secondary bg-secondary-container hover:bg-secondary-container"
                      disabled
                    >
                      Đã dùng
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Empty State Section */}
          <section className="mx-auto mt-24 flex max-w-2xl flex-col items-center rounded-xl border border-outline-variant bg-surface py-6 text-center shadow-sm lg:py-8">
            <div className="mb-6 h-48 w-48">
              <img
                alt="Gift box illustration"
                className="h-full w-full rounded-lg object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0s0mldjCHn8JL7XO5Vx56HF-3XoRfrcMxqHwjyHmIm7jM_AbpZ8PijdTfGHYbYWjoZRxGAascKz2N-JsS5tMpKP8W1AWGRur60eWfJbTQPzG8Z3lCv9pV6OPLXwAO6AFx2UkMWRKGdyiucJQ17De86KRJcRp-coLnsUw0xfwL4SZyy90Wb34_eGcfpqYAzSGgiXuvafqpH8hZGAoLQ_ryZeDIfBAagfSStOGCC4Iac7lthR1NP0mhU5gVF_j7fpgRa4KsVeXKNuE"
              />
            </div>
            <h3 className="mb-3 text-2xl font-medium text-on-surface">Chưa có ưu đãi nào</h3>
            <p className="mb-6 px-6 text-base text-on-surface-variant">
              Hãy tích thêm điểm để nâng hạng Tier và nhận ưu đãi độc quyền dành riêng cho bạn!
            </p>
            <Button
              size="lg"
              onClick={() => navigate(routes.loyalty)}
              className="gap-2 px-6 h-11 bg-primary text-on-primary hover:opacity-90 transition-opacity"
            >
              <Gift size={20} />
              Xem bảng tích điểm
            </Button>
          </section>
        </div>
      </main>
    </div>
  )
}
