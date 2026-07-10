import { delay, generateId, deepClone } from '../_helpers'
import type { CreateBookingRequest, BookingResponse, AvailabilitySlotResponse } from './types'
import { mockBookings, mockAvailabilitySlots } from './mockData'
import { mockCustomers } from '../customer/mockData'

export async function getBookings(): Promise<BookingResponse[]> {
  await delay(300)
  return deepClone(mockBookings)
}

export async function createBooking(payload: CreateBookingRequest): Promise<BookingResponse> {
  await delay(500)
  const newBooking: BookingResponse = {
    id: `bk-${generateId().slice(0, 8)}`,
    vehicleId: payload.vehicleId,
    scheduledAt: payload.scheduledAt,
    serviceType: payload.serviceType,
    notes: payload.notes,
    status: 'PENDING',
    branchName: 'AutoWash Quận 1',
    amount: payload.serviceType === 'BASIC' ? 150000 : payload.serviceType === 'PREMIUM' ? 350000 : 1250000,
  }
  mockBookings.unshift(newBooking)
  return deepClone(newBooking)
}

export async function getBookingDetail(bookingId: string): Promise<BookingResponse> {
  await delay(200)
  const booking = mockBookings.find((b) => b.id === bookingId)
  if (!booking) {
    throw new Error('Không tìm thấy lịch đặt')
  }
  return deepClone(booking)
}

export async function cancelBooking(bookingId: string): Promise<BookingResponse> {
  await delay(400)
  const booking = mockBookings.find((b) => b.id === bookingId)
  if (!booking) {
    throw new Error('Không tìm thấy lịch đặt')
  }
  booking.status = 'CANCELLED'
  return deepClone(booking)
}

export async function getAvailability(date: string): Promise<AvailabilitySlotResponse[]> {
  await delay(300)
  void date // parameter kept for API compatibility
  return deepClone(mockAvailabilitySlots)
}

// --- ADMIN BOOKING FUNCTIONS ---

export async function getAdminBookings(status?: string, date?: string): Promise<any[]> {
  await delay(300)
  let filtered = deepClone(mockBookings)

  if (status && status !== 'Tất cả trạng thái' && status !== 'ALL') {
    filtered = filtered.filter((b) => b.status === status)
  }

  if (date && date.trim() !== '') {
    filtered = filtered.filter((b) => b.scheduledAt.startsWith(date))
  }

  // Map to match the expected Admin Booking format
  return filtered.map((b) => {
    // Attempt to parse customer details or fall back
    const isPos = b.notes?.startsWith('POS Admin:')
    let name = 'Nguyễn Văn An'
    let phone = '0912345678'
    let tier = 'GOLD'
    let plate = b.licensePlate || b.vehicleDetails?.licensePlate || '51G-123.45'
    let vehicleType = b.vehicleDetails?.vehicleType || 'Sedan'

    if (isPos && b.notes) {
      try {
        const parts = b.notes.split(' | ')
        if (parts[0]) name = parts[0].replace('POS Admin: Khách ', '')
        if (parts[1]) phone = parts[1].replace('Phone:', '').trim()
        if (parts[2]) plate = parts[2].replace('Biển số: ', '')
        if (parts[3]) vehicleType = parts[3].replace('Dòng xe: ', '')
      } catch (e) {
        console.error(e)
      }
    }

    return {
      bookingId: b.id,
      customerId: 'cust-001',
      customerName: name,
      customerPhone: phone,
      customerTier: tier as any,
      vehicleId: b.vehicleId,
      licensePlate: plate,
      vehicleType: vehicleType,
      scheduledAt: b.scheduledAt,
      serviceType: b.serviceType,
      basePrice: b.amount || 150000,
      status: b.status,
      priorityScore: 50,
      notes: b.notes || '',
      createdAt: b.scheduledAt,
    }
  })
}

export async function updateAdminBookingStatus(id: string, newStatus: string): Promise<any> {
  await delay(300)
  const booking = mockBookings.find((b) => b.id === id)
  if (!booking) {
    throw new Error('Không tìm thấy lịch đặt')
  }
  booking.status = newStatus as any
  return deepClone(booking)
}

export async function checkCustomerByPhone(phone: string): Promise<any> {
  await delay(200)
  const customer = mockCustomers.find((c) => c.phone === phone)
  if (customer) {
    return {
      exists: true,
      fullName: customer.fullName,
      tier: customer.tier,
    }
  }
  return {
    exists: false,
  }
}
