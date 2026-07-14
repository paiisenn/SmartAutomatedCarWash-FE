import { authorizeAxios } from '@/shared/lib/api-client'

export const dashboardService = {
  async getDashboardStats(): Promise<any> {
    const { data } = await authorizeAxios.get('/admin/dashboard/stats')
    return data
  }
}
