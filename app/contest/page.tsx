'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAllStampsCollected, getPassportData, enterContest } from '@/lib/storage'

// External contest URL managed by municipality
const CONTEST_URL = process.env.NEXT_PUBLIC_CONTEST_URL || 'https://forms.richmondhill.ca/Community-Services/Passport-to-Culture-Contest-Entry-Form'

export default function ContestPage() {
  const router = useRouter()

  useEffect(() => {
    const allCollected = getAllStampsCollected()
    
    if (!allCollected) {
      // Redirect if haven't collected all stamps
      router.push('/')
      return
    }
    
    // Don't redirect if already entered - let them click again to open external link
  }, [router])

  const handleEnterContest = () => {
    // Open external page IMMEDIATELY (before any async operations)
    // This prevents Safari/iOS from blocking the popup
    window.open(CONTEST_URL, '_blank')
    
    // Record entry in background (non-blocking)
    enterContest()
      .then(() => console.log('✅ Contest entry recorded'))
      .catch((error) => console.error('❌ Failed to record:', error))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">You Did It!</h2>
          <p className="text-lg text-gray-600 mb-4">You've completed your Passport to Culture.</p>
          <p className="text-gray-700">Enter the draw for the City of Richmond Hill Cultural Prize Pack.</p>
        </div>
        
        <div className="mb-6 p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border-2 border-primary-200">
          <p className="text-sm text-gray-700 mb-2">
            Click below to visit the official contest entry page
          </p>
          <p className="text-xs text-gray-500">
            (Opens in a new window)
          </p>
        </div>

        <button
          onClick={handleEnterContest}
          className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 mb-4"
        >
          Enter Contest Now
        </button>

        <button
          onClick={() => router.push('/')}
          className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-8 rounded-xl hover:bg-gray-200 transition-all"
        >
          Back to Passport
        </button>
      </div>
    </div>
  )
}
