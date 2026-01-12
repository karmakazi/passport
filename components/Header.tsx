'use client'

import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-4">
          <Image 
            src="/images/RH_Logo_RGB_S.png" 
            alt="Richmond Hill Logo" 
            width={180} 
            height={180}
            className="flex-shrink-0"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800">Passport to Culture</h1>
            <p className="text-gray-600 text-sm">Collect stamps & win prizes</p>
          </div>
        </div>
      </div>
    </header>
  )
}

