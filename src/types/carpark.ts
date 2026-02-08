export type CarparkType = 'HDB' | 'MALL' | 'OFFICE' | 'PUBLIC' | 'OTHER'
export type CarparkSource = 'HDB' | 'COMMUNITY' | 'INFERRED'
export type ConfidenceLevel = 'official' | 'community' | 'inferred'

export interface Carpark {
  id: string
  externalId: string
  name: string
  address: string
  town?: string
  lat: number
  lng: number
  type: CarparkType
  source: CarparkSource
  confidenceLevel: ConfidenceLevel
  motorcycleAllowed?: boolean | null
  carAllowed: boolean
  totalMotoLots?: number | null
  covered?: boolean
  seasonOnly?: boolean
  pricingNotes?: string
  openingHours?: string
  entranceNotes?: string
  verified?: boolean
  createdAt: string
  updatedAt: string
  lastAvailabilitySyncAt?: string | null
  photos: Photo[]
  distance?: number // Added by API for search results
}

export interface Photo {
  id: string
  carparkId: string
  url: string
  caption?: string
  takenAt?: string
  createdAt: string
}

export interface GeocodeResult {
  lat: number
  lng: number
  formattedAddress: string
}

export interface SearchState {
  query: string
  center: { lat: number; lng: number } | null
  carparks: Carpark[]
  selectedCarparkId: string | null
  isLoading: boolean
  error: string | null
}
