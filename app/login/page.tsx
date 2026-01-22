'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [postalCode, setPostalCode] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation - only first 3 characters (Forward Sortation Area)
    if (!postalCode || postalCode.length !== 3) {
      setError('Please enter the first 3 characters of your postal code')
      return
    }

    // Validate format: Letter-Number-Letter (e.g., L4C)
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]$/
    if (!postalCodeRegex.test(postalCode)) {
      setError('Invalid format. Example: L4C')
      return
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions')
      return
    }

    // Store in local storage and sync to Supabase
    setIsSubmitting(true)
    try {
      await login(postalCode)
      setTimeout(() => {
        router.push('/')
      }, 300)
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <Image 
            src="/images/RH_Logo_RGB_S.png" 
            alt="Richmond Hill Logo" 
            width={240} 
            height={240}
            className="mb-4"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Explore Culture and Collect Stamps
            </h1>
            <div className="space-y-3 text-gray-600 text-left">
              <p>
              Discover the wide array of arts, heritage, culture, and events across Richmond Hill.
              </p>
            </div>
          </div>
        </div>

        {/* Login Form - Force white background in all modes */}
        <div className="bg-white rounded-2xl shadow-xl p-8 dark:bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-gray-800">
            Get Started
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Postal Code - First 3 Characters Only */}
            <div>
              <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-700">
                Enter First 3 Characters of Your Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                placeholder="L4C"
                className="w-full px-6 py-4 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:outline-none transition-all font-mono bg-white text-gray-900 placeholder:text-gray-400"
                disabled={isSubmitting}
                required
                maxLength={3}
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Example: <span className="font-semibold">L4C</span> (Letter-Number-Letter)
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl dark:bg-gray-50">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 dark:bg-white dark:border-gray-300"
                disabled={isSubmitting}
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold">
                  terms and conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold">
                  privacy policy
                </a>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-xl animate-bounce-in">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Getting started...</span>
                </div>
              ) : (
                <span>Start Collecting Stamps</span>
              )}
            </button>
          </form>

          {/* Demo Note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-800 text-center">
              <span className="font-semibold">Demo Mode:</span> No data is sent to a server. Information is stored locally on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

