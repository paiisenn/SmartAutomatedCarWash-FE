import { authorizeAxios } from '@/shared/lib/api-client'

export const adminPromotionService = {
  async getAdminPromotions(status?: string, search?: string): Promise<any[]> {
    const params: Record<string, string> = {}
    if (status && status !== 'ALL') params.status = status
    if (search && search.trim() !== '') params.search = search.trim()

    const { data } = await authorizeAxios.get('/admin/promotions', { params })
    return data
  },

  async togglePromotion(id: string): Promise<any> {
    const { data } = await authorizeAxios.patch(`/admin/promotions/${id}/toggle`)
    return data
  },

  async sendPromotionNotification(id: string): Promise<void> {
    await authorizeAxios.post(`/admin/promotions/${id}/send`)
  },

  async createAdminPromotion(payload: any): Promise<any> {
    const { data } = await authorizeAxios.post('/admin/promotions', payload)
    return data
  }
}
