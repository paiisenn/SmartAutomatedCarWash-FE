export interface Revenue7DaysItem {
  day: string
  height: string
  value: string
  active?: boolean
}

export interface TodayQueueItem {
  time: string
  plate: string
  service: string
  status: string
  tone: 'warning' | 'info' | 'success'
}

export interface DashboardStats {
  todayRevenue: number
  totalWashCount: number
  motorbikeCount: number
  carCount: number
  newCustomerCount: number
  issuedPoints: number
  revenue7Days: Revenue7DaysItem[]
  todayQueue: TodayQueueItem[]
  memberCount: number
  silverCount: number
  goldCount: number
  platinumCount: number
}
