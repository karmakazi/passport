'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ProgressBar from '@/components/ProgressBar'
import StampCard from '@/components/StampCard'
import { LOCATIONS } from '@/lib/locations'
import { getPassportData, getAllStampsCollected, getCollectedStampsCount, loadFromSupabase, syncToSupabase, isSyncPending } from '@/lib/storage'
import { PassportData } from '@/lib/types'

export default function HomePage() {
  const router = useRouter()
  const [passportData, setPassportData] = useState<PassportData | null>(null)
  const [collectedCount, setCollectedCount] = useState(0)
  const [allCollected, setAllCollected] = useState(false)
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(true)

  useEffect(() => {
    const initializeData = async () => {
      // Load data from Supabase if available
      await loadFromSupabase()
      
      // Sync any pending local changes to Supabase
      if (isSyncPending()) {
        await syncToSupabase()
      }
      
      // Update local state
      const data = getPassportData()
      setPassportData(data)
      setCollectedCount(getCollectedStampsCount())
      setAllCollected(getAllStampsCollected())
      
      // Check if user has collapsed instructions before
      const instructionsExpanded = localStorage.getItem('instructions-expanded')
      if (instructionsExpanded === 'false') {
        setIsInstructionsExpanded(false)
      }
    }
    
    initializeData()
  }, [])

  const toggleInstructions = () => {
    const newState = !isInstructionsExpanded
    setIsInstructionsExpanded(newState)
    localStorage.setItem('instructions-expanded', newState.toString())
  }

  const handleScanClick = () => {
    router.push('/scan')
  }

  const handleContestClick = () => {
    router.push('/contest')
  }

  const handleDemoClick = () => {
    router.push('/demo')
  }

  if (!passportData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in">
          <ProgressBar current={collectedCount} total={LOCATIONS.length} />
        </div>

        {/* Instructions - Show unless all stamps collected */}
        {!allCollected && (
          <div className="bg-white rounded-2xl shadow-lg mb-6 animate-slide-up relative overflow-hidden transition-all duration-300">
            {isInstructionsExpanded ? (
              // Expanded state
              <div className="p-6">
                <button
                  onClick={toggleInstructions}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Minimize"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-3 pr-8">
                  How It Works
                </h2>
                <ol className="space-y-2 text-gray-600">
                  <li className="flex gap-3">
                    <span className="font-bold text-primary-600 flex-shrink-0">1.</span>
                    <span>Visit a participating site, event, or program. Find all the participating sites and events here</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary-600 flex-shrink-0">2.</span>
                    <span>Scan the QR code on-site</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary-600 flex-shrink-0">3.</span>
                    <span>Get your stamp instantly</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary-600 flex-shrink-0">4.</span>
                    <span>Plan your next stop cultural adventure</span>
                  </li>
                </ol>
              </div>
            ) : (
              // Collapsed state
              <button
                onClick={toggleInstructions}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                aria-label="Expand How It Works"
              >
                <h2 className="text-lg font-bold text-gray-800">
                  How It Works
                </h2>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Contest Entry Button - Always show when stamps collected */}
        {allCollected && (
          <div className="bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl shadow-xl p-6 text-white text-center animate-bounce-in mb-6">
            <h3 className="text-2xl font-bold mb-2">You Did It!</h3>
            <p className="mb-4">You've collected the required stamps!</p>
            <button
              onClick={handleContestClick}
              className="bg-white text-accent-600 font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Enter Contest
            </button>
          </div>
        )}

        {/* Stamps Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">
            Your Passport
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {LOCATIONS.map((location) => {
              const stamp = passportData.stamps[location.id]
              return (
                <StampCard
                  key={location.id}
                  location={location}
                  isCollected={stamp?.collectedAt !== null}
                  collectedAt={stamp?.collectedAt}
                />
              )
            })}
          </div>
        </div>

      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-0 right-0 flex flex-col items-center gap-3 px-4 z-50">
        <button
          onClick={handleScanClick}
          className="bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <span className="text-lg">Scan QR Code</span>
        </button>
        <button
          onClick={handleDemoClick}
          className="bg-white text-gray-700 font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-gray-200"
        >
          <span className="text-sm">Demo & Reset</span>
        </button>
      </div>
    </div>
  )
}

