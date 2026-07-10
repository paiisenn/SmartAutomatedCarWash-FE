export interface RegisterPayload {
  name: string
  email: string
  phone: string
  password?: string
}

export interface LoginPayload {
  emailOrPhone: string
  password?: string
}

export interface AuthResponse {
  token?: string
  accessToken?: string
  jwt?: string
  refreshToken?: string
  user?: {
    id?: string
    name?: string
    email?: string
    phone?: string
    role?: string
  }
}

export interface UserProfile {
  id?: string
  customerId?: string
  name?: string
  fullName?: string
  email?: string
  phone?: string
  role?: string
}
