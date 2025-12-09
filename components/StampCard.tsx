'use client'

import Image from 'next/image'
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
        relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300
        ${isCollected ? 'border-2 border-primary-500' : 'border-2 border-gray-200'}
        hover:shadow-xl
      `}
    >
      {/* Location Image */}
      <div className="relative aspect-video bg-gray-200">
        <Image
          src={location.imageUrl}
          alt={location.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {/* Stamp Overlay */}
        {isCollected && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary-500/20">
            <div className="bg-white/95 rounded-full p-4 shadow-xl animate-stamp">
              <svg className="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Location Name */}
        <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-2">
          {location.name}
        </h3>
        
        {/* Location Address */}
        <p className="text-xs text-gray-500 mb-2 line-clamp-1">
          {location.address}
        </p>
        
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          {isCollected ? (
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
              <span>Collected</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
              <span>Not Visited</span>
            </div>
          )}
          
          {/* Collection Date */}
          {isCollected && collectedAt && (
            <div className="text-xs text-gray-400">
              {new Date(collectedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

