'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LOCATIONS, getLocationById } from '@/lib/locations'
import { collectStamp, isStampCollected } from '@/lib/storage'
import CameraScanner from '@/components/CameraScanner'

function ScanPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [scanning, setScanning] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [scannedLocation, setScannedLocation] = useState<string>('')
  const [manualEntry, setManualEntry] = useState('')
  const [showCamera, setShowCamera] = useState(true)

  const handleScan = (locationId: string) => {
    const location = getLocationById(locationId)
    
    if (!location) {
      setError('Invalid QR code. Please try again.')
      setTimeout(() => setError(''), 3000)
      return
    }

    if (isStampCollected(locationId)) {
      setError(`You've already collected the stamp from ${location.name}!`)
      setTimeout(() => setError(''), 3000)
      return
    }

    // Process the stamp collection
    setScanning(true)
    setShowCamera(false)
    setTimeout(() => {
      collectStamp(locationId)
      setScannedLocation(location.name)
      setSuccess(true)
      setScanning(false)
      
      // Redirect back to home after showing success
      setTimeout(() => {
        router.push('/')
      }, 2500)
    }, 500)
  }

  const handleQRScan = (decodedText: string) => {
    // Extract location ID from URL or use directly
    try {
      const url = new URL(decodedText)
      const locationId = url.searchParams.get('location')
      if (locationId) {
        handleScan(locationId)
      } else {
        setError('Invalid QR code format')
        setTimeout(() => setError(''), 3000)
      }
    } catch {
      // Maybe it's just a location ID
      handleScan(decodedText)
    }
  }

  // Auto-scan if location parameter is present
  useEffect(() => {
    const locationId = searchParams.get('location')
    if (locationId) {
      handleScan(locationId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualEntry.trim()) {
      handleScan(manualEntry.trim().toLowerCase())
      setManualEntry('')
    }
  }

  const handleBack = () => {
    router.push('/')
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce-in">
          <div className="mb-4 flex justify-center">
            <div className="bg-primary-500 rounded-full p-6 animate-stamp">
              <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary-600 mb-2">Stamp Collected!</h2>
          <p className="text-xl text-gray-700 mb-4">{scannedLocation}</p>
          <div className="text-gray-500">Redirecting...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-4 shadow-lg">
        <div className="container mx-auto max-w-4xl flex items-center gap-4">
          <button
            onClick={handleBack}
            className="hover:bg-white/20 rounded-full p-2 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold">Scan QR Code</h1>
            <p className="text-sm text-primary-100">Collect your stamp</p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Camera Scanner */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          {showCamera && !scanning && (
            <CameraScanner 
              onScanSuccess={handleQRScan}
              onScanError={(err) => {
                setError(err)
                setShowCamera(false)
              }}
            />
          )}
          
          {scanning && (
            <div className="relative aspect-square max-w-md mx-auto mb-6 bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
                <p>Processing...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-xl mb-4 animate-bounce-in">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <p className="text-center text-gray-600 text-sm">
            In production, this would activate your device camera to scan QR codes
          </p>
        </div>

        {/* Manual Entry for Demo */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Demo Mode - Manual Entry
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            For testing, enter a location ID manually (e.g., loc1, loc2, etc.)
          </p>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualEntry}
              onChange={(e) => setManualEntry(e.target.value)}
              placeholder="Enter location ID"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:outline-none"
              disabled={scanning}
            />
            <button
              type="submit"
              disabled={scanning || !manualEntry.trim()}
              className="bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Scan
            </button>
          </form>
        </div>

        {/* Quick Select Locations */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Quick Select (Demo)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LOCATIONS.map((location) => {
              const collected = isStampCollected(location.id)
              return (
                <button
                  key={location.id}
                  onClick={() => handleScan(location.id)}
                  disabled={scanning || collected}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${collected 
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50' 
                      : 'border-primary-200 hover:border-primary-500 hover:bg-primary-50 active:scale-95'
                    }
                    disabled:cursor-not-allowed
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate">
                        {location.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {location.address}
                      </div>
                      {collected && (
                        <div className="text-xs text-primary-600 font-semibold mt-1">
                          Already collected
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    }>
      <ScanPageContent />
    </Suspense>
  )
}

