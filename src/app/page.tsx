'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import MapView from '@/components/MapView'
import CarparkList from '@/components/CarparkList'
import { GoogleMapsProvider, useGoogleMaps } from '@/components/GoogleMapsProvider'
import { Carpark, SearchState } from '@/types/carpark'
import { PRESET_AREAS } from '@/lib/presetAreas'

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
    const data = await searchResponse.json().catch(() => ({}))
    if (!searchResponse.ok) {
      const message = typeof data?.error === 'string' ? data.error : 'Failed to search carparks'
      throw new Error(message)
    }
    return data
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

  const handlePresetArea = async (lat: number, lng: number, label: string) => {
    setSearchState(prev => ({ ...prev, isLoading: true, error: null, query: label }))
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

  const resetToHome = () => {
    setSearchState({
      query: '',
      center: null,
      carparks: [],
      selectedCarparkId: null,
      isLoading: false,
      error: null
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              onClick={resetToHome}
              className="text-center sm:text-left flex-1 block hover:opacity-90 transition-opacity"
              aria-label="Go back to home"
            >
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">SG Motorbike Parking</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Find motorcycle parking in Singapore</p>
            </Link>
            
            {/* Suggest button in header - always visible */}
            <Link
              href="/suggest"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              <span className="text-lg">+</span>
              <span>Suggest a Location</span>
            </Link>
          </div>

          <div className="mt-6">
            <SearchBar
              onSearch={handleSearch}
              onUseLocation={handleUseLocation}
              isLoading={searchState.isLoading}
            />
            {!isLoaded && (
              <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-2">Loading map...</p>
            )}
          </div>

          {searchState.error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700/50 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{searchState.error}</p>
            </div>
          )}

          {/* Preset areas - show when results are visible so users can switch area */}
          {searchState.center && (
            <div className="mt-4">
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Parking hotspots:</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_AREAS.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => handlePresetArea(area.lat, area.lng, area.label)}
                    disabled={searchState.isLoading}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      searchState.query === area.label
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {area.label}
                  </button>
                ))}
              </div>
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
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
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
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700/50 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Nearby Motorcycle Parking
                  {searchState.carparks.length > 0 && (
                    <span className="text-sm font-normal text-slate-600 dark:text-slate-400 ml-2">
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
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Note: Our database is still growing. If you know of motorcycle parking spots not shown here, they may not be in our system yet.
                  </p>
                )}

                {/* Banner to suggest location */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Can't find your usual parking spot?{' '}
                    <Link href="/suggest" className="text-blue-400 hover:text-blue-300 underline transition-colors">
                      Suggest it here
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Loading state (e.g. after clicking a preset or use my location) */}
      {!searchState.center && searchState.isLoading && (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-block w-10 h-10 border-2 border-slate-500 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Finding motorcycle parking...</p>
        </main>
      )}

      {/* Initial state - show instructions */}
      {!searchState.center && !searchState.isLoading && (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 text-slate-600 dark:text-slate-400 mb-6 text-6xl">
              🏍️
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Find Motorcycle Parking in Singapore
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg">
              Search for a location or use your current position to find nearby motorcycle parking spots.
              Our database includes accurate information about HDB lots, mall parking, and public facilities.
            </p>

            <div className="mb-8">
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">Or pick a parking hotspot:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {PRESET_AREAS.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => handlePresetArea(area.lat, area.lng, area.label)}
                    disabled={searchState.isLoading}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {area.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-700 dark:text-slate-300 mb-10">
              <div className="bg-white/80 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700/50">
                <div className="text-3xl mb-2">🏢</div>
                <div className="font-medium">HDB & Mall Parking</div>
              </div>
              <div className="bg-white/80 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700/50">
                <div className="text-3xl mb-2">📍</div>
                <div className="font-medium">Precise Locations</div>
              </div>
              <div className="bg-white/80 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700/50">
                <div className="text-3xl mb-2">💰</div>
                <div className="font-medium">Pricing Info</div>
              </div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700/50 pt-6">
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Know a motorcycle parking spot we're missing?</p>
              <Link
                href="/suggest"
                className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 font-medium"
              >
                + Suggest a Location
              </Link>
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