import { PassportData, Stamp } from './types'
import { LOCATIONS } from './locations'
import { supabase, isSupabaseConfigured, isOnline } from './supabase'
import { getUserData } from './auth'

const STORAGE_KEY = 'passport-data'
const SYNC_PENDING_KEY = 'passport-sync-pending'

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

export const collectStamp = async (locationId: string): Promise<PassportData> => {
  const data = getPassportData()
  
  if (data.stamps[locationId]) {
    data.stamps[locationId].collectedAt = new Date()
  }
  
  // Save to localStorage first (immediate)
  savePassportData(data)
  
  // Try to sync to Supabase
  const userData = getUserData()
  
  // Debug logging
  console.log('🔄 Attempting stamp sync:', {
    hasUserId: !!userData?.userId,
    userId: userData?.userId,
    isConfigured: isSupabaseConfigured(),
    isOnline: isOnline(),
    hasSupabase: !!supabase,
    locationId
  })
  
  if (userData?.userId && isSupabaseConfigured() && isOnline() && supabase) {
    try {
      const { data, error } = await supabase
        .from('collected_stamps')
        .insert({
          user_id: userData.userId,
          location_id: locationId
        })
        .select()
      
      if (error) {
        console.error('❌ Supabase error:', error)
        markSyncPending()
      } else {
        console.log('✅ Stamp synced to Supabase:', data)
      }
    } catch (error) {
      console.error('❌ Exception during sync:', error)
      markSyncPending()
    }
  } else {
    console.warn('⚠️ Skipping sync - conditions not met')
    markSyncPending()
  }
  
  return data
}

export const isStampCollected = (locationId: string): boolean => {
  const data = getPassportData()
  return data.stamps[locationId]?.collectedAt !== null
}

// Required stamps to complete passport (excluding bonus locations)
const REQUIRED_STAMPS = 6

export const getAllStampsCollected = (): boolean => {
  const collectedCount = getCollectedStampsCount()
  return collectedCount >= REQUIRED_STAMPS
}

export const getCollectedStampsCount = (): number => {
  const data = getPassportData()
  return Object.values(data.stamps).filter((stamp) => stamp.collectedAt !== null).length
}

export const enterContest = async (): Promise<void> => {
  const data = getPassportData()
  
  // Check if already entered
  if (data.contestEntered) {
    console.log('ℹ️ Contest already entered, skipping')
    return
  }
  
  data.contestEntered = true
  savePassportData(data)
  
  // Try to sync to Supabase (only if not already entered)
  const userData = getUserData()
  if (userData?.userId && isSupabaseConfigured() && isOnline() && supabase) {
    try {
      // Check if entry already exists in database
      const { data: existing, error: checkError } = await supabase
        .from('contest_entries')
        .select('id')
        .eq('user_id', userData.userId)
        .maybeSingle()
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.warn('⚠️ Error checking existing entry:', checkError)
      }
      
      if (existing) {
        console.log('ℹ️ Contest entry already exists in database')
      } else {
        // Insert new entry
        const { error: insertError } = await supabase
          .from('contest_entries')
          .insert({
            user_id: userData.userId
          })
        
        if (insertError) {
          console.warn('⚠️ Failed to insert contest entry:', insertError)
        } else {
          console.log('✅ Contest entry recorded in Supabase')
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to sync contest entry to Supabase:', error)
    }
  }
}

export const resetPassport = async (): Promise<void> => {
  if (typeof window === 'undefined') return
  
  // Get user data BEFORE clearing anything
  const userData = getUserData()
  console.log('🗑️ Reset: User ID:', userData?.userId)
  
  // Delete from Supabase FIRST (while we still have userId)
  if (userData?.userId && isSupabaseConfigured() && supabase) {
    try {
      console.log('🗑️ Deleting from Supabase for user:', userData.userId)
      
      // Delete all stamps
      const { error: stampsError } = await supabase
        .from('collected_stamps')
        .delete()
        .eq('user_id', userData.userId)
      
      if (stampsError) {
        console.error('❌ Failed to delete stamps:', stampsError)
      } else {
        console.log('✅ Stamps deleted from Supabase')
      }
      
      // Delete contest entry
      const { error: contestError } = await supabase
        .from('contest_entries')
        .delete()
        .eq('user_id', userData.userId)
      
      if (contestError && contestError.code !== 'PGRST116') {
        console.error('⚠️ Failed to delete contest entry:', contestError)
      }
      
      // Delete the user record itself to force fresh start
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userData.userId)
      
      if (userError) {
        console.error('⚠️ Failed to delete user:', userError)
      } else {
        console.log('✅ User deleted from Supabase')
      }
      
      console.log('✅ Supabase completely cleared')
    } catch (error) {
      console.error('❌ Error clearing Supabase:', error)
    }
  } else {
    console.warn('⚠️ No userId or Supabase not configured')
  }
  
  // NOW clear localStorage (after Supabase is cleaned)
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(SYNC_PENDING_KEY)
  console.log('✅ Local storage cleared')
}

