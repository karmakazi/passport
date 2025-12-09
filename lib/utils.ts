export async function getNetworkURL(): Promise<string> {
  try {
    const response = await fetch('/api/network-ip')
    const data = await response.json()
    return data.url
  } catch (error) {
    console.error('Failed to get network URL:', error)
    // Fallback to current origin if API fails
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return 'http://localhost:3002'
  }
}

export function generateLocationQRValue(networkUrl: string, locationId: string): string {
  return `${networkUrl}/scan?location=${locationId}`
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

