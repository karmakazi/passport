'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPassportData } from '@/lib/storage'

export default function SuccessPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const data = getPassportData()
    if (data.userName) {
      setUserName(data.userName)
    }
  }, [])

  const handleBackHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-bounce-in">
          {/* Animated Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-green-500 rounded-full p-8 animate-bounce-in">
              <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Congratulations{userName && `, ${userName}`}!
          </h1>

          <p className="text-xl text-gray-700 mb-6">
            Your contest entry has been successfully submitted!
          </p>

          {/* Details */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 mb-8">
            <p className="text-gray-700 mb-4">
              Thank you for participating in the Richmond Hill Passport program! 
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Winners will be announced on December 31st</p>
              <p>We'll contact you via email if you win</p>
              <p>Good luck!</p>
            </div>
          </div>

          {/* Social Share Prompt */}
          <div className="border-t-2 border-gray-100 pt-6 mb-6">
            <p className="text-gray-600 mb-4">
              Share your achievement with friends!
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all">
                Facebook
              </button>
              <button className="bg-sky-500 text-white px-6 py-2 rounded-full hover:bg-sky-600 transition-all">
                Twitter
              </button>
              <button className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-all">
                Instagram
              </button>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={handleBackHome}
            className="bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            Back to Passport
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Questions? Contact us at support@passport.com</p>
        </div>
      </div>
    </div>
  )
}

