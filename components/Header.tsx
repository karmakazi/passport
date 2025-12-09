'use client'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-3">
          <div className="text-4xl">✈️</div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Passport</h1>
            <p className="text-primary-100 text-sm">Collect stamps & win prizes</p>
          </div>
        </div>
      </div>
    </header>
  )
}

