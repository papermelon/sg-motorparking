'use client'

import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'
import { useCallback, useState } from 'react'
import { Carpark } from '@/types/carpark'
import { useGoogleMaps } from './GoogleMapsProvider'

interface MapViewProps {
  center: { lat: number; lng: number } | null
  carparks: Carpark[]
  selectedCarparkId: string | null
  onSelectCarpark: (carparkId: string | null) => void
}

const containerStyle = {
  width: '100%',
  height: '400px'
}

const defaultCenter = {
  lat: 1.3521, // Singapore center
  lng: 103.8198
}

// SVG marker URLs
const searchCenterMarkerUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#ef4444" stroke="white" stroke-width="2"/>
    <circle cx="12" cy="12" r="4" fill="white"/>
  </svg>
`)

const getMotoMarkerUrl = (color: string, isSelected: boolean) => {
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="3"/>
      <text x="16" y="21" text-anchor="middle" fill="white" font-size="14" font-weight="bold">M</text>
      ${isSelected ? '<circle cx="16" cy="16" r="18" fill="none" stroke="#ef4444" stroke-width="2"/>' : ''}
    </svg>
  `)
}

export default function MapView({ center, carparks, selectedCarparkId, onSelectCarpark }: MapViewProps) {
  const { isLoaded, loadError } = useGoogleMaps()
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const mapCenter = center || defaultCenter
  const selectedCarpark = selectedCarparkId ? carparks.find(c => c.id === selectedCarparkId) : null

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  if (loadError) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/50">
        <p className="text-red-400">Error loading Google Maps. Please check your API key.</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/50">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-slate-500 border-t-blue-500 rounded-full animate-spin mb-3"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={center ? 15 : 12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
      }}
    >
      {/* Search center marker */}
      {center && (
        <Marker
          position={center}
          icon={{
            url: searchCenterMarkerUrl,
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 12)
          }}
          title="Search location"
        />
      )}

      {/* Carpark markers */}
      {carparks.map((carpark) => {
        const isSelected = carpark.id === selectedCarparkId
        const color = carpark.carAllowed ? '#3b82f6' : '#10b981'
        
        return (
          <Marker
            key={carpark.id}
            position={{ lat: carpark.lat, lng: carpark.lng }}
            icon={{
              url: getMotoMarkerUrl(color, isSelected),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16)
            }}
            onClick={() => onSelectCarpark(carpark.id)}
            title={carpark.name}
          />
        )
      })}

      {/* Info window for selected carpark */}
      {selectedCarpark && (
        <InfoWindow
          position={{ lat: selectedCarpark.lat, lng: selectedCarpark.lng }}
          onCloseClick={() => onSelectCarpark(null)}
        >
          <div className="max-w-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
            <h3 className="font-semibold text-slate-900 dark:text-white">{selectedCarpark.name}</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{selectedCarpark.address}</p>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {selectedCarpark.carAllowed ? '🚗 Car + Motorcycle' : '🏍️ Motorcycle only'}
              </p>
              {selectedCarpark.distance && (
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  📍 {(selectedCarpark.distance / 1000).toFixed(1)} km away
                </p>
              )}
              {selectedCarpark.pricingNotes && (
                <p className="text-xs text-slate-600 dark:text-slate-400">{selectedCarpark.pricingNotes}</p>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}