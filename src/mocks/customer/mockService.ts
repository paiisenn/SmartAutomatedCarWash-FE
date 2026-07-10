import { delay, deepClone } from '../_helpers'
import type { CustomerResponse, CustomerUpdateRequest } from './types'
import { mockCustomers } from './mockData'

export async function getCustomer(id: string): Promise<CustomerResponse> {
  await delay(300)
  const customer = mockCustomers.find((c) => c.id === id)
  if (!customer) {
    throw new Error('Không tìm thấy khách hàng')
  }
  return deepClone(customer)
}

export async function updateCustomer(id: string, payload: CustomerUpdateRequest): Promise<CustomerResponse> {
  await delay(300)
  const customer = mockCustomers.find((c) => c.id === id)
  if (!customer) {
    throw new Error('Không tìm thấy khách hàng')
  }
  customer.fullName = payload.fullName
  customer.name = payload.fullName
  customer.phone = payload.phone
  customer.email = payload.email
  return deepClone(customer)
}

// --- ADMIN CUSTOMER SERVICE FUNCTIONS ---

export async function getAdminCustomers(search?: string, tier?: string): Promise<any[]> {
  await delay(300)
  let filtered = deepClone(mockCustomers)

  if (search && search.trim() !== '') {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    )
  }

  if (tier && tier !== 'ALL') {
    filtered = filtered.filter((c) => c.tier === tier)
  }

  // Map to format expected by AdminCustomerPage
  return filtered.map((c) => ({
    customerId: c.id,
    fullName: c.fullName,
    phone: c.phone,
    email: c.email,
    tier: c.tier || 'MEMBER',
    totalPoints: c.points || 0,
    totalVisits: c.totalVisits || 0,
    isActive: c.isActive !== false,
  }))
}

export async function createAdminCustomer(payload: any): Promise<any> {
  await delay(300)
  const newCustomer = {
    id: `cust-${Date.now()}`,
    fullName: payload.fullName,
    name: payload.fullName,
    phone: payload.phone,
    email: payload.email || null,
    tier: 'MEMBER' as const,
    points: 0,
    totalVisits: 0,
    isActive: true,
  }
  mockCustomers.push(newCustomer)
  return {
    customerId: newCustomer.id,
    fullName: newCustomer.fullName,
    phone: newCustomer.phone,
    email: newCustomer.email,
    tier: newCustomer.tier,
    totalPoints: newCustomer.points,
    totalVisits: newCustomer.totalVisits,
    isActive: newCustomer.isActive,
  }
}

export async function updateAdminCustomerStatus(customerId: string, status: boolean): Promise<any> {
  await delay(300)
  const customer = mockCustomers.find((c) => c.id === customerId)
  if (!customer) {
    throw new Error('Không tìm thấy khách hàng')
  }
  customer.isActive = status
  return {
    customerId: customer.id,
    fullName: customer.fullName,
    phone: customer.phone,
    email: customer.email,
    tier: customer.tier,
    totalPoints: customer.points,
    totalVisits: customer.totalVisits,
    isActive: customer.isActive,
  }
}

export async function getCustomerVehicles(customerId: string): Promise<any[]> {
  await delay(200)
  // For simplicity, return mock vehicles depending on the customerId
  if (customerId === 'cust-001') {
    return [
      { vehicleId: 'v-001', brand: 'Mercedes-Benz C200', color: 'Đen', licensePlate: '51G-123.45', vehicleType: 'Sedan' },
      { vehicleId: 'v-002', brand: 'VinFast VF8', color: 'Trắng', licensePlate: '51H-999.99', vehicleType: 'SUV' }
    ]
  }
  if (customerId === 'cust-002') {
    return [
      { vehicleId: 'v-005', brand: 'Honda SH 350i', color: 'Đỏ', licensePlate: '51F-777.77', vehicleType: 'Xe máy' }
    ]
  }
  if (customerId === 'cust-003') {
    return [
      { vehicleId: 'v-003', brand: 'BMW X5', color: 'Xanh đen', licensePlate: '30A-888.88', vehicleType: 'SUV' }
    ]
  }
  return [
    { vehicleId: `v-${customerId.slice(-3)}`, brand: 'Toyota Camry', color: 'Bạc', licensePlate: '29L-555.55', vehicleType: 'Sedan' }
  ]
}

export async function getCustomerHistory(customerId: string): Promise<any[]> {
  await delay(200)
  // Return history entries matching customer
  if (customerId === 'cust-001') {
    return [
      { bookingId: 'bk-001', serviceType: 'PREMIUM', status: 'PENDING', scheduledAt: '2024-01-15T09:00:00' },
      { bookingId: 'bk-004', serviceType: 'PREMIUM', status: 'DONE', scheduledAt: '2024-01-10T08:30:00' }
    ]
  }
  if (customerId === 'cust-002') {
    return [
      { bookingId: 'bk-002', serviceType: 'BASIC', status: 'CONFIRMED', scheduledAt: '2024-01-15T10:30:00' }
    ]
  }
  return [
    { bookingId: `bk-${customerId.slice(-3)}`, serviceType: 'BASIC', status: 'DONE', scheduledAt: '2024-01-12T15:30:00' }
  ]
}
