'use client'

import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2">
          <Image 
            src="/images/RH_Logo_RGB_S.png" 
            alt="Richmond Hill Logo" 
            width={180} 
            height={180}
            className="flex-shrink-0"
          />
          <Image 
            src="/images/Passport to Culture_logo_cmyk.png" 
            alt="Passport to Culture" 
            width={180} 
            height={90}
            className="flex-shrink-0"
          />
        </div>
      </div>
    </header>
  )
}

