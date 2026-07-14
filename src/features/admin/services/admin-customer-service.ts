import { authorizeAxios } from '@/shared/lib/api-client'

export const adminCustomerService = {
  async getAdminCustomers(search?: string, tier?: string): Promise<any[]> {
    const params: Record<string, string> = {}
    if (search && search.trim() !== '') params.search = search.trim()
    if (tier && tier !== 'ALL') params.tier = tier

    const { data } = await authorizeAxios.get('/admin/customers', { params })
    return data
  },

  async getCustomerVehicles(customerId: string): Promise<any[]> {
    const { data } = await authorizeAxios.get(`/admin/customers/${customerId}/vehicles`)
    return data.map((v: any) => ({
      vehicleId: v.vehicleId || v.vehicle_id,
      brand: v.brand,
      color: v.color,
      licensePlate: v.licensePlate || v.license_plate,
      vehicleType: v.vehicleType || v.vehicle_type
    }))
  },

  async getCustomerHistory(customerId: string): Promise<any[]> {
    const { data } = await authorizeAxios.get(`/admin/customers/${customerId}/history`)
    return data.map((b: any) => ({
      bookingId: b.bookingId || b.booking_id,
      serviceType: b.serviceType || b.service_type,
      status: b.status,
      scheduledAt: b.scheduledAt || b.scheduled_at
    }))
  },

  async createAdminCustomer(payload: any): Promise<any> {
    const { data } = await authorizeAxios.post('/admin/customers', payload)
    return data
  },

  async updateAdminCustomerStatus(customerId: string, status: boolean): Promise<any> {
    const { data } = await authorizeAxios.put(`/admin/customers/${customerId}`, null, {
      params: { status }
    })
    return data
  }
}
