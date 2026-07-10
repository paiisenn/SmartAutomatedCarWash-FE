export interface CustomerResponse {
  id: string
  fullName: string
  name?: string
  phone: string
  email: string
  tier?: string
  points?: number
}

export interface CustomerUpdateRequest {
  fullName: string
  phone: string
  email: string
}
