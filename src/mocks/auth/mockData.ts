import type { UserProfile } from './types'

export interface MockUser extends UserProfile {
  password: string
}

export let mockUsers: MockUser[] = [
  {
    id: 'admin-001',
    name: 'Admin Hệ Thống',
    fullName: 'Admin Hệ Thống',
    email: 'admin@autowash.vn',
    phone: '0901234567',
    role: 'ADMIN',
    password: '123456',
  },
  {
    id: 'user-001',
    customerId: 'cust-001',
    name: 'Nguyễn Văn An',
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    phone: '0912345678',
    role: 'CUSTOMER',
    password: '123456',
  },
  {
    id: 'user-002',
    customerId: 'cust-002',
    name: 'Trần Thị Bình',
    fullName: 'Trần Thị Bình',
    email: 'tranthibinh@gmail.com',
    phone: '0923456789',
    role: 'CUSTOMER',
    password: '123456',
  },
]
