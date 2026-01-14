'use client'

import { useState } from 'react'
import { LOCATIONS } from '@/lib/locations'

export default function TestDBPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `${timestamp} - ${message}`
    console.log(logMessage)
    setLogs(prev => [logMessage, ...prev].slice(0, 30))
  }

  const handleCreateUser = async () => {
    setLoading(true)
    addLog('━━━ CREATING USER: TST ━━━')
    
    try {
      const { isSupabaseConfigured } = await import('@/lib/supabase')
      
      addLog(`  Supabase: ${isSupabaseConfigured() ? 'Configured' : 'NOT configured'}`)
      addLog(`  Online: ${navigator.onLine}`)
      
      const { login } = await import('@/lib/auth')
      await login('TST')
      
      // Check if user has ID
      const { getUserData } = await import('@/lib/auth')
      const user = getUserData()
      
      if (user?.userId) {
        addLog(`  ✅ User ID: ${user.userId.substring(0, 25)}...`)
      } else {
        addLog(`  ⚠️ NO USER ID - Supabase failed!`)
        addLog(`  Check: Env vars set? Network working?`)
      }
    } catch (err: any) {
      addLog(`  ❌ Error: ${err.message}`)
    }
    
    setLoading(false)
  }

  const handleCollectStamp = async (locationId: string) => {
    setLoading(true)
    addLog(`━━━ Collecting stamp: ${locationId} ━━━`)
    
    try {
      const { getUserData } = await import('@/lib/auth')
      const { isSupabaseConfigured } = await import('@/lib/supabase')
      
      const user = getUserData()
      const configured = isSupabaseConfigured()
      
      addLog(`  User ID: ${user?.userId ? 'Present' : 'MISSING'}`)
      addLog(`  Supabase: ${configured ? 'Configured' : 'NOT configured'}`)
      addLog(`  Online: ${navigator.onLine}`)
      
      const { collectStamp } = await import('@/lib/storage')
      
      addLog(`  Calling collectStamp...`)
      await collectStamp(locationId)
      addLog(`  ✅ collectStamp completed`)
      
      // Wait a moment for sync to complete
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Now check if it's in Supabase
      if (user?.userId && configured) {
        const { supabase } = await import('@/lib/supabase')
        if (supabase) {
          const { data, error } = await supabase
            .from('collected_stamps')
            .select('id')
            .eq('user_id', user.userId)
            .eq('location_id', locationId)
            .maybeSingle()
          
          if (error) {
            addLog(`  ❌ Supabase check failed: ${error.message}`)
          } else if (data) {
            addLog(`  ✅ VERIFIED in Supabase!`)
          } else {
            addLog(`  ⚠️ NOT in Supabase (sync failed silently)`)
          }
        }
      }
      
    } catch (err: any) {
      addLog(`  ❌ Exception: ${err.message}`)
      console.error('Full error:', err)
    }
    
    setLoading(false)
  }

  const handleCheckData = async () => {
    addLog('━━━━━ CHECKING LOCAL STORAGE ━━━━━')
    
    try {
      const { getPassportData } = await import('@/lib/storage')
      const { getUserData } = await import('@/lib/auth')
      
      const passport = getPassportData()
      const user = getUserData()
      
      const collected = Object.entries(passport.stamps)
        .filter(([_, stamp]) => stamp.collectedAt !== null)
        .map(([id]) => id)
      
      addLog(`📱 LOCAL - User ID: ${user?.userId || 'None'}`)
      addLog(`📱 LOCAL - Postal Code: ${user?.postalCode || 'None'}`)
      addLog(`📱 LOCAL - Stamps: ${collected.length}`)
      addLog(`📱 LOCAL - Locations: ${collected.join(', ')}`)
      
      // Now check Supabase
      addLog('━━━━━ CHECKING SUPABASE ━━━━━')
      
      const { isSupabaseConfigured } = await import('@/lib/supabase')
      
      if (!isSupabaseConfigured()) {
        addLog('⚠️ SUPABASE - Not configured')
        return
      }
      
      if (!user?.userId) {
        addLog('⚠️ SUPABASE - No user ID')
        return
      }
      
      const { supabase } = await import('@/lib/supabase')
      
      if (!supabase) {
        addLog('⚠️ SUPABASE - Client not available')
        return
      }
      
      const { data: stamps, error } = await supabase
        .from('collected_stamps')
        .select('*')
        .eq('user_id', user.userId)
      
      if (error) {
        addLog(`❌ SUPABASE - Error: ${error.message}`)
      } else {
        const locations = stamps?.map(s => s.location_id) || []
        addLog(`☁️ SUPABASE - Stamps: ${stamps?.length || 0}`)
        addLog(`☁️ SUPABASE - Locations: ${locations.join(', ')}`)
        
        // Show difference
        const missing = collected.filter(id => !locations.includes(id))
        if (missing.length > 0) {
          addLog(`⚠️ MISSING FROM SUPABASE: ${missing.join(', ')}`)
        } else {
          addLog(`✅ All stamps synced!`)
        }
      }
    } catch (err: any) {
      addLog('❌ Error: ' + err.message)
    }
  }

  const handleReset = async () => {
    if (!confirm('Reset all data?')) return
    
    setLoading(true)
    addLog('━━━ RESETTING ALL DATA ━━━')
    
    try {
      const { getUserData } = await import('@/lib/auth')
      const user = getUserData()
      
      if (user?.userId) {
        addLog(`  User ID: ${user.userId}`)
        addLog(`  Deleting from Supabase...`)
        
        const { supabase, isSupabaseConfigured } = await import('@/lib/supabase')
        
        if (isSupabaseConfigured() && supabase) {
          // Delete stamps
          const { error: stampsError } = await supabase
            .from('collected_stamps')
            .delete()
            .eq('user_id', user.userId)
          
          if (stampsError) {
            addLog(`  ❌ Failed to delete stamps: ${stampsError.message}`)
          } else {
            addLog(`  ✅ Stamps deleted from Supabase`)
          }
          
          // Delete contest entries
          const { error: contestError } = await supabase
            .from('contest_entries')
            .delete()
            .eq('user_id', user.userId)
          
          if (contestError && contestError.code !== 'PGRST116') {
            addLog(`  ⚠️ Contest entry error: ${contestError.message}`)
          } else {
            addLog(`  ✅ Contest entries deleted`)
          }
        } else {
          addLog(`  ⚠️ Supabase not configured`)
        }
      } else {
        addLog(`  ⚠️ No user ID found`)
      }
      
      addLog(`  Clearing localStorage...`)
      const { resetPassport } = await import('@/lib/storage')
      const { logout } = await import('@/lib/auth')
      
      await resetPassport()
      logout()
      
      addLog('✅ Reset complete')
      setLogs([])  // Clear logs after reset
    } catch (err: any) {
      addLog(`❌ Error: ${err.message}`)
      console.error('Reset error:', err)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h1 className="text-2xl font-bold mb-4">🧪 Database Test</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <button
              onClick={handleCreateUser}
              disabled={loading}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Create User
            </button>
            
            <button
              onClick={handleCheckData}
              disabled={loading}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Check Data
            </button>
            
            <button
              onClick={handleReset}
              disabled={loading}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
            >
              Reset
            </button>
          </div>

          <h2 className="font-bold mb-2">Collect Stamps:</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
            {LOCATIONS.map((location) => (
              <button
                key={location.id}
                onClick={() => handleCollectStamp(location.id)}
                disabled={loading}
                className="bg-primary-500 text-white py-2 px-3 rounded hover:bg-primary-600 disabled:opacity-50 text-sm"
              >
                {location.id}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-600">Logs will appear here...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

