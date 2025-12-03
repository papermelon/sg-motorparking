// Haversine distance calculation
export function getDistanceInMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Create a rough bounding box for SQL filtering
export function getBoundingBox(lat: number, lng: number, radiusMeters: number): {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
} {
  const latDelta = (radiusMeters / 111320) // Rough meters to degrees latitude
  const lngDelta = (radiusMeters / 111320) / Math.cos(toRadians(lat)) // Adjust for longitude

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta
  }
}
