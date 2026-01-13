'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { syncToSupabase, getPassportData, isSyncPending } from '@/lib/storage'
import { getUserData } from '@/lib/auth'

export default function SyncPage() {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')
  const [localData, setLocalData] = useState<any>(null)

  const checkLocalData = () => {
    const passportData = getPassportData()
    const userData = getUserData()
    const pending = isSyncPending()
    
    const collectedStamps = Object.entries(passportData.stamps)
      .filter(([_, stamp]) => stamp.collectedAt !== null)
      .map(([locationId, stamp]) => ({
        locationId,
        collectedAt: stamp.collectedAt
      }))
    
    setLocalData({
      user: userData,
      collectedStampsCount: collectedStamps.length,
      collectedStamps,
      contestEntered: passportData.contestEntered,
      syncPending: pending
    })
  }

  const handleSync = async () => {
    setSyncing(true)
    setMessage('Syncing to Supabase...')
    
    try {
      const success = await syncToSupabase()
      
      if (success) {
        setMessage('✅ Successfully synced to Supabase!')
      } else {
        setMessage('⚠️ Sync failed. Check console for errors.')
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error as Error).message)
    }
    
    setSyncing(false)
    checkLocalData()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🔄 Sync Utility</h1>
          <p className="text-gray-600 mb-6">
            Debug and manually sync your data to Supabase
          </p>

          <div className="space-y-4">
            <button
              onClick={checkLocalData}
              className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-600 transition-all"
            >
              📊 Check Local Data
            </button>

            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full bg-primary-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-700 transition-all disabled:opacity-50"
            >
              {syncing ? 'Syncing...' : '🔄 Sync to Supabase'}
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all"
            >
              ← Back to Home
            </button>
          </div>

          {message && (
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">{message}</p>
            </div>
          )}
        </div>

        {localData && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Local Storage Data:</h2>
            
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong>User ID:</strong> {localData.user?.userId || 'Not set'}
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong>Postal Code:</strong> {localData.user?.postalCode}
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong>Device ID:</strong> {localData.user?.deviceId?.substring(0, 20)}...
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong>Stamps Collected:</strong> {localData.collectedStampsCount}
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong>Sync Pending:</strong> {localData.syncPending ? '⚠️ Yes' : '✅ No'}
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong>Collected Stamps:</strong>
                <ul className="mt-2 ml-4 list-disc">
                  {localData.collectedStamps.map((stamp: any) => (
                    <li key={stamp.locationId}>
                      {stamp.locationId} - {new Date(stamp.collectedAt).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

