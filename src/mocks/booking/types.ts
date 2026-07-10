export interface CreateBookingRequest {
  vehicleId: string
  scheduledAt: string
  serviceType: string
  notes?: string
}

export interface BookingResponse {
  id: string
  vehicleId: string
  licensePlate?: string
  vehicleDetails?: {
    licensePlate: string
    brand?: string
    color?: string
    vehicleType?: string
  }
  scheduledAt: string
  serviceType: string
  notes?: string
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
  branchName?: string
  amount?: number
}

export interface AvailabilitySlotResponse {
  time: string
  available: boolean
}
