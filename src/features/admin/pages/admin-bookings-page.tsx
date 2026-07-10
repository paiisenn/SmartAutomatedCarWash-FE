import React, { useState, useEffect } from 'react'
import { Plus, Calendar, MoreVertical, Info, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { AdminSidebar } from '@/features/admin/components/admin-sidebar'
import { AdminTopbar } from '@/features/admin/components/admin-topbar'
import { cn } from '@/shared/lib/utils'
import { getAdminBookings, updateAdminBookingStatus, checkCustomerByPhone, createBooking } from '@/mocks/booking/mockService'

export interface Booking {
  bookingId: string; customerId: string; customerName: string; customerPhone: string;
  customerTier: 'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM';
  vehicleId: string; licensePlate: string; vehicleType: string;
  scheduledAt: string; serviceType: string; basePrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  priorityScore: number; notes: string; createdAt: string;
  customer?: { customerId: string; fullName: string; phone: string; tier: string };
  vehicle?: { vehicleId: string; licensePlate: string; vehicleType: string; brand: string };
}

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Tất cả trạng thái');
  const [dateRangeText, setDateRangeText] = useState<string>(''); 
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustTier, setNewCustTier] = useState<'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM'>('MEMBER');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCarPlate, setNewCarPlate] = useState('');
  const [newCarModel, setNewCarModel] = useState('');
  const [newService, setNewService] = useState('BASIC');
  const [newScheduledAt, setNewScheduledAt] = useState<string>('');
  const [phoneMessage, setPhoneMessage] = useState<{ text: string; isNew: boolean } | null>(null);

  
  const fetchBookings = async () => {
    setLoading(true)
    try {
      const data = await getAdminBookings(selectedStatusFilter, dateRangeText)
      setBookings(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lịch hẹn:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [selectedStatusFilter, dateRangeText])

  const onUpdateBookingStatus = async (id: string, newStatus: Booking['status']) => {
    try {
      await updateAdminBookingStatus(id, newStatus)
      setBookings(prev => prev.map(b => b.bookingId === id ? { ...b, status: newStatus } : b))
      alert(`Đã cập nhật trạng thái đơn sang ${newStatus} thành công!`)
    } catch (error) {
      console.error('Lỗi kết nối API cập nhật trạng thái:', error)
    }
  }

  const handlePhoneChange = async (phoneVal: string) => {
    setNewCustPhone(phoneVal)
    if (phoneVal.trim().length < 9) {
      setPhoneMessage(null)
      return
    }
    try {
      const data = await checkCustomerByPhone(phoneVal.trim())
      if (data.exists) {
        setNewCustName(data.fullName)
        setNewCustTier(data.tier)
        setPhoneMessage({ text: `✨ Hệ thống nhận diện: Khách quen [${data.fullName}] - Hạng [${data.tier}]`, isNew: false })
      } else {
        setPhoneMessage({ text: "🆕 Số điện thoại mới! Hệ thống sẽ khởi tạo tài khoản khi tạo đơn.", isNew: true })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateNewBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustName || !newCarPlate || !newCarModel) return
    if (!newScheduledAt) {
      alert('Vui lòng chọn thời gian hẹn dịch vụ!')
      return
    }

    try {
      const formattedDate = `${newScheduledAt}:00`

      let activeVehicleId = "c524991d-e479-44e6-8657-969ef9ef7d00"
      if (bookings.length > 0 && bookings[0].vehicleId) {
        activeVehicleId = bookings[0].vehicleId
      }

      await createBooking({
        vehicleId: activeVehicleId,   
        serviceType: newService,      
        scheduledAt: formattedDate,   
        notes: `POS Admin: Khách ${newCustName} | Phone: ${newCustPhone || '0912222222'} | Biển số: ${newCarPlate.toUpperCase()} | Dòng xe: ${newCarModel}`
      })

      alert('Tạo lịch hẹn dịch vụ mới thành công!')
      setIsNewBookingOpen(false)
      setPhoneMessage(null) 
      fetchBookings() 
      setNewCustName('')
      setNewCustTier('MEMBER')
      setNewCustPhone('')
      setNewCarPlate('')
      setNewCarModel('')
      setNewService('BASIC')
      setNewScheduledAt('')
    } catch (error) {
      console.error(error)
    }
  }

  const getDisplayInfo = (booking: Booking) => {
    let name = booking.customerName || booking.customer?.fullName || "Khách Hàng Hệ Thống"
    let plate = booking.licensePlate || booking.vehicle?.licensePlate || "XE_MÁY"
    let type = booking.vehicleType || booking.vehicle?.vehicleType || "MOTORBIKE"
    let phone = booking.customerPhone || booking.customer?.phone || "N/A"

    const notesStr = booking.notes ? String(booking.notes) : ""
    const isPos = notesStr.startsWith("POS Admin:")

    if (isPos && notesStr.includes(" | ")) {
      try {
        const parts = notesStr.split(" | ")
        if (parts[0]) name = parts[0].replace("POS Admin: Khách ", "")
        if (parts[1]) phone = parts[1].replace("Phone:", "").trim()
        if (parts[2]) plate = parts[2].replace("Biển số: ", "")
        if (parts[3]) type = parts[3].replace("Dòng xe: ", "")
      } catch (e) {
        console.error(e)
      }
    }
    return { name, plate, type, phone, isPos }
  }

  const filteredBookings = bookings.filter((b) => {
    const info = getDisplayInfo(b)
    if (searchText.trim() !== '') {
      const q = searchText.toLowerCase()
      const matchCode = b.bookingId.toLowerCase().includes(q)
      const matchCust = info.name.toLowerCase().includes(q)
      const matchPlate = info.plate?.toLowerCase().includes(q)
      if (!matchCode && !matchCust && !matchPlate) return false
    }
    return true
  })

  const safeBookings = Array.isArray(bookings) ? bookings : []
  const activeBooking = safeBookings.find((b) => b.bookingId === activeBookingId) || null
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1

  const handleResetFilters = () => {
    setSelectedStatusFilter('Tất cả trạng thái')
    setSearchText('') 
    setDateRangeText('')
    setCurrentPage(1)
  }

  const getTierVariant = (tier: Booking['customerTier'] | string | undefined) => {
    switch (tier) {
      case 'GOLD': return 'gold'
      case 'SILVER': return 'silver'
      case 'PLATINUM': return 'platinum'
      default: return 'member'
    }
  }

  const getStatusVariant = (status: Booking['status']) => {
    switch (status) {
      case 'PENDING': return 'pending'
      case 'CONFIRMED': return 'confirmed'
      case 'IN_PROGRESS': return 'in_progress'
      case 'DONE': return 'done'
      case 'CANCELLED': return 'cancelled'
      default: return 'default'
    }
  }
  
  const activeInfo = activeBooking ? getDisplayInfo(activeBooking) : null
  const currentCustomerTier = activeBooking?.customerTier || activeBooking?.customer?.tier || 'MEMBER'

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar activeItem="booking" />
      <AdminTopbar
        searchPlaceholder="Tìm kiếm tên khách, biển số, mã đơn..."
        searchValue={searchText}
        onSearchChange={setSearchText}
        actions={
          <Button
            className="h-10 gap-2 px-4 bg-primary text-on-primary hover:opacity-90"
            type="button"
            onClick={() => setIsNewBookingOpen(true)}
          >
            <Plus size={16} />
            Booking Mới
          </Button>
        }
      />

      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-70">
        <div className="mx-auto max-w-7xl space-y-6">
          
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
            <div>
              <h2 className='text-base font-bold text-slate-900 tracking-tight mb-1 uppercase'>Quản lý Booking</h2>
              <nav className='flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider'>
                <span className='hover:text-indigo-600 cursor-pointer'>Dashboard</span>
                <span className='mx-2'>/</span>
                <span className='text-slate-800 font-bold'>Danh sách Booking</span>
              </nav>
            </div>

            <button
              onClick={() => setIsNewBookingOpen(true)}
              className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shrink-0 cursor-pointer'
            >
              <Plus className='w-4 h-4' />
              Tạo Booking Mới
            </button>
          </div>

          <div className='bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-end shadow-xs'>
            <div className='flex-1 w-full space-y-1.5'>
              <label className='block text-[10px] font-bold text-slate-400 uppercase tracking-wider'>Chọn Ngày Hẹn</label>
              <div className='relative'>
                <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4' />
                <input
                  type='date'
                  value={dateRangeText}
                  onChange={(e) => setDateRangeText(e.target.value)}
                  className='w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 hover:border-slate-300 focus:bg-white text-slate-700 font-semibold transition-all'
                />
              </div>
            </div>

            <div className='flex-1 w-full space-y-1.5'>
              <label className='block text-[10px] font-bold text-slate-400 uppercase tracking-wider'>Trạng thái</label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className='w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 hover:border-slate-300 focus:bg-white text-slate-700 font-semibold appearance-none cursor-pointer transition-all'
              >
                <option>Tất cả trạng thái</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className='flex gap-2 w-full md:w-auto shrink-0 mt-3 md:mt-0'>
              <button onClick={handleResetFilters} className='flex-1 md:flex-initial px-4 py-2 border border-slate-200 text-slate-650 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer'>
                Reset bộ lọc
              </button>
              <button onClick={fetchBookings} className='flex-1 md:flex-initial px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg cursor-pointer'>
                Lọc dữ liệu
              </button>
            </div>
          </div>

          {/* Bảng hiển thị danh sách */}
          <div className='bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs'>
            <div className='overflow-x-auto'>
              {loading ? (
                <div className="py-12 text-center text-xs font-semibold text-slate-400 animate-pulse">Đang tải dữ liệu thực tế từ cơ sở dữ liệu...</div>
              ) : (
                <table className='w-full text-left border-collapse'>
                  <thead>
                    <tr className='bg-slate-50/75 border-b border-slate-200'>
                      <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>Mã Booking</th>
                      <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>Khách hàng</th>
                      <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>Xe</th>
                      <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>Dịch vụ</th>
                      <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>Giờ hẹn</th>
                      <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>Status</th>
                      <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase text-center'>Priority</th>
                      <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase text-right'>Thao tác</th>
                    </tr>
                  </thead>
                    <tbody className='divide-y divide-slate-100'>
                      {currentItems.map((booking) => {
                        const rowInfo = getDisplayInfo(booking)

                        const displayTier = booking.customer?.tier || booking.customerTier || 'MEMBER'
                        
                        return (
                          <tr
                            key={booking.bookingId}
                            onClick={() => setActiveBookingId(booking.bookingId)}
                            className={cn(
                              'hover:bg-slate-50/60 transition-colors cursor-pointer group',
                              activeBookingId === booking.bookingId ? 'bg-indigo-50/15' : ''
                            )}
                          >
                            <td className='px-5 py-4 text-xs font-bold text-indigo-600'>#{booking.bookingId.substring(0, 8)}...</td>
                            <td className='px-5 py-4'>
                              <div className='flex items-center gap-1.5'>
                                <span className='text-xs font-bold text-slate-850'>{rowInfo.name}</span>
                                {/* 2. Sử dụng biến displayTier đã định nghĩa ở trên */}
                                <Badge variant={getTierVariant(displayTier) as any}>{displayTier}</Badge>
                              </div>
                            </td>
                            <td className='px-5 py-4'>
                              <div className='text-xs font-bold text-slate-800'>{rowInfo.plate}</div>
                              <div className='text-[10px] text-slate-455 font-bold uppercase mt-0.5'>{rowInfo.type}</div>
                            </td>
                            <td className='px-5 py-4 text-xs font-semibold text-slate-650'>{booking.serviceType}</td>
                            <td className='px-5 py-4'>
                              <div className='text-xs font-bold text-slate-800'>{new Date(booking.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                              <div className='text-[10px] text-slate-450 font-semibold mt-0.5'>{new Date(booking.scheduledAt).toLocaleDateString()}</div>
                            </td>
                            <td className='px-5 py-4'><Badge variant={getStatusVariant(booking.status) as any}>{booking.status}</Badge></td>
                            <td className='px-5 py-4 text-center'>
                              <div className='inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200'>
                                <span className='text-[10px] font-bold text-slate-700'>{booking.priorityScore}</span>
                                <Info className='w-3 h-3 text-indigo-600 opacity-80' />
                              </div>
                            </td>
                            <td className='px-5 py-4 text-right' onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => setActiveBookingId(booking.bookingId)} className='p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer'>
                                <MoreVertical className='w-4 h-4' />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                </table>
              )}
            </div>

            <div className='px-5 py-4 flex items-center justify-between border-t border-slate-200 bg-white'>
              <p className='text-[11px] text-slate-400 font-bold uppercase tracking-wider'>
                Hiển thị {filteredBookings.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredBookings.length)} trong số {filteredBookings.length} đơn đặt
              </p>
              <div className='flex items-center gap-1'>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className='p-1.5 rounded-lg border border-slate-200 cursor-pointer'><ChevronLeft className='w-4 h-4' /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={cn('w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-colors cursor-pointer', currentPage === pageNum ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-50 text-slate-650')}>{pageNum}</button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className='p-1.5 rounded-lg border border-slate-200 cursor-pointer'><ChevronRight className='w-4 h-4' /></button>
              </div>
            </div>
          </div>

          {/* Drawer chi tiết Side Panel */}
          <AnimatePresence>
            {activeBooking && activeInfo && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setActiveBookingId(null); setPhoneMessage(null); }} className='fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-50' />
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className='fixed top-0 right-0 h-screen w-full sm:w-120 bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200'>
                  <div className='p-6 border-b border-slate-100 flex items-center justify-between'>
                    <div>
                      <h3 className='text-xs font-bold uppercase text-slate-800 tracking-wider'>Chi tiết Lịch hẹn Rửa xe</h3>
                      <p className='text-xs text-indigo-600 font-bold mt-0.5'>#{activeBooking.bookingId}</p>
                    </div>
                    <button onClick={() => { setActiveBookingId(null); setPhoneMessage(null); }} className='p-1.5 hover:bg-slate-100 text-slate-400 cursor-pointer'><X className='w-4 h-4' /></button>
                  </div>

                  <div className='flex-1 overflow-y-auto p-6 space-y-6'>
                    <div className='bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3'>
                      <h4 className='text-[10px] uppercase font-bold text-slate-400'>Khách hàng chủ xe</h4>
                      <div className='flex fitness-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm'>{activeInfo.name?.charAt(0)}</div>
                        <div>
                          <p className='text-xs font-bold text-slate-850'>{activeInfo.name}</p>
                          <p className='text-[11px] text-slate-455 font-semibold mt-0.5'>{activeInfo.phone}</p>
                          <div className='mt-1.5'><Badge variant={getTierVariant(currentCustomerTier) as any}>{currentCustomerTier}</Badge></div>
                        </div>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <h4 className='text-[10px] uppercase font-bold text-slate-400'>Thông tin xe & Dịch vụ</h4>
                      <div className='space-y-2 border-t border-slate-150 pt-2 text-xs'>
                        <div className='flex justify-between items-center py-1.5 border-b border-dashed border-slate-100'><span className='text-slate-450 font-bold uppercase text-[10px]'>Biển kiểm soát</span><span className='font-bold text-slate-800'>{activeInfo.plate}</span></div>
                        <div className='flex justify-between items-center py-1.5 border-b border-dashed border-slate-100'><span className='text-slate-450 font-bold uppercase text-[10px]'>Gói dịch vụ</span><span className='font-bold text-slate-800'>{activeBooking.serviceType}</span></div>
                        <div className='flex justify-between items-center py-1.5 border-b border-dashed border-slate-100'><span className='text-slate-450 font-bold uppercase text-[10px]'>Giá trị hóa đơn</span><span className='font-bold text-emerald-600'>{activeBooking.basePrice ? activeBooking.basePrice.toLocaleString() : (activeBooking.serviceType === 'PREMIUM' ? '50,000' : (activeBooking.serviceType === 'FULL_DETAIL' ? '80,000' : '30,000'))} VND</span></div>
                      </div>
                    </div>

                    {activeBooking.notes && (
                      <div className='space-y-1.5'>
                        <h4 className='text-[10px] uppercase font-bold text-slate-400'>Ghi chú đặt lịch</h4>
                        <div className='p-3.5 bg-indigo-50/20 rounded-xl border border-indigo-150/40 italic text-xs text-slate-600 font-semibold'>"{activeBooking.notes}"</div>
                      </div>
                    )}
                  </div>

                  <div className='p-6 border-t border-slate-100 bg-white flex gap-3'>
                    {activeBooking.status === 'PENDING' ? (
                      <button onClick={() => onUpdateBookingStatus(activeBooking.bookingId, 'CONFIRMED')} className='flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all cursor-pointer'>XÁC NHẬN BOOKING</button>
                    ) : activeBooking.status === 'CONFIRMED' ? (
                      <button onClick={() => onUpdateBookingStatus(activeBooking.bookingId, 'IN_PROGRESS')} className='flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold text-xs hover:bg-amber-600 transition-all cursor-pointer'>BẮT ĐẦU RỬA XE</button>
                    ) : activeBooking.status === 'IN_PROGRESS' ? (
                      <button onClick={() => onUpdateBookingStatus(activeBooking.bookingId, 'DONE')} className='flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all cursor-pointer'>XÁC NHẬN HOÀN THÀNH (TÍCH ĐIỂM + LÊN HẠNG)</button>
                    ) : (
                      <div className='flex-1 text-center py-2 text-xs font-bold text-slate-400'>Đơn đặt lịch đã hoàn tất.</div>
                    )}
                    {['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(activeBooking.status) && (
                      <button onClick={() => onUpdateBookingStatus(activeBooking.bookingId, 'CANCELLED')} className='px-4 py-3 border border-rose-200 text-rose-600 hover:bg-rose-50/30 rounded-xl font-bold text-xs cursor-pointer'>HỦY LỊCH</button>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Modal popup Form: Tạo Đơn Dịch Vụ Mới (POS) */}
          <AnimatePresence>
            {isNewBookingOpen && (
              <div className='fixed inset-0 bg-slate-950/20 backdrop-blur-xs flex items-center justify-center z-50 p-4'>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className='bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4'>
                  <div className='flex justify-between items-center pb-2 border-b border-slate-100'>
                    <h4 className='text-xs font-bold uppercase tracking-tight text-slate-800'>Tạo mới Đơn dịch vụ Booking (POS)</h4>
                    <button onClick={() => { setIsNewBookingOpen(false); setPhoneMessage(null); setNewScheduledAt(''); }} className='text-slate-450 hover:text-slate-600 text-xs font-bold cursor-pointer'>Đóng</button>
                  </div>

                  <form onSubmit={handleCreateNewBookingSubmit} className='space-y-3 text-xs pt-1'>
                    <div>
                      <label className='block text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-1'>Số điện thoại</label>
                      <input 
                        type='tel' 
                        required
                        placeholder='VD: 0912223333' 
                        value={newCustPhone} 
                        onChange={(e) => handlePhoneChange(e.target.value)} 
                        className='w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors' 
                      />
                      {phoneMessage && (
                        <p className={cn(
                          "text-[10px] font-bold mt-1 tracking-tight",
                          phoneMessage.isNew ? "text-amber-600" : "text-emerald-600"
                        )}>
                          {phoneMessage.text}
                        </p>
                      )}
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='block text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-1'>Tên khách hàng</label>
                        <input type='text' required placeholder='VD: Nguyễn Văn A' value={newCustName} onChange={(e) => setNewCustName(e.target.value)} className='w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors' />
                      </div>
                      <div>
                        <label className='block text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-1'>Hội viên Hạng</label>
                        <select value={newCustTier} onChange={(e) => setNewCustTier(e.target.value as any)} className='w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-bold focus:outline-none appearance-none cursor-pointer focus:bg-white focus:border-indigo-500 transition-colors'>
                          <option value='MEMBER'>MEMBER</option>
                          <option value='SILVER'>SILVER</option>
                          <option value='GOLD'>GOLD</option>
                          <option value='PLATINUM'>PLATINUM</option>
                        </select>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='block text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-1'>Biển kiểm soát</label>
                        <input type='text' required placeholder='VD: 30A-999.99' value={newCarPlate} onChange={(e) => setNewCarPlate(e.target.value)} className='w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors' />
                      </div>
                      <div>
                        <label className='block text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-1'>Dòng xe</label>
                        <input type='text' required placeholder='VD: Mercedes C300' value={newCarModel} onChange={(e) => setNewCarModel(e.target.value)} className='w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors' />
                      </div>
                    </div>

                    <div>
                      <label className='block text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-1'>Thời gian hẹn rửa xe</label>
                      <input 
                        type='datetime-local' 
                        required
                        value={newScheduledAt} 
                        onChange={(e) => setNewScheduledAt(e.target.value)} 
                        className='w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors text-slate-700' 
                      />
                    </div>

                    <div>
                      <label className='block text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-1'>Chọn loại dịch vụ</label>
                      <select value={newService} onChange={(e) => setNewService(e.target.value)} className='w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors appearance-none cursor-pointer'>
                        <option value='BASIC'>Rửa xe tiêu chuẩn (BASIC)</option>
                        <option value='PREMIUM'>Rửa xe cao cấp (PREMIUM)</option>
                        <option value='FULL_DETAIL'>Chăm sóc toàn diện (FULL_DETAIL)</option>
                      </select>
                    </div>

                    <div className='flex gap-2 pt-3'>
                      <button type='button' onClick={() => { setIsNewBookingOpen(false); setPhoneMessage(null); setNewScheduledAt(''); }} className='flex-1 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors'>Hủy bỏ</button>
                      <button type='submit' className='flex-1 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg cursor-pointer'>Tạo Booking</button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}