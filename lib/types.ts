export interface Location {
  id: string
  name: string
  address: string
  description: string
  imageUrl: string
}

export interface Stamp {
  locationId: string
  collectedAt: Date | null
}

export interface PassportData {
  stamps: Record<string, Stamp>
  contestEntered: boolean
  userName?: string
  userEmail?: string
}

