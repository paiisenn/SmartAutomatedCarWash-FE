import { delay, generateId } from '../_helpers'
import type { RegisterPayload, LoginPayload, AuthResponse, UserProfile } from './types'
import { mockUsers } from './mockData'

function getCurrentUserId(): string | null {
  try {
    const userStr = localStorage.getItem('auth_user')
    if (!userStr) return null
    const user = JSON.parse(userStr)
    return user.id || null
  } catch {
    return null
  }
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  await delay(500)
  const user = mockUsers.find(
    (u) => u.email === payload.emailOrPhone || u.phone === payload.emailOrPhone
  )
  if (!user || (payload.password && user.password !== payload.password)) {
    throw new Error('Tài khoản hoặc mật khẩu không đúng')
  }
  return {
    token: `mock-jwt-token-${user.id}`,
    refreshToken: `mock-refresh-token-${user.id}`,
    user: {
      id: user.id,
      name: user.fullName || user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  await delay(500)
  const exists = mockUsers.find((u) => u.phone === payload.phone)
  if (exists) {
    throw new Error('Số điện thoại đã được sử dụng')
  }
  const newId = generateId()
  const newUser = {
    id: newId,
    customerId: `cust-${newId.slice(0, 8)}`,
    name: payload.name,
    fullName: payload.name,
    email: payload.email,
    phone: payload.phone,
    role: 'CUSTOMER' as const,
    password: payload.password || '123456',
  }
  mockUsers.push(newUser)
  return {
    token: `mock-jwt-token-${newId}`,
    refreshToken: `mock-refresh-token-${newId}`,
    user: {
      id: newUser.id,
      name: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    },
  }
}

export async function getMe(): Promise<UserProfile> {
  await delay(200)
  const userId = getCurrentUserId()
  if (!userId) {
    throw new Error('Chưa đăng nhập')
  }
  const user = mockUsers.find((u) => u.id === userId)
  if (!user) {
    throw new Error('Không tìm thấy người dùng')
  }
  return {
    id: user.id,
    customerId: user.customerId,
    name: user.name,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
  }
}

export async function updateMe(payload: { fullName: string; phone: string; email: string }): Promise<UserProfile> {
  await delay(300)
  const userId = getCurrentUserId()
  if (!userId) {
    throw new Error('Chưa đăng nhập')
  }
  const user = mockUsers.find((u) => u.id === userId)
  if (!user) {
    throw new Error('Không tìm thấy người dùng')
  }
  user.fullName = payload.fullName
  user.name = payload.fullName
  user.phone = payload.phone
  user.email = payload.email
  return {
    id: user.id,
    customerId: user.customerId,
    name: user.name,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
  }
}
