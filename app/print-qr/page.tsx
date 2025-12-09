'use client'

import { useEffect, useState } from 'react'
import { LOCATIONS } from '@/lib/locations'
import QRCode from '@/components/QRCode'
import { generateLocationQRValue, getNetworkIP } from '@/lib/utils'

export default function PrintQRPage() {
  const [networkUrl, setNetworkUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNetworkIP() {
      const url = await getNetworkIP()
      setNetworkUrl(url)
      setLoading(false)
    }
    fetchNetworkIP()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Detecting network IP...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-white p-8">
      <style jsx global>{`
        @media print {
          @page {
            size: letter;
            margin: 0.5in;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always;
          }
        }
      `}</style>

      {/* Print Instructions */}
      <div className="no-print mb-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-blue-900 mb-2">Print Instructions</h2>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click Print or press Ctrl/Cmd + P</li>
          <li>• Select "Save as PDF" or print directly</li>
          <li>• Make sure "Background graphics" is enabled</li>
          <li>• Each QR code will print on a separate page</li>
        </ul>
        <button
          onClick={() => window.print()}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Print QR Codes
        </button>
      </div>

      {/* QR Code Pages */}
      {LOCATIONS.map((location, index) => (
        <div 
          key={location.id}
          className={`flex flex-col items-center justify-center min-h-screen ${index < LOCATIONS.length - 1 ? 'page-break' : ''}`}
        >
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {location.name}
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              {location.address}
            </p>
            <p className="text-lg text-gray-500 mb-8">
              {location.description}
            </p>
            
            <div className="mb-8">
              <QRCode 
                value={generateLocationQRValue(networkUrl, location.id)} 
                size={300}
                level="H"
              />
            </div>

            <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-2">
                Scan to Collect Your Stamp!
              </h2>
              <p className="text-lg">
                Richmond Hill Passport Program
              </p>
            </div>

            <div className="mt-6 text-sm text-gray-400">
              Location ID: {location.id}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

