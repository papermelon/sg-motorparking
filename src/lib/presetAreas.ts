/**
 * Preset areas (parking hotspots) in Singapore for one-click search.
 * Coordinates are approximate centre points for each area.
 */
export interface PresetArea {
  id: string
  label: string
  lat: number
  lng: number
}

export const PRESET_AREAS: PresetArea[] = [
  { id: 'harbourfront', label: 'Harbourfront', lat: 1.2654, lng: 103.8203 },
  { id: 'orchard', label: 'Orchard', lat: 1.3048, lng: 103.8318 },
  { id: 'tanjong-pagar', label: 'Tanjong Pagar', lat: 1.2764, lng: 103.8453 },
  { id: 'dhoby-ghaut', label: 'Dhoby Ghaut', lat: 1.3, lng: 103.847 },
  { id: 'bugis', label: 'Bugis', lat: 1.2986, lng: 103.8555 },
  { id: 'raffles-place', label: 'Raffles Place', lat: 1.2836, lng: 103.8515 },
  { id: 'marina-bay', label: 'Marina Bay', lat: 1.281, lng: 103.859 },
  { id: 'chinatown', label: 'Chinatown', lat: 1.2838, lng: 103.8443 },
  { id: 'little-india', label: 'Little India', lat: 1.3064, lng: 103.8524 },
]
