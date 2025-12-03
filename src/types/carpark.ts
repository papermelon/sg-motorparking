export type CarparkType = 'HDB' | 'MALL' | 'OFFICE' | 'PUBLIC' | 'OTHER'

export interface Carpark {
  id: string
  name: string
  address: string
  town?: string
  lat: number
  lng: number
  type: CarparkType
  motorcycleAllowed: boolean
  carAllowed: boolean
  totalMotoLots?: number
  covered?: boolean
  seasonOnly?: boolean
  pricingNotes?: string
  openingHours?: string
  entranceNotes?: string
  verified?: boolean
  createdAt: string
  updatedAt: string
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
