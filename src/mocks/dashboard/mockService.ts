import { delay, deepClone } from '../_helpers'
import type { DashboardStats } from './types'
import { mockDashboardStats } from './mockData'

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(300)
  return deepClone(mockDashboardStats)
}
