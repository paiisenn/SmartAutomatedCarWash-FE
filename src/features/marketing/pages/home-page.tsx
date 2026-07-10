import { ArrowRight } from 'lucide-react'
import { Link } from '@/app/router'
import { routes } from '@/app/routes'
import { FeatureCard } from '@/features/marketing/components/feature-card'
import { LoyaltySection } from '@/features/marketing/components/loyalty-section'
import { SiteFooter } from '@/shared/components/layout/site-footer'
import { Button } from '@/shared/components/ui/button'
import { marketingFeatures } from '@/features/marketing/data/marketing'
import heroImage from '@/shared/assets/ultra-wash.png'

export function HomePage() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 pb-6 pt-32">
      <section className="mb-24 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,580px)]">
        <div className="max-w-[600px]">
          <h1 className="mb-6 text-[clamp(38px,4.6vw,52px)] font-medium leading-[1.16] text-on-background">
            Rửa xe thông minh, tích điểm mỗi lần
          </h1>
          <p className="mb-6 max-w-[620px] text-base leading-6 text-on-surface-variant">
            Nền tảng quản lý chăm sóc xe hiện đại nhất. Đặt lịch chỉ trong 30 giây, theo dõi lịch
            sử bảo dưỡng và nhận ưu đãi độc quyền dành riêng cho bạn.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="h-[52px] min-w-48 gap-4 px-6 text-base" size="lg">
              <Link to={routes.login}>
                Bắt đầu ngay
                <ArrowRight aria-hidden="true" size={22} />
              </Link>
            </Button>
            <Button asChild className="h-[52px] min-w-44 px-6 text-base" size="lg" variant="outline">
              <a href="#features">Xem tính năng</a>
            </Button>
          </div>
        </div>

        <div aria-label="Gói rửa xe Ultra Wash">
          <img
            alt="Minh họa xe máy với gói Ultra Wash"
            className="block h-auto w-full border border-[#eee7d7] shadow-[0_14px_24px_rgb(39_47_62_/_11%)]"
            src={heroImage}
          />
        </div>
      </section>

      <section className="mb-24" id="features" aria-labelledby="features-title">
        <div className="mx-auto mb-12 max-w-[760px] text-center">
          <h2 className="text-xl font-medium leading-7 text-on-background" id="features-title">
            Tính năng nổi bật
          </h2>
          <p className="mt-4 text-base leading-6 text-on-surface-variant">
            Trải nghiệm dịch vụ chăm sóc xe toàn diện với các tính năng thông minh.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {marketingFeatures.map((feature) => (
            <FeatureCard {...feature} key={feature.title} />
          ))}
        </div>
      </section>

      <LoyaltySection />
      <SiteFooter />
    </main>
  )
}
