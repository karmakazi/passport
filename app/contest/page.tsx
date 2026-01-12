'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllStampsCollected, getPassportData } from '@/lib/storage'

// External contest URL managed by municipality
const CONTEST_URL = process.env.NEXT_PUBLIC_CONTEST_URL || 'https://www.richmondhill.ca/contest'

export default function ContestPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const allCollected = getAllStampsCollected()
    const passportData = getPassportData()
    
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

    // Countdown before redirecting to external contest
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Redirect to external contest page
          window.location.href = CONTEST_URL
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
          <p className="text-gray-600">You've collected all stamps!</p>
        </div>
        
        <div className="mb-6 p-4 bg-primary-50 rounded-xl">
          <p className="text-sm text-gray-700">
            Redirecting to contest entry in <span className="text-2xl font-bold text-primary-600">{countdown}</span> seconds...
          </p>
        </div>

        <div className="animate-pulse">
          <div className="h-2 bg-primary-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-600 rounded-full" style={{ width: `${((3 - countdown) / 3) * 100}%`, transition: 'width 1s linear' }}></div>
          </div>
        </div>

        <div className="mt-6">
          <a 
            href={CONTEST_URL}
            className="text-sm text-primary-600 hover:text-primary-700 underline"
          >
            Click here if not redirected automatically
          </a>
        </div>
      </div>
    </div>
  )
}
