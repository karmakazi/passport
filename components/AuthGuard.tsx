'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    // Check authentication
    const authed = isAuthenticated()
    setIsAuthed(authed)
    setIsChecking(false)

    // Redirect to login if not authenticated and not already on login page
    if (!authed && pathname !== '/login') {
      router.push('/login')
    }
  }, [pathname, router])

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show children if authenticated or on login page
  if (isAuthed || pathname === '/login') {
    return <>{children}</>
  }

  // Otherwise show nothing (redirecting)
  return null
}

