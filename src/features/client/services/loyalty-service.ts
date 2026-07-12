import { authorizeAxios } from '@/shared/lib/api-client'

export interface PointBalanceResponse {
  customerId: string
  balance?: number
  currentPoints?: number
  pointsExpiring?: number
  expiringAt?: string
  tier?: string
  nextTierPoints?: number
  nextTier?: string
}

export interface PointHistoryResponse {
  id: string
  customerId: string
  points: number
  transactionType: 'EARN' | 'REDEEM'
  amountPaid?: number
  description?: string
  createdAt: string
}

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

export interface RedeemPointsRequest {
  customerId: string
  redeemType: string
  referenceId: string
}

export interface RedeemPointsResponse {
  customerId: string
  pointsRedeemed: number
  newBalance: number
  rewardDetails?: string
}

export const loyaltyService = {
  async getLoyaltyBalance(customerId: string): Promise<PointBalanceResponse> {
    const { data } = await authorizeAxios.get<PointBalanceResponse>(`/loyalty/balance/${customerId}`)
    return data
  },

  async getPointHistory(
    customerId: string,
    params?: { page?: number; size?: number; sort?: string }
  ): Promise<Page<PointHistoryResponse>> {
    const { data } = await authorizeAxios.get<Page<PointHistoryResponse>>(`/customers/${customerId}/points`, {
      params,
    })
    return data
  },

  async redeemPoints(payload: RedeemPointsRequest): Promise<RedeemPointsResponse> {
    const { data } = await authorizeAxios.post<RedeemPointsResponse>('/loyalty/redeem', payload)
    return data
  },
}