// Helper functions for sync
function markSyncPending(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SYNC_PENDING_KEY, 'true')
}

function clearSyncPending(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SYNC_PENDING_KEY)
}

export function isSyncPending(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(SYNC_PENDING_KEY) === 'true'
}

// Sync localStorage data to Supabase
export async function syncToSupabase(): Promise<boolean> {
  if (!isSupabaseConfigured() || !isOnline() || !supabase) {
    return false
  }
  
  const userData = getUserData()
  if (!userData?.userId) {
    return false
  }
  
  try {
    const localData = getPassportData()
    
    // Sync all collected stamps
    const collectedStamps = Object.entries(localData.stamps)
      .filter(([_, stamp]) => stamp.collectedAt !== null)
      .map(([locationId, stamp]) => ({
        user_id: userData.userId!,
        location_id: locationId,
        collected_at: stamp.collectedAt?.toISOString()
      }))
    
    if (collectedStamps.length > 0) {
      // Use upsert to avoid duplicates
      const { error: stampsError } = await supabase
        .from('collected_stamps')
        .upsert(collectedStamps, {
          onConflict: 'user_id,location_id',
          ignoreDuplicates: true
        })
      
      if (stampsError) {
        console.warn('Failed to sync stamps:', stampsError)
        return false
      }
    }
    
    // Sync contest entry if entered
    if (localData.contestEntered) {
      const { error: contestError } = await supabase
        .from('contest_entries')
        .upsert({
          user_id: userData.userId
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: true
        })
      
      if (contestError) {
        console.warn('Failed to sync contest entry:', contestError)
      }
    }
    
    clearSyncPending()
    console.log('✅ Successfully synced to Supabase')
    return true
  } catch (error) {
    console.warn('Sync failed:', error)
    return false
  }
}

// Load data from Supabase and merge with local
export async function loadFromSupabase(): Promise<void> {
  if (!isSupabaseConfigured() || !isOnline() || !supabase) {
    return
  }
  
  const userData = getUserData()
  if (!userData?.userId) {
    return
  }
  
  try {
    // Fetch stamps from Supabase
    const { data: remoteStamps, error: stampsError } = await supabase
      .from('collected_stamps')
      .select('location_id, collected_at')
      .eq('user_id', userData.userId)
    
    if (stampsError) {
      console.warn('Failed to load stamps from Supabase:', stampsError)
      return
    }
    
    // Fetch contest entry
    const { data: contestEntry, error: contestError } = await supabase
      .from('contest_entries')
      .select('id')
      .eq('user_id', userData.userId)
      .maybeSingle()
    
    if (contestError && contestError.code !== 'PGRST116') {
      console.warn('Failed to load contest entry:', contestError)
    }
    
    // Merge with local data
    const localData = getPassportData()
    
    if (remoteStamps) {
      remoteStamps.forEach((remoteStamp) => {
        if (localData.stamps[remoteStamp.location_id]) {
          // Use remote stamp if it exists and local doesn't, or if remote is older (was collected first)
          if (!localData.stamps[remoteStamp.location_id].collectedAt) {
            localData.stamps[remoteStamp.location_id].collectedAt = new Date(remoteStamp.collected_at)
          }
        }
      })
    }
    
    if (contestEntry) {
      localData.contestEntered = true
    }
    
    savePassportData(localData)
    console.log('✅ Loaded data from Supabase')
  } catch (error) {
    console.warn('Failed to load from Supabase:', error)
  }
}

