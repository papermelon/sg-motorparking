'use client'

import { useState, useCallback } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { useGoogleMaps } from './GoogleMapsProvider'
import { parseGoogleMapsUrl, generateGoogleMapsUrl } from '@/lib/parseGoogleMapsUrl'

interface LocationPickerProps {
  lat: string
  lng: string
  onLocationChange: (lat: string, lng: string) => void
}

const containerStyle = {
  width: '100%',
  height: '300px'
}

// Singapore center
const defaultCenter = {
  lat: 1.3521,
  lng: 103.8198
}

export default function LocationPicker({ lat, lng, onLocationChange }: LocationPickerProps) {
  const { isLoaded } = useGoogleMaps()
  const [mapsLink, setMapsLink] = useState('')
  const [linkError, setLinkError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const currentLat = lat ? parseFloat(lat) : null
  const currentLng = lng ? parseFloat(lng) : null
  const hasValidCoords = currentLat !== null && currentLng !== null && !isNaN(currentLat) && !isNaN(currentLng)

  const mapCenter = hasValidCoords 
    ? { lat: currentLat!, lng: currentLng! }
    : defaultCenter

  const handleLinkPaste = (value: string) => {
    setMapsLink(value)
    setLinkError(null)

    if (!value.trim()) return

    const coords = parseGoogleMapsUrl(value)
    if (coords) {
      onLocationChange(coords.lat.toString(), coords.lng.toString())
      setLinkError(null)
    } else if (value.includes('google') || value.includes('maps') || value.includes('goo.gl')) {
      setLinkError('Could not extract coordinates from this link. Try a different Google Maps link or use the map below.')
    }
  }

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLat = e.latLng.lat()
      const newLng = e.latLng.lng()
      onLocationChange(newLat.toFixed(6), newLng.toFixed(6))
      // Update the link field to show the Google Maps link
      setMapsLink(generateGoogleMapsUrl(newLat, newLng))
      setLinkError(null)
    }
  }, [onLocationChange])

  const handleManualChange = (field: 'lat' | 'lng', value: string) => {
    if (field === 'lat') {
      onLocationChange(value, lng)
    } else {
      onLocationChange(lat, value)
    }
    // Clear the link field when manually editing
    if (value) {
      const newLat = field === 'lat' ? parseFloat(value) : currentLat
      const newLng = field === 'lng' ? parseFloat(value) : currentLng
      if (newLat && newLng && !isNaN(newLat) && !isNaN(newLng)) {
        setMapsLink(generateGoogleMapsUrl(newLat, newLng))
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Google Maps Link Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          📍 Location (paste Google Maps link)
        </label>
        <input
          type="text"
          value={mapsLink}
          onChange={e => handleLinkPaste(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Paste Google Maps link here (e.g., https://maps.google.com/...)"
        />
        {linkError && (
          <p className="text-xs text-orange-600 mt-1">{linkError}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Open Google Maps, find the exact location, right-click and select "Share" or copy the URL from your browser.
        </p>
      </div>

      {/* Map Picker */}
      {isLoaded ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Or click on the map to select location
          </label>
          <div className="border rounded-lg overflow-hidden">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={hasValidCoords ? 17 : 12}
              onClick={handleMapClick}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false
              }}
            >
              {hasValidCoords && (
                <Marker
                  position={{ lat: currentLat!, lng: currentLng! }}
                  draggable={true}
                  onDragEnd={(e) => {
                    if (e.latLng) {
                      const newLat = e.latLng.lat()
                      const newLng = e.latLng.lng()
                      onLocationChange(newLat.toFixed(6), newLng.toFixed(6))
                      setMapsLink(generateGoogleMapsUrl(newLat, newLng))
                    }
                  }}
                />
              )}
            </GoogleMap>
          </div>
          {hasValidCoords && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Location selected: {currentLat!.toFixed(6)}, {currentLng!.toFixed(6)}
              <span className="text-gray-500 ml-2">(drag marker to adjust)</span>
            </p>
          )}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
          Loading map...
        </div>
      )}

      {/* Advanced: Manual Coordinates */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {showAdvanced ? '▼' : '▶'} Advanced: Enter coordinates manually
        </button>
        
        {showAdvanced && (
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={e => handleManualChange('lat', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="e.g., 1.3489"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={e => handleManualChange('lng', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="e.g., 103.7495"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
