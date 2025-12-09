import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Passport - Collect Stamps & Win',
  description: 'Scan QR codes at participating locations to collect stamps and enter to win!',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-primary-50 via-white to-accent-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}

