'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAllStampsCollected, enterContest, getPassportData } from '@/lib/storage'
import { getUserData } from '@/lib/auth'

export default function ContestPage() {
  const router = useRouter()

  useEffect(() => {
    const allCollected = getAllStampsCollected()
    const passportData = getPassportData()
    const userData = getUserData()
    
    if (!allCollected) {
      // Redirect if haven't collected all stamps
      router.push('/')
      return
    }

    if (passportData.contestEntered) {
      // Already entered, go to success
      router.push('/success')
      return
    }

    // Auto-enter contest with user data from login
    if (userData) {
      enterContest(userData.email, userData.email)
      router.push('/success')
    } else {
      // Shouldn't happen, but fallback to home
      router.push('/')
    }
  }, [router])

  // Show loading while processing
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Entering Contest...</h2>
        <p className="text-gray-600">Please wait</p>
      </div>
    </div>
  )
}
