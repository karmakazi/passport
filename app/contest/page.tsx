'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAllStampsCollected, enterContest, getPassportData } from '@/lib/storage'

export default function ContestPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [canEnter, setCanEnter] = useState(false)
  const [alreadyEntered, setAlreadyEntered] = useState(false)

  useEffect(() => {
    const allCollected = getAllStampsCollected()
    const data = getPassportData()
    
    setCanEnter(allCollected)
    setAlreadyEntered(data.contestEntered)
    
    if (!allCollected) {
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    if (!agreeToTerms) {
      setError('Please agree to the terms and conditions')
      return
    }

    setSubmitting(true)

    // Simulate submission
    setTimeout(() => {
      enterContest(name, email)
      setSubmitting(false)
      router.push('/success')
    }, 1500)
  }

  const handleBack = () => {
    router.push('/')
  }

  if (alreadyEntered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce-in">
          <div className="mb-4 flex justify-center">
            <div className="bg-green-500 rounded-full p-6">
              <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">Already Entered!</h2>
          <p className="text-gray-700 mb-6">You've already submitted your contest entry. Good luck!</p>
          <button
            onClick={handleBack}
            className="bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all"
          >
            Back to Passport
          </button>
        </div>
      </div>
    )
  }

  if (!canEnter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce-in">
          <div className="mb-4 flex justify-center">
            <div className="bg-gray-400 rounded-full p-6">
              <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Not Yet!</h2>
          <p className="text-gray-700 mb-6">
            You need to collect all stamps before entering the contest.
          </p>
          <div className="text-gray-500">Redirecting...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-4 shadow-lg">
        <div className="container mx-auto max-w-4xl flex items-center gap-4">
          <button
            onClick={handleBack}
            className="hover:bg-white/20 rounded-full p-2 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold">Enter Contest</h1>
            <p className="text-sm text-primary-100">You're one step away!</p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Celebration Banner */}
        <div className="bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl shadow-xl p-6 text-white text-center mb-6 animate-bounce-in">
          <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
          <p className="text-primary-100">
            You've collected all stamps! Enter your details below to win amazing prizes.
          </p>
        </div>

        {/* Entry Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                required
                disabled={submitting}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                required
                disabled={submitting}
              />
            </div>

            {/* Phone (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                disabled={submitting}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                required
                disabled={submitting}
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the terms and conditions and consent to be contacted if I win the contest.
                <span className="text-red-500"> *</span>
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
              disabled={submitting}
              className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <span>Submit Entry</span>
              )}
            </button>
          </form>
        </div>

        {/* Prize Information */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Prizes
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-gray-700">
              <div className="font-bold text-primary-600">1st</div>
              <div>
                <div className="font-semibold">Grand Prize</div>
                <div className="text-sm text-gray-600">$500 gift card + merchandise bundle</div>
              </div>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <div className="font-bold text-primary-600">2nd</div>
              <div>
                <div className="font-semibold">Second Place</div>
                <div className="text-sm text-gray-600">$250 gift card</div>
              </div>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <div className="font-bold text-primary-600">3rd</div>
              <div>
                <div className="font-semibold">Third Place</div>
                <div className="text-sm text-gray-600">$100 gift card</div>
              </div>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <div className="font-bold text-primary-600">10x</div>
              <div>
                <div className="font-semibold">Runner-ups</div>
                <div className="text-sm text-gray-600">$25 gift cards</div>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}

