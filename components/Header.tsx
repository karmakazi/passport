'use client'

export default function Header() {
  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center text-gray-800">Richmond Hill Passport to Culture</h1>
            <p className="text-gray-600 text-sm text-center">Collect stamps & win prizes</p>
          </div>
        </div>
      </div>
    </header>
  )
}

