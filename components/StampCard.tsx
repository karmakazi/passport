'use client'

import { Location } from '@/lib/types'

interface StampCardProps {
  location: Location
  isCollected: boolean
  collectedAt?: Date | null
}

export default function StampCard({ location, isCollected, collectedAt }: StampCardProps) {
  return (
    <div 
      className={`
        relative bg-white rounded-2xl p-6 shadow-lg transition-all duration-300
        ${isCollected ? 'border-2 border-primary-500' : 'border-2 border-gray-200'}
        hover:shadow-xl
      `}
    >
      {/* Location Icon */}
      <div className="text-5xl mb-3 text-center opacity-90">
        {location.icon}
      </div>
      
      {/* Location Name */}
      <h3 className="text-lg font-bold text-gray-800 text-center mb-1 line-clamp-2">
        {location.name}
      </h3>
      
      {/* Location Address */}
      <p className="text-xs text-gray-500 text-center mb-2">
        {location.address}
      </p>
      
      {/* Stamp Overlay */}
      {isCollected && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-primary-500/10 rounded-2xl p-4 animate-stamp">
            <div className="text-6xl opacity-20 rotate-12 transform">
              ✓
            </div>
          </div>
        </div>
      )}
      
      {/* Status Badge */}
      <div className="mt-3 text-center">
        {isCollected ? (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
            <span>✓</span>
            <span>Collected</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
            <span>○</span>
            <span>Not Visited</span>
          </div>
        )}
      </div>
      
      {/* Collection Date */}
      {isCollected && collectedAt && (
        <div className="mt-2 text-center text-xs text-gray-400">
          {new Date(collectedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  )
}

