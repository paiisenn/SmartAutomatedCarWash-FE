export interface Promotion {
  id: string
  name: string
  status: 'ACTIVE' | 'EXPIRED'
  isActive: boolean
  type: string
  targetTiers: string[]
  value: number
  usageLimit: number
  usageCount: number
  startsAt?: string | null
  endsAt?: string | null
  createdAt: string
}
