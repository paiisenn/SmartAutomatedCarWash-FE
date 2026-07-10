import { delay, deepClone, paginate } from '../_helpers'
import type { PointBalanceResponse, PointHistoryResponse, Page, RedeemPointsRequest, RedeemPointsResponse } from './types'
import { mockLoyaltyBalances, mockPointHistory } from './mockData'

export async function getLoyaltyBalance(customerId: string): Promise<PointBalanceResponse> {
  await delay(300)
  const balance = mockLoyaltyBalances.find((b) => b.customerId === customerId)
  if (balance) {
    return deepClone(balance)
  }
  // Return default balance for unknown customers
  return {
    customerId,
    balance: 0,
    currentPoints: 0,
    pointsExpiring: 0,
    tier: 'MEMBER',
    nextTierPoints: 500,
    nextTier: 'SILVER',
  }
}

export async function getPointHistory(
  customerId: string,
  params?: { page?: number; size?: number; sort?: string }
): Promise<Page<PointHistoryResponse>> {
  await delay(300)
  let filtered = mockPointHistory.filter((h) => h.customerId === customerId)

  // Sort by createdAt descending by default
  if (params?.sort) {
    const [field, direction] = params.sort.split(',')
    filtered.sort((a, b) => {
      const aVal = a[field as keyof PointHistoryResponse] as string
      const bVal = b[field as keyof PointHistoryResponse] as string
      return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
  } else {
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  return paginate(deepClone(filtered), params?.page ?? 0, params?.size ?? 10)
}

export async function redeemPoints(payload: RedeemPointsRequest): Promise<RedeemPointsResponse> {
  await delay(500)
  const balance = mockLoyaltyBalances.find((b) => b.customerId === payload.customerId)
  if (!balance) {
    throw new Error('Không tìm thấy thông tin điểm thưởng')
  }

  const pointsToRedeem = 500 // Default redeem amount
  const currentBalance = balance.balance ?? balance.currentPoints ?? 0
  if (currentBalance < pointsToRedeem) {
    throw new Error('Không đủ điểm để đổi thưởng')
  }

  const newBalance = currentBalance - pointsToRedeem
  balance.balance = newBalance
  balance.currentPoints = newBalance

  // Add to history
  mockPointHistory.unshift({
    id: `ph-${Date.now()}`,
    customerId: payload.customerId,
    points: -pointsToRedeem,
    transactionType: 'REDEEM',
    description: `Đổi thưởng: ${payload.redeemType}`,
    createdAt: new Date().toISOString(),
  })

  return {
    customerId: payload.customerId,
    pointsRedeemed: pointsToRedeem,
    newBalance,
    rewardDetails: `Đổi thành công ${pointsToRedeem} điểm`,
  }
}
