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
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your location (e.g., Yishun MRT)"
          className="flex-1 px-5 py-3.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-8 py-3.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
        >
          {isLoading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            'Search'
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={handleUseLocation}
          disabled={isLoading}
          className="px-4 py-2 text-blue-400 hover:text-blue-300 focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          📍 Use my location
        </button>
      </div>
    </div>
  )
}
