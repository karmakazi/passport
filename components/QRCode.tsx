'use client'

import { QRCodeSVG } from 'qrcode.react'

interface QRCodeProps {
  value: string
  size?: number
  level?: 'L' | 'M' | 'Q' | 'H'
}

export default function QRCode({ value, size = 200, level = 'M' }: QRCodeProps) {
  return (
    <div className="bg-white p-4 rounded-xl inline-block">
      <QRCodeSVG 
        value={value} 
        size={size} 
        level={level}
        includeMargin={false}
      />
    </div>
  )
}

