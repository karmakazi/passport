'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface CameraScannerProps {
  onScanSuccess: (decodedText: string) => void
  onScanError?: (error: string) => void
}

export default function CameraScanner({ onScanSuccess, onScanError }: CameraScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    const startScanner = async () => {
      try {
        setIsScanning(true)
        await scanner.start(
          { facingMode: 'environment' }, // Use back camera on mobile
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Success callback
            onScanSuccess(decodedText)
          },
          (errorMessage) => {
            // Error callback (this fires frequently, so we don't show it)
            // It just means no QR code was detected in that frame
          }
        )
      } catch (err: any) {
        console.error('Camera error:', err)
        const errorMsg = err?.message || 'Failed to access camera'
        setError(errorMsg)
        if (onScanError) {
          onScanError(errorMsg)
        }
        setIsScanning(false)
      }
    }

    startScanner()

    // Cleanup
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch((err) => {
          console.error('Error stopping scanner:', err)
        })
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="relative aspect-square max-w-md mx-auto mb-6 bg-red-50 rounded-2xl overflow-hidden border-2 border-red-200">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-bold text-red-800 mb-2">Camera Access Denied</h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <p className="text-xs text-red-500">
              Please enable camera permissions in your browser settings and refresh the page.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-square max-w-md mx-auto mb-6 bg-gray-900 rounded-2xl overflow-hidden">
      <div id="qr-reader" className="w-full h-full" />
      {isScanning && (
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <div className="inline-block bg-black/70 text-white px-4 py-2 rounded-full text-sm">
            Point camera at QR code
          </div>
        </div>
      )}
    </div>
  )
}

