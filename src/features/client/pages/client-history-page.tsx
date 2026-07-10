import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bike, ChevronRight, CalendarX, Car, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import type { AppDispatch, RootState } from '@/app/store'
import { fetchBookings } from '@/features/client/store/client-slice'
import { bookingService } from '@/features/booking/services/booking-service'
import { ClientSidebar } from '@/features/client/components/client-sidebar'
import { ClientTopbar } from '@/features/client/components/client-topbar'
import { cn } from '@/shared/lib/utils'

export function ClientHistoryPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items: bookings, isLoading } = useSelector((state: RootState) => state.client.bookings)

  const [activeTab, setActiveTab] = useState('Tất cả')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    dispatch(fetchBookings())
  }, [dispatch])

  const tabs = ['Tất cả', 'Sắp tới', 'Hoàn thành', 'Đã hủy']

  // Filter bookings based on activeTab
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (activeTab === 'Tất cả') return true
      if (activeTab === 'Sắp tới') {
        return (
          booking.status === 'PENDING' ||
          booking.status === 'CONFIRMED' ||
          booking.status === 'IN_PROGRESS'
        )
      }
      if (activeTab === 'Hoàn thành') return booking.status === 'DONE'
      if (activeTab === 'Đã hủy') return booking.status === 'CANCELLED'
      return true
    })
  }, [bookings, activeTab])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date)
    } catch {
      return dateString
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) return
    try {
      await bookingService.cancelBooking(bookingId)
      toast.success('Hủy đặt lịch thành công')
      dispatch(fetchBookings())
    } catch {
      toast.error('Không thể hủy đặt lịch. Vui lòng thử lại.')
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <ClientSidebar />
      <ClientTopbar title="Lịch sử đặt lịch" />

      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-[calc(16rem+24px)]">
        <div className="mx-auto max-w-[1280px]">
          {/* Tab Filter Row */}
          <div className="mb-8 flex w-fit items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'rounded-lg px-6 py-2 text-sm font-medium transition-all',
                  activeTab === tab
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-secondary hover:text-primary'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Booking List */}
          {isLoading ? (
            <div className="py-24 text-center text-on-surface-variant">
              Đang tải lịch sử đặt lịch...
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking, index) => {
                const isBike = (booking as any).vehicleType === 'BIKE'
                const VehicleIcon = isBike ? Bike : Car
                const showCancelButton = booking.status === 'PENDING' || booking.status === 'CONFIRMED'

                return (
                  <div
                    key={booking.id}
                    className={cn(
                      'flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-outline-variant bg-surface p-6 transition-all hover:shadow-md gap-4',
                      mounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                    )}
                    style={{ transitionDelay: `${index * 50}ms`, transitionDuration: '400ms' }}
                  >
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        'flex size-14 items-center justify-center rounded-xl shrink-0',
                        booking.status === 'CANCELLED'
                          ? 'bg-error-container text-danger'
                          : booking.status === 'DONE'
                            ? 'bg-surface-container-high text-secondary'
                            : 'bg-primary-fixed text-primary'
                      )}>
                        <VehicleIcon size={32} />
                      </div>
                      <div>
                        <div className="mb-1 flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-semibold text-on-surface">
                            {booking.vehicleDetails?.licensePlate || booking.licensePlate || 'Chưa rõ xe'}
                          </h3>
                          <span className={cn(
                            'rounded-full px-3 py-1 text-xs font-bold uppercase',
                            booking.status === 'CONFIRMED'
                              ? 'bg-success/10 text-success'
                              : booking.status === 'PENDING'
                                ? 'bg-warning/10 text-warning'
                                : booking.status === 'IN_PROGRESS'
                                  ? 'bg-info/10 text-info'
                                  : booking.status === 'DONE'
                                    ? 'bg-gray-200 text-gray-600'
                                    : 'bg-danger/10 text-danger'
                          )}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="mb-1 text-sm font-medium text-on-surface-variant">
                          {booking.serviceType} {booking.notes ? `• ${booking.notes}` : ''}
                        </p>
                        <div className="flex items-center gap-2 text-secondary">
                          <Clock size={18} />
                          <span className="text-sm">{formatDate(booking.scheduledAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-4 border-t border-outline-variant pt-4 sm:border-t-0 sm:pt-0">
                      {showCancelButton && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="rounded-lg border border-danger px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
                        >
                          Hủy lịch
                        </button>
                      )}
                      <button className="flex size-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container-low shrink-0">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center py-24">
              <div className="mb-6 flex size-64 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low">
                <CalendarX className="size-20 text-outline-variant" strokeWidth={1} />
              </div>
              <h4 className="mb-2 text-xl font-semibold text-on-surface">Chưa có lịch hẹn</h4>
              <p className="max-w-xs text-center text-base text-secondary">
                Không tìm thấy lịch hẹn nào tương ứng trong hệ thống của bạn.
              </p>
            </div>
          )}

          {/* Illustration for VIP tier privileges */}
          <div className="relative mt-12 overflow-hidden rounded-xl bg-gradient-to-br from-primary to-info p-8">
            <div className="relative z-10 max-w-md">
              <h3 className="mb-2 text-xl font-semibold text-white">Đặc quyền hội viên vàng</h3>
              <p className="mb-6 text-base text-white/90">
                Khách hàng hạng vàng được ưu tiên sắp xếp dịch vụ, rút ngắn thời gian chờ đợi và giảm chi phí trực tiếp trên hóa đơn.
              </p>
              <button className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-primary transition-all hover:bg-opacity-90">
                Khám phá đặc quyền
              </button>
            </div>
            <div className="absolute -bottom-5 -right-10 rotate-[-12deg] opacity-20">
              <Car className="size-[240px] text-white" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
