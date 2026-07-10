import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Star,
  Gift,
  AlertTriangle,
  Award,
  Check
} from 'lucide-react'
import { motion } from 'motion/react'
import toast from 'react-hot-toast'
import type { AppDispatch, RootState } from '@/app/store'
import { fetchLoyaltyBalance } from '@/features/client/store/client-slice'
import { loyaltyService, type PointHistoryResponse } from '@/features/client/services/loyalty-service'
import { cn } from '@/shared/lib/utils'
import { ClientSidebar } from '@/features/client/components/client-sidebar'
import { ClientTopbar } from '@/features/client/components/client-topbar'

export function LoyaltyPage() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)
  const { balance, tier, nextTierPoints, isLoading } = useSelector((state: RootState) => state.client.loyalty)

  const [history, setHistory] = useState<PointHistoryResponse[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'earn' | 'redeem' | 'expire'>('all')
  const [claimedReward, setClaimedReward] = useState<string | null>(null)

  const loadPointHistory = useCallback(async () => {
    if (!user?.id) return
    setIsLoadingHistory(true)
    try {
      const page = await loyaltyService.getPointHistory(user.id, { size: 50 })
      setHistory(page.content || [])
    } catch {
      toast.error('Không thể tải lịch sử điểm thưởng')
    } finally {
      setIsLoadingHistory(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadPointHistory()
    if (user?.id) {
      dispatch(fetchLoyaltyBalance(user.id))
    }
  }, [loadPointHistory, user?.id, dispatch])

  // Filter history based on transactionType
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      if (filterType === 'all') return true
      if (filterType === 'earn') return item.transactionType === 'EARN'
      if (filterType === 'redeem') return item.transactionType === 'REDEEM'
      return false // 'expire' is mock or not in API
    })
  }, [history, filterType])

  // Format date string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    } catch {
      return dateString
    }
  }

  // Tier calculation logic
  let currentTierThreshold = 1000
  let nextTierThreshold = 2500
  let nextTierName = 'Platinum'
  const tierLower = (tier || 'Regular').toLowerCase()

  if (tierLower === 'regular' || tierLower === 'member') {
    currentTierThreshold = 0
    nextTierThreshold = 500
    nextTierName = 'Silver'
  } else if (tierLower === 'silver') {
    currentTierThreshold = 500
    nextTierThreshold = 1000
    nextTierName = 'Gold'
  } else if (tierLower === 'gold') {
    currentTierThreshold = 1000
    nextTierThreshold = 2500
    nextTierName = 'Platinum'
  } else {
    nextTierName = ''
  }

  const remainingPoints = nextTierPoints > 0 ? nextTierPoints : Math.max(0, nextTierThreshold - balance)
  const range = nextTierThreshold - currentTierThreshold
  const currentProgressInTier = balance - currentTierThreshold
  const progressPercent = nextTierName
    ? Math.min(100, Math.max(0, (currentProgressInTier / range) * 100))
    : 100

  const handleClaimGift = async () => {
    if (!user?.id) {
      toast.error('Vui lòng đăng nhập để thực hiện')
      return
    }

    if (balance < 500) {
      toast.error('Bạn cần tối thiểu 500 điểm để đổi voucher này')
      return
    }

    try {
      const referenceId = '00000000-0000-0000-0000-' + Math.floor(100000000000 + Math.random() * 900000000000)
      await loyaltyService.redeemPoints({
        customerId: user.id,
        redeemType: 'VOUCHER_20',
        referenceId
      })
      
      toast.success('Đổi voucher thành công!')
      setClaimedReward(
        'Cảm ơn bạn! Yêu cầu đổi voucher ưu đãi giảm 20% đã được gửi thành công. Hệ thống đã trừ điểm tích lũy của bạn.'
      )
      
      // Refresh points and history
      dispatch(fetchLoyaltyBalance(user.id))
      loadPointHistory()
      
      setTimeout(() => {
        setClaimedReward(null)
      }, 5000)
    } catch {
      toast.error('Đổi quà thất bại. Vui lòng kiểm tra lại điểm tích lũy.')
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <ClientSidebar />
      <ClientTopbar title="Khách hàng thân thiết" />

      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-[calc(16rem+24px)]">
        <div className="mx-auto max-w-[1280px] space-y-6">
          {/* Toast Reward Claim feedback */}
          {claimedReward && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='fixed top-20 right-6 z-50 max-w-sm p-4 bg-indigo-50 border border-indigo-150 rounded-xl shadow-lg shadow-indigo-100 text-indigo-700 text-sm flex items-start gap-2.5'
            >
              <Gift className='w-5 h-5 shrink-0 mt-0.5' />
              <div>
                <p className='font-medium'>Thông báo đổi quà</p>
                <p className='text-xs opacity-90 mt-1'>{claimedReward}</p>
              </div>
            </motion.div>
          )}

          {/* Hero Section - Tier Status Card */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 shadow-xs'
          >
            <div className='flex items-center gap-6'>
              <div className='bg-amber-50 text-amber-800 px-4 py-3 rounded-xl border border-amber-200/50 flex items-center gap-2 shadow-xs'>
                <Star className='w-5 h-5 fill-amber-500 text-amber-500' />
                <span className='text-xs font-bold uppercase tracking-wider'>
                  {tier || 'MEMBER'}
                </span>
              </div>
              <div>
                <p className='text-3xl font-bold tracking-tight text-slate-900'>
                  {isLoading ? '...' : `${new Intl.NumberFormat('vi-VN').format(balance)} pts`}
                </p>
                <p className='text-xs font-medium text-slate-450 uppercase tracking-widest mt-0.5'>
                  Tài khoản hạng {tier}
                </p>
              </div>
            </div>

            {nextTierName && (
              <div className='flex-1 max-w-md w-full'>
                <div className='flex justify-between mb-2'>
                  <span className='text-xs font-bold text-slate-500 tracking-tight'>
                    Tiến trình lên {nextTierName}
                  </span>
                  <span className='text-xs font-bold text-indigo-600'>{Math.round(progressPercent)}%</span>
                </div>
                <div className='h-2 w-full bg-slate-100 rounded-full overflow-hidden'>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className='h-full bg-indigo-600'
                  />
                </div>
                <p className='mt-2 text-[11px] text-slate-500 text-right font-medium'>
                  Còn <span className='font-bold text-slate-800'>{remainingPoints} điểm</span> để thăng hạng
                </p>
              </div>
            )}
          </motion.section>

          {/* Tier Comparison Roadmap Grid */}
          <section className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {/* Member */}
            <div className={cn(
              'bg-white border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all shadow-xs relative',
              tierLower === 'regular' || tierLower === 'member'
                ? 'border-2 border-amber-450 ring-4 ring-amber-100 shadow-md'
                : 'border-slate-200 opacity-50 hover:opacity-75'
            )}>
              <div className='bg-slate-50 text-slate-505 px-3 py-1 rounded-md text-xs font-bold border border-slate-200'>
                MEMBER
              </div>
              <span className='text-[10px] text-slate-400 font-bold tracking-tight'>
                0 - 499 pts
              </span>
              {(tierLower === 'regular' || tierLower === 'member') && (
                <div className='absolute -top-2.5 right-2 bg-amber-400 text-amber-900 text-[8px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-sm'>
                  CURRENT
                </div>
              )}
            </div>

            {/* Silver */}
            <div className={cn(
              'bg-white border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all shadow-xs relative',
              tierLower === 'silver'
                ? 'border-2 border-amber-450 ring-4 ring-amber-100 shadow-md'
                : 'border-slate-200 opacity-50 hover:opacity-75'
            )}>
              <div className='bg-[#B5D4F4]/15 text-blue-650 px-3 py-1 rounded-md text-xs font-bold border border-blue-200/50'>
                SILVER
              </div>
              <span className='text-[10px] text-slate-400 font-bold tracking-tight'>
                500 - 999 pts
              </span>
              {tierLower === 'silver' && (
                <div className='absolute -top-2.5 right-2 bg-amber-400 text-amber-900 text-[8px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-sm'>
                  CURRENT
                </div>
              )}
            </div>

            {/* Gold */}
            <div className={cn(
              'bg-white border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all shadow-xs relative',
              tierLower === 'gold'
                ? 'border-2 border-amber-450 ring-4 ring-amber-100 shadow-md'
                : 'border-slate-200 opacity-50 hover:opacity-75'
            )}>
              <div className='bg-amber-50 text-amber-800 px-3 py-1 rounded-md text-xs font-bold border border-amber-200'>
                GOLD
              </div>
              <span className='text-[10px] text-amber-800 font-bold tracking-tight'>
                1,000 - 2,499 pts
              </span>
              {tierLower === 'gold' && (
                <div className='absolute -top-2.5 right-2 bg-amber-400 text-amber-900 text-[8px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-sm'>
                  CURRENT
                </div>
              )}
            </div>

            {/* Platinum */}
            <div className={cn(
              'bg-white border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all shadow-xs relative',
              tierLower === 'platinum'
                ? 'border-2 border-amber-450 ring-4 ring-amber-100 shadow-md'
                : 'border-slate-200 opacity-50 hover:opacity-75'
            )}>
              <div className='bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-xs font-bold border border-indigo-100'>
                PLATINUM
              </div>
              <span className='text-[10px] text-slate-400 font-bold tracking-tight'>
                2,500+ pts
              </span>
              {tierLower === 'platinum' && (
                <div className='absolute -top-2.5 right-2 bg-amber-400 text-amber-900 text-[8px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-sm'>
                  CURRENT
                </div>
              )}
            </div>
          </section>

          {/* Alert Warning Expiration Row (Show dynamically if expiring points exist) */}
          {balance > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='flex items-center gap-3 p-4 bg-amber-50/80 rounded-xl border border-amber-200/50'
            >
              <AlertTriangle className='w-5 h-5 text-amber-600 shrink-0' />
              <p className='text-xs text-amber-800 leading-relaxed font-medium'>
                Hãy sử dụng điểm tích lũy của bạn sớm để không bỏ lỡ các ưu đãi dọn xe và dịch vụ rửa xe cao cấp đặc quyền nhé!
              </p>
            </motion.div>
          )}

          {/* Main Points History section */}
          <section className='bg-white rounded-2xl border border-slate-200 p-6 shadow-xs'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
              <div>
                <h2 className='text-sm font-bold text-slate-900 tracking-tight'>
                  Lịch sử điểm thưởng
                </h2>
                <p className='text-xs text-slate-400 font-medium mt-1'>
                  Biến động điểm tích lũy của bạn
                </p>
              </div>

              {/* Timeline filter controls */}
              <div className='flex flex-wrap items-center gap-1.5'>
                <button
                  onClick={() => setFilterType('all')}
                  className={cn(
                    'px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer',
                    filterType === 'all'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  )}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterType('earn')}
                  className={cn(
                    'px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer',
                    filterType === 'earn'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  )}
                >
                  Tích lũy
                </button>
                <button
                  onClick={() => setFilterType('redeem')}
                  className={cn(
                    'px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer',
                    filterType === 'redeem'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  )}
                >
                  Đã dùng
                </button>
              </div>
            </div>

            {/* List of history rows */}
            <div className='space-y-3'>
              {isLoadingHistory ? (
                <div className='py-8 text-center text-slate-400 text-sm font-normal'>
                  Đang tải lịch sử giao dịch...
                </div>
              ) : filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => {
                  const isEarn = item.transactionType === 'EARN'
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className='flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all'
                    >
                      <div className='flex items-center gap-4'>
                        {isEarn ? (
                          <div className='w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600'>
                            <Star className='w-4 h-4 fill-emerald-500 text-emerald-500' />
                          </div>
                        ) : (
                          <div className='w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600'>
                            <Gift className='w-4 h-4' />
                          </div>
                        )}

                        <div>
                          <h4 className='text-xs font-bold text-slate-800'>
                            {item.description || (isEarn ? 'Tích điểm dịch vụ rửa xe' : 'Đổi voucher ưu đãi')}
                          </h4>
                          <p className='text-[11px] text-slate-400 font-medium mt-0.5'>
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className='text-right'>
                        <span
                          className={cn(
                            'text-xs font-bold tracking-tight',
                            isEarn ? 'text-emerald-600' : 'text-indigo-600'
                          )}
                        >
                          {isEarn ? `+${item.points}` : `-${Math.abs(item.points)}`} pts
                        </span>
                        <p className='text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-0.5'>
                          {isEarn ? 'Tích lũy' : 'Đã dùng'}
                        </p>
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <div className='py-8 text-center text-gray-450 text-sm font-normal'>
                  Không có giao dịch điểm thưởng nào phù hợp.
                </div>
              )}
            </div>
          </section>

          {/* Promotional Panel Grid */}
          <section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Banner: Đổi quà ngay */}
            <div className='relative rounded-2xl overflow-hidden min-h-[160px] flex items-center p-6 border border-slate-200 group shadow-xs bg-slate-900'>
              <img
                className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-40 select-none'
                src='https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1024'
                alt='Mercedes-Benz Detailing Garage'
                referrerPolicy='no-referrer'
              />
              <div className='absolute inset-0 bg-gradient-to-r from-slate-950/90 to-transparent' />
              <div className='relative z-10 text-white max-w-[260px]'>
                <h3 className='text-sm font-bold text-white mb-1.5 tracking-tight uppercase'>
                  Đổi quà ngay
                </h3>
                <p className='text-xs text-slate-200 font-medium leading-relaxed mb-4'>
                  Sử dụng điểm tích lũy để nhận ngay các dịch vụ dọn xe hoặc mã ưu đãi đặc quyền hoàn toàn miễn phí.
                </p>
                <button
                  onClick={handleClaimGift}
                  className='flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-indigo-650/25 cursor-pointer'
                >
                  Đổi voucher 20% (500 pts) <Gift className='w-3.5 h-3.5' />
                </button>
              </div>
            </div>

            {/* Card: Quyền lợi Platinum */}
            <div className='bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-center shadow-xs'>
              <div className='flex gap-4 items-start'>
                <div className='p-3 bg-indigo-50 rounded-xl text-indigo-700 shrink-0 border border-indigo-100 flex items-center justify-center'>
                  <Award className='w-6 h-6 border-none' />
                </div>
                <div>
                  <h3 className='text-sm font-bold text-slate-800 tracking-tight'>
                    Quyền lợi Platinum đang chờ bạn
                  </h3>
                  <p className='text-xs text-slate-505 font-medium leading-relaxed mt-2'>
                    Trở thành hội viên Platinum để hưởng các đặc quyền đẳng cấp nhất:
                  </p>
                  <ul className='mt-3 space-y-1.5 text-xs text-slate-600 font-medium'>
                    <li className='flex items-center gap-1.5'>
                      <Check className='w-3.5 h-3.5 text-emerald-500' /> Ưu tiên dịch vụ trước không cần chờ đợi.
                    </li>
                    <li className='flex items-center gap-1.5'>
                      <Check className='w-3.5 h-3.5 text-emerald-500' /> Giảm trực tiếp 10% trên toàn bộ hóa đơn.
                    </li>
                    <li className='flex items-center gap-1.5'>
                      <Check className='w-3.5 h-3.5 text-emerald-500' /> Trải nghiệm khu vực phòng chờ hạng VIP cao cấp.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
