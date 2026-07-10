import * as mockLoyalty from '@/mocks/loyalty/mockService'

export type {
  PointBalanceResponse,
  PointHistoryResponse,
  Page,
  RedeemPointsRequest,
  RedeemPointsResponse,
} from '@/mocks/loyalty/types'

// Re-import types for use in this file
import type {
  PointBalanceResponse,
  PointHistoryResponse,
  Page,
  RedeemPointsRequest,
  RedeemPointsResponse,
} from '@/mocks/loyalty/types'

export const loyaltyService = {
  async getLoyaltyBalance(customerId: string): Promise<PointBalanceResponse> {
    return mockLoyalty.getLoyaltyBalance(customerId)
  },

  async getPointHistory(
    customerId: string,
    params?: { page?: number; size?: number; sort?: string }
  ): Promise<Page<PointHistoryResponse>> {
    return mockLoyalty.getPointHistory(customerId, params)
  },

  async redeemPoints(payload: RedeemPointsRequest): Promise<RedeemPointsResponse> {
    return mockLoyalty.redeemPoints(payload)
  },
}
