import { supabase, isSupabaseConfigured, isOnline } from './supabase'

export interface UserData {
  userId?: string // Supabase user ID
  postalCode: string
  deviceId?: string
  agreedToTerms: boolean
  timestamp: Date
}

const AUTH_KEY = 'passport-auth'
const USER_DATA_KEY = 'passport-user-data'
const DEVICE_ID_KEY = 'passport-device-id'

// Polyfill for crypto.randomUUID() - works in non-secure contexts
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID()
    } catch (e) {
      // Fall through to polyfill if crypto.randomUUID fails
    }
  }
  
  // Fallback UUID generation for non-secure contexts
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Generate or get device ID
function getDeviceId(): string {
  if (typeof window === 'undefined') return ''
  
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  if (!deviceId) {
    deviceId = generateUUID()
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
  return deviceId
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  const auth = localStorage.getItem(AUTH_KEY)
  return auth === 'true'
}

export async function login(postalCode: string): Promise<void> {
  if (typeof window === 'undefined') return
  
  const postalCodeUpper = postalCode.toUpperCase()
  const deviceId = getDeviceId()
  
  let userId: string | undefined = undefined
  
  // Try Supabase first if configured and online
  if (isSupabaseConfigured() && isOnline() && supabase) {
    try {
      // Check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('postal_code', postalCodeUpper)
        .eq('device_id', deviceId)
        .maybeSingle()
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.warn('Supabase fetch error, using localStorage:', fetchError)
      } else if (existingUser) {
        userId = existingUser.id
      } else {
        // Create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            postal_code: postalCodeUpper,
            device_id: deviceId
          })
          .select('id')
          .single()
        
        if (insertError) {
          console.warn('Supabase insert error, using localStorage:', insertError)
        } else {
          userId = newUser.id
        }
      }
    } catch (error) {
      console.warn('Supabase error, using localStorage fallback:', error)
    }
  }
  
  // Store in localStorage (always, as backup)
  const userData: UserData = {
    userId,
    postalCode: postalCodeUpper,
    deviceId,
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
  // Keep device ID for future logins
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

export function getDeviceIdPublic(): string {
  return getDeviceId()
}

