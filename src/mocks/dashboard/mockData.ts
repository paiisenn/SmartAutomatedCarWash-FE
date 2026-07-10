import type { DashboardStats } from './types'

export const mockDashboardStats: DashboardStats = {
  todayRevenue: 15200000,
  totalWashCount: 48,
  motorbikeCount: 32,
  carCount: 16,
  newCustomerCount: 12,
  issuedPoints: 2450,
  revenue7Days: [
    { day: '01/01', height: '40%', value: '8M' },
    { day: '02/01', height: '65%', value: '12M' },
    { day: '03/01', height: '55%', value: '10M' },
    { day: '04/01', height: '90%', value: '18M' },
    { day: '05/01', height: '45%', value: '9M' },
    { day: '06/01', height: '75%', value: '14M' },
    { day: 'Hôm nay', height: '82%', value: '15.2M', active: true },
  ],
  todayQueue: [
    { time: '09:30', plate: '51G-123.45', service: 'Rửa tiêu chuẩn - Xe máy', status: 'Chờ rửa', tone: 'warning' },
    { time: '10:15', plate: '30A-999.88', service: 'Phủ Ceramic - Ô tô', status: 'Đang rửa', tone: 'info' },
    { time: '08:45', plate: '51H-555.21', service: 'Dọn nội thất - Ô tô', status: 'Hoàn tất', tone: 'success' },
  ],
  memberCount: 40,
  silverCount: 25,
  goldCount: 20,
  platinumCount: 15,
}
