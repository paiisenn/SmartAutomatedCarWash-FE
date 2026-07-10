import { delay, deepClone } from '../_helpers'
import type { Promotion } from './types'
import { mockPromotions } from './mockData'

export async function getAdminPromotions(status?: string, search?: string): Promise<Promotion[]> {
  await delay(300)
  let filtered = deepClone(mockPromotions)

  if (status && status !== 'ALL') {
    filtered = filtered.filter((p) => p.status === status)
  }

  if (search && search.trim() !== '') {
    const q = search.toLowerCase()
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q))
  }

  return filtered
}

export async function togglePromotion(id: string): Promise<Promotion> {
  await delay(300)
  const promo = mockPromotions.find((p) => p.id === id)
  if (!promo) {
    throw new Error('Không tìm thấy chương trình khuyến mãi')
  }
  promo.isActive = !promo.isActive
  promo.status = promo.isActive ? 'ACTIVE' : 'EXPIRED'
  return deepClone(promo)
}

export async function sendPromotionNotification(id: string): Promise<void> {
  await delay(500)
  const promo = mockPromotions.find((p) => p.id === id)
  if (!promo) {
    throw new Error('Không tìm thấy chương trình khuyến mãi')
  }
  // Simulate sending notification
}

export async function createAdminPromotion(payload: any): Promise<Promotion> {
  await delay(400)
  const newPromo: Promotion = {
    id: `PROMO-${Date.now()}`,
    name: payload.name,
    status: 'ACTIVE',
    isActive: true,
    type: payload.promoType || 'DISCOUNT',
    targetTiers: typeof payload.targetTiers === 'string' ? payload.targetTiers.split(',') : payload.targetTiers,
    value: payload.value,
    usageLimit: payload.usageLimit,
    usageCount: 0,
    startsAt: payload.startsAt,
    endsAt: payload.endsAt,
    createdAt: new Date().toISOString(),
  }
  mockPromotions.push(newPromo)
  return deepClone(newPromo)
}
