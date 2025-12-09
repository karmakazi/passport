export async function getNetworkIP(): Promise<string> {
  try {
    const response = await fetch('/api/network-ip')
    const data = await response.json()
    return `http://${data.ip}:${data.port}`
  } catch (error) {
    console.error('Failed to get network IP:', error)
    return 'http://localhost:3002'
  }
}

export function generateLocationQRValue(networkUrl: string, locationId: string): string {
  return `${networkUrl}/scan?location=${locationId}`
}

