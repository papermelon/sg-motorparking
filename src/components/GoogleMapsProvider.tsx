'use client'

import { useJsApiLoader, Libraries } from '@react-google-maps/api'
import { createContext, useContext, ReactNode } from 'react'

interface GoogleMapsContextType {
  isLoaded: boolean
  loadError: Error | undefined
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined
})

export function useGoogleMaps() {
  return useContext(GoogleMapsContext)
}

interface GoogleMapsProviderProps {
  children: ReactNode
  apiKey: string
}

// Libraries to load - places includes autocomplete and geocoding features
const libraries: Libraries = ['places']

export function GoogleMapsProvider({ children, apiKey }: GoogleMapsProviderProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries
  })

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  )
}
