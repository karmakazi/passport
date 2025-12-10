import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Richmond Hill Passport to Culture - Collect Stamps & Win',
  description: 'Explore Richmond Hill culture! Visit local businesses, collect stamps and enter to win amazing prizes!',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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

