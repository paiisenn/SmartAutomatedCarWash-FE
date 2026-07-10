import { delay, generateId, deepClone } from '../_helpers'
import type { VehicleRequest, VehicleResponse } from './types'
import { mockVehicles } from './mockData'

export async function getVehicles(): Promise<VehicleResponse[]> {
  await delay(300)
  return deepClone(mockVehicles)
}

export async function addVehicle(payload: VehicleRequest): Promise<VehicleResponse> {
  await delay(400)
  const newVehicle: VehicleResponse = {
    id: generateId(),
    licensePlate: payload.licensePlate,
    vehicleType: payload.vehicleType,
    brand: payload.brand,
    color: payload.color,
    primary: payload.primary ?? false,
  }
  if (newVehicle.primary) {
    mockVehicles.forEach((v) => (v.primary = false))
  }
  mockVehicles.push(newVehicle)
  return deepClone(newVehicle)
}

export async function updateVehicle(vehicleId: string, payload: VehicleRequest): Promise<VehicleResponse> {
  await delay(300)
  const vehicle = mockVehicles.find((v) => v.id === vehicleId)
  if (!vehicle) {
    throw new Error('Không tìm thấy xe')
  }
  vehicle.licensePlate = payload.licensePlate
  vehicle.vehicleType = payload.vehicleType
  vehicle.brand = payload.brand
  vehicle.color = payload.color
  if (payload.primary !== undefined) {
    if (payload.primary) {
      mockVehicles.forEach((v) => (v.primary = false))
    }
    vehicle.primary = payload.primary
  }
  return deepClone(vehicle)
}

export async function setPrimaryVehicle(vehicleId: string): Promise<VehicleResponse> {
  await delay(300)
  const vehicle = mockVehicles.find((v) => v.id === vehicleId)
  if (!vehicle) {
    throw new Error('Không tìm thấy xe')
  }
  mockVehicles.forEach((v) => (v.primary = false))
  vehicle.primary = true
  return deepClone(vehicle)
}

export async function deleteVehicle(vehicleId: string): Promise<void> {
  await delay(300)
  const index = mockVehicles.findIndex((v) => v.id === vehicleId)
  if (index === -1) {
    throw new Error('Không tìm thấy xe')
  }
  mockVehicles.splice(index, 1)
}
