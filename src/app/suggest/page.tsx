'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GoogleMapsProvider } from '@/components/GoogleMapsProvider'
import LocationPicker from '@/components/LocationPicker'

// Singapore towns
const SINGAPORE_TOWNS = [
  'Ang Mo Kio', 'Bedok', 'Bishan', 'Bukit Batok', 'Bukit Merah', 'Bukit Panjang',
  'Bukit Timah', 'Central', 'Changi', 'Choa Chu Kang', 'Clementi', 'Geylang',
  'Hougang', 'Jurong East', 'Jurong West', 'Kallang', 'Marine Parade', 'Novena',
  'Orchard', 'Pasir Ris', 'Punggol', 'Queenstown', 'Sembawang', 'Sengkang',
  'Serangoon', 'Tampines', 'Toa Payoh', 'Woodlands', 'Yishun', 'Other'
]

function SuggestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    town: '',
    lat: '',
    lng: '',
    type: 'HDB',
    motorcycleAllowed: true,
    carAllowed: true,
    totalMotoLots: '',
    covered: false,
    pricingNotes: '',
    entranceNotes: '',
    photoUrl1: '',
    photoCaption1: '',
    photoUrl2: '',
    photoCaption2: '',
    submitterName: '',
    submitterEmail: ''
  })

  const handleLocationChange = (lat: string, lng: string) => {
    setFormData(prev => ({ ...prev, lat, lng }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validate location
    if (!formData.lat || !formData.lng) {
      setError('Please select a location on the map or paste a Google Maps link')
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng),
          totalMotoLots: formData.totalMotoLots ? parseInt(formData.totalMotoLots) : null
        })
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to submit suggestion')
      }
    } catch (err) {
      setError('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your suggestion has been submitted for review. Once verified, it will appear on the map.
          </p>
          <div className="space-x-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Map
            </Link>
            <button
              onClick={() => {
                setSubmitted(false)
                setFormData({
                  name: '', address: '', town: '', lat: '', lng: '', type: 'HDB',
                  motorcycleAllowed: true, carAllowed: true, totalMotoLots: '',
                  covered: false, pricingNotes: '', entranceNotes: '',
                  photoUrl1: '', photoCaption1: '', photoUrl2: '', photoCaption2: '',
                  submitterName: '', submitterEmail: ''
                })
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Map
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Suggest a Parking Location</h1>
            <p className="text-gray-600 mt-2">
              Help fellow riders by adding motorcycle parking spots you know about.
              Submissions are reviewed before going live.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 border-b pb-2">📍 Location Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bukit Batok MRT Motorcycle Parking"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Town *</label>
                  <select
                    required
                    value={formData.town}
                    onChange={e => setFormData({ ...formData, town: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Town</option>
                    {SINGAPORE_TOWNS.map(town => (
                      <option key={town} value={town}>{town}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="HDB">HDB Carpark</option>
                    <option value="MALL">Shopping Mall</option>
                    <option value="PUBLIC">Public/MRT</option>
                    <option value="OFFICE">Office Building</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 10 Bukit Batok Central, Singapore 658718"
                />
              </div>

              {/* Location Picker */}
              <LocationPicker
                lat={formData.lat}
                lng={formData.lng}
                onLocationChange={handleLocationChange}
              />
            </div>

            {/* Parking Details */}
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 border-b pb-2">🏍️ Parking Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motorcycle Lots
                  </label>
                  <input
                    type="number"
                    value={formData.totalMotoLots}
                    onChange={e => setFormData({ ...formData, totalMotoLots: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Approx. number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pricing
                  </label>
                  <input
                    type="text"
                    value={formData.pricingNotes}
                    onChange={e => setFormData({ ...formData, pricingNotes: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., $0.65 per 30 min"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.motorcycleAllowed}
                    onChange={e => setFormData({ ...formData, motorcycleAllowed: e.target.checked })}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-sm">Motorcycles Allowed</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.carAllowed}
                    onChange={e => setFormData({ ...formData, carAllowed: e.target.checked })}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-sm">Cars Also Allowed</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.covered}
                    onChange={e => setFormData({ ...formData, covered: e.target.checked })}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-sm">Covered/Sheltered</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entrance Notes (optional)
                </label>
                <textarea
                  value={formData.entranceNotes}
                  onChange={e => setFormData({ ...formData, entranceNotes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="e.g., Enter via back alley behind the coffee shop"
                />
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 border-b pb-2">📸 Photos (optional)</h2>
              <p className="text-sm text-gray-600">
                Add up to 2 photos. You can use image URLs from Imgur, Google Photos (shared link), or any image hosting service.
              </p>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="url"
                    value={formData.photoUrl1}
                    onChange={e => setFormData({ ...formData, photoUrl1: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Photo 1 URL"
                  />
                  <input
                    type="text"
                    value={formData.photoCaption1}
                    onChange={e => setFormData({ ...formData, photoCaption1: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Caption (e.g., Entrance view)"
                  />
                </div>
                {formData.photoUrl1 && (
                  <img src={formData.photoUrl1} alt="Preview 1" className="h-32 object-cover rounded-lg" 
                    onError={(e) => (e.currentTarget.style.display = 'none')} />
                )}
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="url"
                    value={formData.photoUrl2}
                    onChange={e => setFormData({ ...formData, photoUrl2: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Photo 2 URL"
                  />
                  <input
                    type="text"
                    value={formData.photoCaption2}
                    onChange={e => setFormData({ ...formData, photoCaption2: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Caption"
                  />
                </div>
                {formData.photoUrl2 && (
                  <img src={formData.photoUrl2} alt="Preview 2" className="h-32 object-cover rounded-lg"
                    onError={(e) => (e.currentTarget.style.display = 'none')} />
                )}
              </div>
            </div>

            {/* Submitter Info */}
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 border-b pb-2">👤 Your Info (optional)</h2>
              <p className="text-sm text-gray-600">
                Leave your name if you'd like to be credited. Email is only for verification if needed.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.submitterName}
                    onChange={e => setFormData({ ...formData, submitterName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.submitterEmail}
                    onChange={e => setFormData({ ...formData, submitterEmail: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com (optional)"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function SuggestPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  
  return (
    <GoogleMapsProvider apiKey={apiKey}>
      <SuggestForm />
    </GoogleMapsProvider>
  )
}