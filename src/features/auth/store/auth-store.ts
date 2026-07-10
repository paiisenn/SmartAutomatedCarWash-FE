const TOKEN_KEY = 'jwt_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'auth_user'

export interface User {
  id?: string
  name?: string
  email?: string
  phone?: string
  role?: string
}

export const authStore = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },
  saveRefreshToken(refreshToken: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY)
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },
  saveUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  isAuthenticated(): boolean {
    return !!this.getToken()
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
  logout(): void {
    this.clear()
    window.location.href = '/login'
  }
}
