export interface VehicleRequest {
  licensePlate: string
  vehicleType: string
  brand?: string
  color?: string
  primary?: boolean
}

export interface VehicleResponse {
  id: string
  licensePlate: string
  vehicleType: string
  brand?: string
  color?: string
  primary: boolean
  lastWashDate?: string
  lastWashService?: string
}
