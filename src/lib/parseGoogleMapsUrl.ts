/**
 * Parse Google Maps URLs to extract latitude and longitude
 * Supports various formats:
 * - https://www.google.com/maps?q=1.3489,103.7495
 * - https://www.google.com/maps/place/.../@1.3489,103.7495,17z/...
 * - https://www.google.com/maps/@1.3489,103.7495,17z
 * - https://maps.google.com/?ll=1.3489,103.7495
 * - https://www.google.com/maps/search/.../@1.3489,103.7495,17z
 */

export interface ParsedCoordinates {
  lat: number
  lng: number
}

export function parseGoogleMapsUrl(url: string): ParsedCoordinates | null {
  if (!url) return null

  try {
    // Clean up the URL
    url = url.trim()

    // Pattern 1: @lat,lng in URL path (most common for place/search URLs)
    // Example: /maps/place/.../@1.3489,103.7495,17z
    const atPattern = /@(-?\d+\.\d+),(-?\d+\.\d+)/
    const atMatch = url.match(atPattern)
    if (atMatch) {
      const lat = parseFloat(atMatch[1])
      const lng = parseFloat(atMatch[2])
      if (isValidSingaporeCoords(lat, lng)) {
        return { lat, lng }
      }
    }

    // Pattern 2: ?q=lat,lng query parameter
    // Example: /maps?q=1.3489,103.7495
    const qPattern = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/
    const qMatch = url.match(qPattern)
    if (qMatch) {
      const lat = parseFloat(qMatch[1])
      const lng = parseFloat(qMatch[2])
      if (isValidSingaporeCoords(lat, lng)) {
        return { lat, lng }
      }
    }

    // Pattern 3: ?ll=lat,lng query parameter
    // Example: /maps?ll=1.3489,103.7495
    const llPattern = /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/
    const llMatch = url.match(llPattern)
    if (llMatch) {
      const lat = parseFloat(llMatch[1])
      const lng = parseFloat(llMatch[2])
      if (isValidSingaporeCoords(lat, lng)) {
        return { lat, lng }
      }
    }

    // Pattern 4: data=...!3d{lat}!4d{lng} in URL
    // Example: data=...!3d1.3489!4d103.7495
    const dataPattern = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/
    const dataMatch = url.match(dataPattern)
    if (dataMatch) {
      const lat = parseFloat(dataMatch[1])
      const lng = parseFloat(dataMatch[2])
      if (isValidSingaporeCoords(lat, lng)) {
        return { lat, lng }
      }
    }

    // Pattern 5: Just coordinates pasted directly (lat,lng or lat, lng)
    const directPattern = /^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/
    const directMatch = url.match(directPattern)
    if (directMatch) {
      const lat = parseFloat(directMatch[1])
      const lng = parseFloat(directMatch[2])
      if (isValidSingaporeCoords(lat, lng)) {
        return { lat, lng }
      }
    }

    return null
  } catch (error) {
    console.error('Error parsing Google Maps URL:', error)
    return null
  }
}

function isValidSingaporeCoords(lat: number, lng: number): boolean {
  // Singapore bounds (roughly)
  return lat >= 1.1 && lat <= 1.5 && lng >= 103.6 && lng <= 104.1
}

// Also export a function to generate a Google Maps link from coordinates
export function generateGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`
}
