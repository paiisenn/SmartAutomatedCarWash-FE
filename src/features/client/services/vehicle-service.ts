import * as mockVehicle from '@/mocks/vehicle/mockService'

export type { VehicleRequest, VehicleResponse } from '@/mocks/vehicle/types'

// Re-import types for use in this file
import type { VehicleRequest, VehicleResponse } from '@/mocks/vehicle/types'

export const vehicleService = {
  async getVehicles(): Promise<VehicleResponse[]> {
    return mockVehicle.getVehicles()
  },

  async addVehicle(payload: VehicleRequest): Promise<VehicleResponse> {
    return mockVehicle.addVehicle(payload)
  },

  async updateVehicle(vehicleId: string, payload: VehicleRequest): Promise<VehicleResponse> {
    return mockVehicle.updateVehicle(vehicleId, payload)
  },

  async setPrimaryVehicle(vehicleId: string): Promise<VehicleResponse> {
    return mockVehicle.setPrimaryVehicle(vehicleId)
  },

  async deleteVehicle(vehicleId: string): Promise<void> {
    return mockVehicle.deleteVehicle(vehicleId)
  },
}
