'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LOCATIONS } from '@/lib/locations'
import { resetPassport } from '@/lib/storage'
import QRCode from '@/components/QRCode'
import { generateLocationQRValue, getNetworkURL } from '@/lib/utils'

export default function DemoPage() {
  const router = useRouter()
  const [networkUrl, setNetworkUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [isProduction, setIsProduction] = useState(false)

  useEffect(() => {
    async function fetchNetworkURL() {
      const url = await getNetworkURL()
      setNetworkUrl(url)
      setIsProduction(url.includes('vercel.app') || !url.includes('localhost'))
      setLoading(false)
    }
    fetchNetworkURL()
  }, [])

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
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Detecting network IP...</p>
          </div>
        )}

        {/* Network/Site Access QR Code */}
        {!loading && networkUrl && (
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl shadow-xl p-6 mb-6 text-white">
            <h2 className="text-xl font-bold mb-3 text-center">
              {isProduction ? 'Share This App' : 'Connect from Your Phone'}
            </h2>
            <p className="text-center mb-4 text-primary-100">
              {isProduction 
                ? 'Scan this QR code to access the Richmond Hill Passport to Culture app'
                : 'Scan this QR code with your phone to access the app on your local network'
              }
            </p>
            <div className="flex justify-center mb-3">
              <QRCode value={networkUrl} size={200} />
            </div>
            <p className="text-center text-sm font-mono bg-white/20 rounded-lg py-2 px-4 break-all">
              {networkUrl}
            </p>
            {!isProduction && (
              <p className="text-center text-xs text-primary-200 mt-2">
                Local Development Mode
              </p>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            How to Test
          </h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-primary-600">1.</span>
              <span>Scan the QR code above with your phone to open the app</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary-600">2.</span>
              <span>Click "Scan QR Code" and scan any business QR code below</span>
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

        {/* QR Code Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Business Location QR Codes
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Scan these QR codes with your phone's camera app to collect stamps. Each QR code represents a business location.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOCATIONS.map((location) => (
              <div 
                key={location.id}
                className="border-2 border-gray-200 rounded-xl p-4 hover:border-primary-500 transition-all bg-gray-50"
              >
                <div className="flex justify-center mb-3">
                  {networkUrl ? (
                    <QRCode 
                      value={generateLocationQRValue(networkUrl, location.id)} 
                      size={180}
                    />
                  ) : (
                    <div className="w-[180px] h-[180px] bg-gray-200 rounded-xl flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-800 text-center text-sm mb-1">
                  {location.name}
                </h3>
                <p className="text-xs text-gray-500 text-center mb-2">
                  {location.address}
                </p>
                <div className="text-xs text-gray-400 text-center font-mono bg-white px-2 py-1 rounded">
                  {location.id}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Print QR Codes */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Print QR Codes
          </h2>
          <p className="text-gray-600 mb-4">
            Generate printable QR codes for physical display at each business location.
          </p>
          <button
            onClick={() => router.push('/print-qr')}
            className="bg-primary-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
          >
            View Printable QR Codes
          </button>
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

