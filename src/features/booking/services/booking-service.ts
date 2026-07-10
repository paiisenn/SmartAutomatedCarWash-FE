import * as mockBooking from '@/mocks/booking/mockService'

export type { CreateBookingRequest, BookingResponse, AvailabilitySlotResponse } from '@/mocks/booking/types'

// Re-import types for use in this file
import type { CreateBookingRequest, BookingResponse, AvailabilitySlotResponse } from '@/mocks/booking/types'

export const bookingService = {
  async getBookings(): Promise<BookingResponse[]> {
    return mockBooking.getBookings()
  },

  async createBooking(payload: CreateBookingRequest): Promise<BookingResponse> {
    return mockBooking.createBooking(payload)
  },

  async getBookingDetail(bookingId: string): Promise<BookingResponse> {
    return mockBooking.getBookingDetail(bookingId)
  },

  async cancelBooking(bookingId: string): Promise<BookingResponse> {
    return mockBooking.cancelBooking(bookingId)
  },

  async getAvailability(date: string): Promise<AvailabilitySlotResponse[]> {
    return mockBooking.getAvailability(date)
  },
}
