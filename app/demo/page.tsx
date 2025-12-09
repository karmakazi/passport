'use client'

import { useRouter } from 'next/navigation'
import { LOCATIONS } from '@/lib/locations'
import { resetPassport } from '@/lib/storage'

export default function DemoPage() {
  const router = useRouter()

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your passport? This will clear all collected stamps.')) {
      resetPassport()
      router.push('/')
    }
  }

  const handleBack = () => {
    router.push('/')
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
            <h1 className="text-2xl font-bold">Demo QR Codes</h1>
            <p className="text-sm text-primary-100">For testing purposes</p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            How to Test
          </h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-primary-600">1.</span>
              <span>Go to the Scan page and use the "Quick Select" buttons to simulate scanning</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary-600">2.</span>
              <span>Or use manual entry with location IDs (e.g., loc1, loc2, loc3...)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary-600">3.</span>
              <span>Collect all {LOCATIONS.length} stamps to unlock the contest entry</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary-600">4.</span>
              <span>Use the Reset button below to start over</span>
            </li>
          </ol>
        </div>

        {/* QR Code Placeholders */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Location QR Codes
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            In production, these would be actual QR codes displayed at each location. 
            For this prototype, use the Scan page to collect stamps.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LOCATIONS.map((location) => (
              <div 
                key={location.id}
                className="border-2 border-gray-200 rounded-xl p-4 hover:border-primary-500 transition-all"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <div className="text-center p-4">
                    <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <div className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded mt-2">
                      {location.id}
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 text-center text-sm mb-1">
                  {location.name}
                </h3>
                <p className="text-xs text-gray-500 text-center">
                  {location.address}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Reset Demo
          </h2>
          <p className="text-gray-600 mb-4">
            Clear all collected stamps and start fresh. This will remove all your progress.
          </p>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-xl"
          >
            Reset Passport
          </button>
        </div>
      </main>
    </div>
  )
}

