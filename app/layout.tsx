import type { Metadata, Viewport } from 'next'
import './globals.css'
import AuthGuard from '@/components/AuthGuard'

export const metadata: Metadata = {
  title: 'Richmond Hill Passport to Culture - Collect Stamps & Win',
  description: 'Explore Richmond Hill culture! Visit local businesses, collect stamps and enter to win amazing prizes!',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-gradient-to-br from-primary-50 via-white to-accent-50 min-h-full">
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  )
}

