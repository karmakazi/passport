export interface UserData {
  email: string
  postalCode: string
  agreedToTerms: boolean
  timestamp: Date
}

const AUTH_KEY = 'passport-auth'
const USER_DATA_KEY = 'passport-user-data'

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  const auth = localStorage.getItem(AUTH_KEY)
  return auth === 'true'
}

export function login(email: string, password: string, postalCode: string): void {
  if (typeof window === 'undefined') return
  
  const userData: UserData = {
    email,
    postalCode,
    agreedToTerms: true,
    timestamp: new Date(),
  }
  
  localStorage.setItem(AUTH_KEY, 'true')
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
}

export function logout(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(USER_DATA_KEY)
}

export function getUserData(): UserData | null {
  if (typeof window === 'undefined') return null
  
  const data = localStorage.getItem(USER_DATA_KEY)
  if (!data) return null
  
  try {
    const parsed = JSON.parse(data)
    parsed.timestamp = new Date(parsed.timestamp)
    return parsed
  } catch {
    return null
  }
}

