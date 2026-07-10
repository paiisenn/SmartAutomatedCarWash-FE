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
