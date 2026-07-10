// Simulates network delay
export function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Generates a UUID-like mock ID
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Deep clone an object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// Paginate an array
export function paginate<T>(items: T[], page: number = 0, size: number = 10): { content: T[]; totalPages: number; totalElements: number; size: number; number: number } {
  const start = page * size
  const content = items.slice(start, start + size)
  return {
    content,
    totalPages: Math.ceil(items.length / size),
    totalElements: items.length,
    size,
    number: page,
  }
}
