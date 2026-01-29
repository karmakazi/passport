'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface CameraScannerProps {
  onScanSuccess: (decodedText: string) => void
  onScanError?: (error: string) => void
  resetTrigger?: number // Used to reset scanner state from parent
}

export default function CameraScanner({ onScanSuccess, onScanError, resetTrigger }: CameraScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string>('')
  const hasScannedRef = useRef(false)

  // Reset scanner state when resetTrigger changes (error occurred)
  useEffect(() => {
    if (resetTrigger !== undefined && resetTrigger > 0) {
      hasScannedRef.current = false
    }
  }, [resetTrigger])

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    const startScanner = async () => {
      try {
        setIsScanning(true)
        await scanner.start(
          { facingMode: 'environment' }, // Use back camera on mobile
          {
            fps: 20, // Increased from 10 to 20 for faster detection
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // Success callback - only process once
            if (!hasScannedRef.current) {
              hasScannedRef.current = true
              onScanSuccess(decodedText)
            }
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
      <div className="relative max-w-md mx-auto mb-6 bg-red-50 rounded-2xl overflow-hidden border-2 border-red-200 p-6">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h3 className="text-xl font-bold text-red-800 mb-3">Camera Access Required</h3>
          <p className="text-sm text-gray-700 mb-4">
            To scan QR codes, this app needs permission to access your camera.
          </p>
          
          <div className="bg-white rounded-xl p-4 mb-4 text-left">
            <p className="text-sm font-semibold text-gray-800 mb-2">How to enable camera access:</p>
            <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside">
              <li>Look for the camera icon in your browser's address bar</li>
              <li>Click on it and select "Allow" for camera permissions</li>
              <li>Refresh this page to start scanning</li>
            </ol>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-xl transition-all"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-square max-w-md mx-auto mb-6 bg-gray-900 rounded-2xl overflow-hidden">
      <div id="qr-reader" className="w-full h-full" />
      
      {/* Scanning overlay with animation */}
      {isScanning && (
        <>
          {/* Scanning line animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-primary-400 rounded-2xl">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
              
              {/* Animated scanning line */}
              <div className="absolute left-0 right-0 h-1 bg-primary-400 shadow-lg shadow-primary-400/50 animate-scan"></div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="inline-flex items-center gap-2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
              <span>Scanning for QR code...</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

