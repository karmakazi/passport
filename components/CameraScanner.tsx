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
  const [isProcessing, setIsProcessing] = useState(false)
  const hasScannedRef = useRef(false)

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
              setIsProcessing(true)
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
      
      {/* Scanning overlay with animation */}
      {isScanning && !isProcessing && (
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
      
      {/* Processing state */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-full mb-4 animate-bounce-in">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-white text-lg font-semibold">QR Code Detected!</div>
            <div className="text-white/80 text-sm mt-1">Processing...</div>
          </div>
        </div>
      )}
    </div>
  )
}

