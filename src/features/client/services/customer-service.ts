import * as mockCustomer from '@/mocks/customer/mockService'

export type { CustomerResponse, CustomerUpdateRequest } from '@/mocks/customer/types'

// Re-import types for use in this file
import type { CustomerResponse, CustomerUpdateRequest } from '@/mocks/customer/types'

export const customerService = {
  async getCustomer(id: string): Promise<CustomerResponse> {
    return mockCustomer.getCustomer(id)
  },

  async updateCustomer(id: string, payload: CustomerUpdateRequest): Promise<CustomerResponse> {
    return mockCustomer.updateCustomer(id, payload)
  },
}
