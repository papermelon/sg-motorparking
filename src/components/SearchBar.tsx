'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  onUseLocation: () => void
  isLoading: boolean
}

export default function SearchBar({ onSearch, onUseLocation, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      onUseLocation()
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a place (e.g., Yishun MRT)"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '...' : 'Search'}
        </button>
      </form>

      <div className="mt-3 text-center">
        <button
          onClick={handleUseLocation}
          disabled={isLoading}
          className="px-4 py-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📍 Use my location
        </button>
      </div>
    </div>
  )
}
