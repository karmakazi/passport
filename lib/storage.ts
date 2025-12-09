import { PassportData, Stamp } from './types'
import { LOCATIONS } from './locations'

const STORAGE_KEY = 'passport-data'

const getDefaultPassportData = (): PassportData => {
  const stamps: Record<string, Stamp> = {}
  LOCATIONS.forEach((location) => {
    stamps[location.id] = {
      locationId: location.id,
      collectedAt: null,
    }
  })
  
  return {
    stamps,
    contestEntered: false,
  }
}

export const getPassportData = (): PassportData => {
  if (typeof window === 'undefined') {
    return getDefaultPassportData()
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return getDefaultPassportData()
    }
    
    const data = JSON.parse(stored) as PassportData
    
    // Convert date strings back to Date objects
    Object.keys(data.stamps).forEach((key) => {
      if (data.stamps[key].collectedAt) {
        data.stamps[key].collectedAt = new Date(data.stamps[key].collectedAt as any)
      }
    })
    
    return data
  } catch (error) {
    console.error('Error loading passport data:', error)
    return getDefaultPassportData()
  }
}

export const savePassportData = (data: PassportData): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving passport data:', error)
  }
}

export const collectStamp = (locationId: string): PassportData => {
  const data = getPassportData()
  
  if (data.stamps[locationId]) {
    data.stamps[locationId].collectedAt = new Date()
  }
  
  savePassportData(data)
  return data
}

export const isStampCollected = (locationId: string): boolean => {
  const data = getPassportData()
  return data.stamps[locationId]?.collectedAt !== null
}

export const getAllStampsCollected = (): boolean => {
  const data = getPassportData()
  return Object.values(data.stamps).every((stamp) => stamp.collectedAt !== null)
}

export const getCollectedStampsCount = (): number => {
  const data = getPassportData()
  return Object.values(data.stamps).filter((stamp) => stamp.collectedAt !== null).length
}

export const enterContest = (name: string, email: string): void => {
  const data = getPassportData()
  data.contestEntered = true
  data.userName = name
  data.userEmail = email
  savePassportData(data)
}

export const resetPassport = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

