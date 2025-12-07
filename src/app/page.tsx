'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import MapView from '@/components/MapView'
import CarparkList from '@/components/CarparkList'
import { GoogleMapsProvider, useGoogleMaps } from '@/components/GoogleMapsProvider'
import { Carpark, SearchState } from '@/types/carpark'

function HomeContent() {
  const { isLoaded } = useGoogleMaps()
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    center: null,
    carparks: [],
    selectedCarparkId: null,
    isLoading: false,
    error: null
  })

  // Initialize geocoder when Google Maps loads
  useEffect(() => {
    if (isLoaded && typeof google !== 'undefined' && !geocoder) {
      setGeocoder(new google.maps.Geocoder())
    }
  }, [isLoaded, geocoder])

  const searchCarparks = async (lat: number, lng: number) => {
    const searchResponse = await fetch(
      `/api/carparks/search?lat=${lat}&lng=${lng}&radiusMeters=5000`
    )
    if (!searchResponse.ok) {
      throw new Error('Failed to search carparks')
    }
    return await searchResponse.json()
  }

  const handleSearch = async (query: string) => {
    setSearchState(prev => ({ ...prev, isLoading: true, error: null, query }))

    if (!isLoaded || !geocoder) {
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Map is still loading. Please wait a moment and try again.'
      }))
      return
    }

    try {
      // Use client-side geocoding (works with referrer-restricted API keys)
      const searchQuery = query.toLowerCase().includes('singapore') ? query : `${query}, Singapore`
      
      geocoder.geocode({ address: searchQuery, region: 'sg' }, async (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const location = results[0].geometry.location
          const lat = location.lat()
          const lng = location.lng()

          try {
            const carparks: Carpark[] = await searchCarparks(lat, lng)

            setSearchState(prev => ({
              ...prev,
              center: { lat, lng },
              carparks,
              selectedCarparkId: null,
              isLoading: false
            }))
          } catch (error) {
            setSearchState(prev => ({
              ...prev,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to search carparks'
            }))
          }
        } else {
          setSearchState(prev => ({
            ...prev,
            isLoading: false,
            error: status === 'ZERO_RESULTS' ? `No results found for "${query}"` : `Geocoding failed: ${status}`
          }))
        }
      })
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Search failed'
      }))
    }
  }

  const handleUseLocation = () => {
    setSearchState(prev => ({ ...prev, isLoading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Search for nearby carparks using current location
          const carparks: Carpark[] = await searchCarparks(latitude, longitude)

          setSearchState(prev => ({
            ...prev,
            query: 'Current location',
            center: { lat: latitude, lng: longitude },
            carparks,
            selectedCarparkId: null,
            isLoading: false
          }))
        } catch (error) {
          setSearchState(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Location search failed'
          }))
        }
      },
      (error) => {
        setSearchState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Unable to get your location. Please check permissions.'
        }))
      }
    )
  }

  const handleSelectCarpark = (carparkId: string | null) => {
    setSearchState(prev => ({ ...prev, selectedCarparkId: carparkId }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">SG Motorbike Parking</h1>
            <p className="mt-2 text-gray-600">Find motorcycle parking in Singapore</p>
        </div>

          <div className="mt-6">
            <SearchBar
              onSearch={handleSearch}
              onUseLocation={handleUseLocation}
              isLoading={searchState.isLoading}
            />
            {!isLoaded && (
              <p className="text-center text-sm text-gray-500 mt-2">Loading map...</p>
            )}
          </div>

          {searchState.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{searchState.error}</p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      {searchState.center && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <MapView
                  center={searchState.center}
                  carparks={searchState.carparks}
                  selectedCarparkId={searchState.selectedCarparkId}
                  onSelectCarpark={handleSelectCarpark}
                />
              </div>
            </div>

            {/* Results List */}
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Nearby Motorcycle Parking
                  {searchState.carparks.length > 0 && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({searchState.carparks.length} found within 5km)
                    </span>
                  )}
                </h2>

                <CarparkList
                  carparks={searchState.carparks}
                  selectedCarparkId={searchState.selectedCarparkId}
                  onSelectCarpark={handleSelectCarpark}
                />
                
                {searchState.carparks.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Note: Our database is still growing. If you know of motorcycle parking spots not shown here, they may not be in our system yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Initial state - show instructions */}
      {!searchState.center && !searchState.isLoading && (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
              🏍️
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Find Motorcycle Parking in Singapore
            </h2>
            <p className="text-gray-600 mb-6">
              Search for a location or use your current position to find nearby motorcycle parking spots.
              Our database includes accurate information about HDB lots, mall parking, and public facilities.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-8">
              <div>
                <div className="text-2xl mb-1">🏢</div>
                HDB & Mall Parking
              </div>
              <div>
                <div className="text-2xl mb-1">📍</div>
                Precise Locations
              </div>
              <div>
                <div className="text-2xl mb-1">💰</div>
                Pricing Info
              </div>
            </div>
            <div className="border-t pt-6">
              <p className="text-gray-500 text-sm mb-3">Know a motorcycle parking spot we're missing?</p>
              <a
                href="/suggest"
                className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Suggest a Location
              </a>
            </div>
        </div>
      </main>
      )}
    </div>
  )
}

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  
  return (
    <GoogleMapsProvider apiKey={apiKey}>
      <HomeContent />
    </GoogleMapsProvider>
  )
}