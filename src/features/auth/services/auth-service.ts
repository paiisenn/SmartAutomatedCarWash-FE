import * as mockAuth from '@/mocks/auth/mockService'

export type { RegisterPayload, LoginPayload, AuthResponse, UserProfile } from '@/mocks/auth/types'

// Re-import types for use in this file
import type { RegisterPayload, LoginPayload, AuthResponse } from '@/mocks/auth/types'

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return mockAuth.register(payload)
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    return mockAuth.login(payload)
  },

  async getMe(): Promise<{ id?: string; customerId?: string; name?: string; fullName?: string; email?: string; phone?: string; role?: string }> {
    return mockAuth.getMe()
  },

  async updateMe(payload: { fullName: string; phone: string; email: string }): Promise<{ id?: string; customerId?: string; name?: string; fullName?: string; email?: string; phone?: string; role?: string }> {
    return mockAuth.updateMe(payload)
  },
}
