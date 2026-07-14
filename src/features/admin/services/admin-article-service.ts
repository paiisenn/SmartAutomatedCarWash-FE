import { authorizeAxios } from '@/shared/lib/api-client'

export const adminArticleService = {
  async getAdminArticles(status?: string, search?: string): Promise<any[]> {
    const params: Record<string, string> = {}
    if (status && status !== 'ALL') params.status = status
    if (search && search.trim() !== '') params.search = search.trim()

    const { data } = await authorizeAxios.get('/admin/articles', { params })
    return data
  },

  async createArticle(payload: any): Promise<any> {
    const { data } = await authorizeAxios.post('/admin/articles', payload)
    return data
  },

  async updateArticle(id: string, payload: any): Promise<any> {
    const { data } = await authorizeAxios.put(`/admin/articles/${id}`, payload)
    return data
  },

  async deleteArticle(id: string): Promise<void> {
    await authorizeAxios.delete(`/admin/articles/${id}`)
  },

  async toggleArticleStatus(id: string): Promise<any> {
    const { data } = await authorizeAxios.patch(`/admin/articles/${id}/toggle`)
    return data
  }
}
