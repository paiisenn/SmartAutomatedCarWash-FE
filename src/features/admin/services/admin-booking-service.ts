import { authorizeAxios } from '@/shared/lib/api-client'

export const adminBookingService = {
  async getAdminBookings(status?: string, date?: string): Promise<any[]> {
    const params: Record<string, string> = {}
    if (status && status !== 'Tất cả trạng thái' && status !== 'ALL') {
      params.status = status.toUpperCase().replace(' ', '_')
    }
    if (date && date.trim() !== '') {
      params.date = date
    }

    const { data } = await authorizeAxios.get('/admin/bookings', { params })
    return data
  },

  async updateAdminBookingStatus(id: string, status: string): Promise<any> {
    const { data } = await authorizeAxios.patch(`/admin/bookings/${id}/status`, { status })
    return data
  },

  async checkCustomerByPhone(phone: string): Promise<any> {
    const { data } = await authorizeAxios.get('/admin/customers/check', {
      params: { phone }
    })
    return data
  }
}
