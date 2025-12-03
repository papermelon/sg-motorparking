'use client'

import { useState, useEffect, useMemo } from 'react'

interface Photo {
  id: string
  url: string
  caption?: string
}

interface Carpark {
  id: string
  name: string
  address: string
  town?: string
  lat: number
  lng: number
  type: string
  motorcycleAllowed: boolean
  carAllowed: boolean
  totalMotoLots?: number
  covered?: boolean
  pricingNotes?: string
  entranceNotes?: string
  verified?: boolean
  photos?: Photo[]
  createdAt?: string
}

type SortField = 'name' | 'town' | 'type' | 'totalMotoLots' | 'address'
type SortDirection = 'asc' | 'desc'
type TabType = 'verified' | 'pending'

// Singapore towns for filtering
const SINGAPORE_TOWNS = [
  'All Towns',
  'Ang Mo Kio', 'Bedok', 'Bishan', 'Bukit Batok', 'Bukit Merah', 'Bukit Panjang',
  'Bukit Timah', 'Central', 'Changi', 'Choa Chu Kang', 'Clementi', 'Geylang',
  'Hougang', 'Jurong East', 'Jurong West', 'Kallang', 'Marine Parade', 'Novena',
  'Orchard', 'Pasir Ris', 'Punggol', 'Queenstown', 'Sembawang', 'Sengkang',
  'Serangoon', 'Tampines', 'Toa Payoh', 'Woodlands', 'Yishun', 'Other'
]

export default function AdminPage() {
  const [carparks, setCarparks] = useState<Carpark[]>([])
  const [pendingSuggestions, setPendingSuggestions] = useState<Carpark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('verified')
  const [reviewingCarpark, setReviewingCarpark] = useState<Carpark | null>(null)
  
  // Sorting & Filtering
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filterTown, setFilterTown] = useState('All Towns')
  const [filterType, setFilterType] = useState('All Types')
  const [searchQuery, setSearchQuery] = useState('')
  
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
    photoCaption2: ''
  })

  useEffect(() => {
    fetchCarparks()
    fetchPendingSuggestions()
  }, [])

  const fetchCarparks = async () => {
    try {
      const res = await fetch('/api/admin/carparks')
      const data = await res.json()
      setCarparks(data.filter((cp: Carpark) => cp.verified !== false))
    } catch (error) {
      console.error('Failed to fetch carparks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPendingSuggestions = async () => {
    try {
      const res = await fetch('/api/suggestions')
      const data = await res.json()
      setPendingSuggestions(data)
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
    }
  }

  // Sorted and filtered carparks
  const filteredAndSortedCarparks = useMemo(() => {
    let result = [...carparks]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(cp => 
        cp.name.toLowerCase().includes(query) ||
        cp.address.toLowerCase().includes(query) ||
        (cp.town?.toLowerCase().includes(query))
      )
    }

    if (filterTown !== 'All Towns') {
      result = result.filter(cp => cp.town === filterTown)
    }

    if (filterType !== 'All Types') {
      result = result.filter(cp => cp.type === filterType)
    }

    result.sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      switch (sortField) {
        case 'name': aVal = a.name.toLowerCase(); bVal = b.name.toLowerCase(); break
        case 'town': aVal = (a.town || '').toLowerCase(); bVal = (b.town || '').toLowerCase(); break
        case 'type': aVal = a.type; bVal = b.type; break
        case 'totalMotoLots': aVal = a.totalMotoLots || 0; bVal = b.totalMotoLots || 0; break
        case 'address': aVal = a.address.toLowerCase(); bVal = b.address.toLowerCase(); break
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [carparks, searchQuery, filterTown, filterType, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  const resetForm = () => {
    setFormData({
      name: '', address: '', town: '', lat: '', lng: '', type: 'HDB',
      motorcycleAllowed: true, carAllowed: true, totalMotoLots: '',
      covered: false, pricingNotes: '', entranceNotes: '',
      photoUrl1: '', photoCaption1: '', photoUrl2: '', photoCaption2: ''
    })
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const payload = {
      ...formData,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      totalMotoLots: formData.totalMotoLots ? parseInt(formData.totalMotoLots) : null,
      verified: true
    }

    try {
      const url = editingId ? `/api/admin/carparks/${editingId}` : '/api/admin/carparks'
      const method = editingId ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setMessage({ type: 'success', text: editingId ? 'Carpark updated!' : 'Carpark added!' })
        resetForm()
        setShowForm(false)
        fetchCarparks()
      } else {
        const error = await res.json()
        setMessage({ type: 'error', text: error.message || 'Failed to save' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save carpark' })
    }
  }

  const handleEdit = (carpark: Carpark) => {
    setFormData({
      name: carpark.name,
      address: carpark.address,
      town: carpark.town || '',
      lat: carpark.lat.toString(),
      lng: carpark.lng.toString(),
      type: carpark.type,
      motorcycleAllowed: carpark.motorcycleAllowed,
      carAllowed: carpark.carAllowed,
      totalMotoLots: carpark.totalMotoLots?.toString() || '',
      covered: carpark.covered || false,
      pricingNotes: carpark.pricingNotes || '',
      entranceNotes: carpark.entranceNotes || '',
      photoUrl1: carpark.photos?.[0]?.url || '',
      photoCaption1: carpark.photos?.[0]?.caption || '',
      photoUrl2: carpark.photos?.[1]?.url || '',
      photoCaption2: carpark.photos?.[1]?.caption || ''
    })
    setEditingId(carpark.id)
    setShowForm(true)
    setActiveTab('verified')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this carpark?')) return

    try {
      const res = await fetch(`/api/admin/carparks/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Carpark deleted!' })
        fetchCarparks()
        fetchPendingSuggestions()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' })
    }
  }

  const handleApprove = async (carpark: Carpark) => {
    try {
      const res = await fetch(`/api/suggestions/${carpark.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...carpark, verified: true })
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Suggestion approved!' })
        setReviewingCarpark(null)
        fetchCarparks()
        fetchPendingSuggestions()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to approve' })
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Reject and delete this suggestion?')) return

    try {
      const res = await fetch(`/api/suggestions/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Suggestion rejected' })
        setReviewingCarpark(null)
        fetchPendingSuggestions()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reject' })
    }
  }

  const uniqueTowns = useMemo(() => {
    const towns = new Set(carparks.map(cp => cp.town).filter(Boolean))
    return ['All Towns', ...Array.from(towns).sort()] as string[]
  }, [carparks])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin: Manage Carparks</h1>
            <p className="text-gray-600 mt-1">Add, edit, or remove motorcycle parking locations</p>
          </div>
          <div className="space-x-2">
            <a href="/" className="px-4 py-2 text-gray-600 hover:text-gray-800">
              ← Back to App
            </a>
            <button
              onClick={() => { resetForm(); setShowForm(!showForm); setActiveTab('verified') }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {showForm ? 'Cancel' : '+ Add Carpark'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('verified')}
            className={`px-6 py-3 font-medium ${activeTab === 'verified' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            ✓ Verified ({carparks.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-medium ${activeTab === 'pending' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            ⏳ Pending Review ({pendingSuggestions.length})
            {pendingSuggestions.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                {pendingSuggestions.length}
              </span>
            )}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && activeTab === 'verified' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Carpark' : 'Add New Carpark'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" required value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bukit Batok MRT Motorcycle Parking" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Town *</label>
                <select required value={formData.town}
                  onChange={e => setFormData({ ...formData, town: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Town</option>
                  {SINGAPORE_TOWNS.filter(t => t !== 'All Towns').map(town => (
                    <option key={town} value={town}>{town}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input type="text" required value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                <input type="number" step="any" required value={formData.lat}
                  onChange={e => setFormData({ ...formData, lat: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                <input type="number" step="any" required value={formData.lng}
                  onChange={e => setFormData({ ...formData, lng: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="HDB">HDB</option>
                  <option value="MALL">Mall</option>
                  <option value="OFFICE">Office</option>
                  <option value="PUBLIC">Public</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Moto Lots</label>
                <input type="number" value={formData.totalMotoLots}
                  onChange={e => setFormData({ ...formData, totalMotoLots: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Notes</label>
                <input type="text" value={formData.pricingNotes}
                  onChange={e => setFormData({ ...formData, pricingNotes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" checked={formData.motorcycleAllowed}
                    onChange={e => setFormData({ ...formData, motorcycleAllowed: e.target.checked })}
                    className="mr-2" /> Moto
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={formData.carAllowed}
                    onChange={e => setFormData({ ...formData, carAllowed: e.target.checked })}
                    className="mr-2" /> Car
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={formData.covered}
                    onChange={e => setFormData({ ...formData, covered: e.target.checked })}
                    className="mr-2" /> Covered
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo 1 URL</label>
                <input type="url" value={formData.photoUrl1}
                  onChange={e => setFormData({ ...formData, photoUrl1: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo 2 URL</label>
                <input type="url" value={formData.photoUrl2}
                  onChange={e => setFormData({ ...formData, photoUrl2: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="lg:col-span-3">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editingId ? 'Update Carpark' : 'Add Carpark'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pending Suggestions Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingSuggestions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
                No pending suggestions to review.
              </div>
            ) : (
              pendingSuggestions.map(suggestion => (
                <div key={suggestion.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{suggestion.name}</h3>
                      <p className="text-gray-600">{suggestion.address}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{suggestion.town}</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{suggestion.type}</span>
                        {suggestion.totalMotoLots && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">{suggestion.totalMotoLots} lots</span>
                        )}
                        {suggestion.pricingNotes && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">{suggestion.pricingNotes}</span>
                        )}
                      </div>
                      {suggestion.photos && suggestion.photos.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {suggestion.photos.map((photo, idx) => (
                            <img key={idx} src={photo.url} alt={photo.caption || ''} 
                              className="h-20 w-28 object-cover rounded" />
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Coords: {suggestion.lat}, {suggestion.lng}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleApprove(suggestion)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleEdit(suggestion)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Edit & Approve
                      </button>
                      <button
                        onClick={() => handleReject(suggestion.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Verified Carparks Tab */}
        {activeTab === 'verified' && !showForm && (
          <>
            {/* Filters & Search */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <input type="text" placeholder="Search by name or address..."
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <select value={filterTown} onChange={e => setFilterTown(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  {uniqueTowns.map(town => <option key={town} value={town}>{town}</option>)}
                </select>
                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="All Types">All Types</option>
                  <option value="HDB">HDB</option>
                  <option value="MALL">Mall</option>
                  <option value="PUBLIC">Public</option>
                  <option value="OFFICE">Office</option>
                  <option value="OTHER">Other</option>
                </select>
                <span className="text-sm text-gray-500">
                  {filteredAndSortedCarparks.length} of {carparks.length}
                </span>
              </div>
            </div>

            {/* Carparks Table */}
            <div className="bg-white rounded-lg shadow-sm border">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
                        <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('town')}>Town {getSortIcon('town')}</th>
                        <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('type')}>Type {getSortIcon('type')}</th>
                        <th className="px-4 py-3 text-left">Moto/Car</th>
                        <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('totalMotoLots')}>Lots {getSortIcon('totalMotoLots')}</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredAndSortedCarparks.map(carpark => (
                        <tr key={carpark.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{carpark.name}</td>
                          <td className="px-4 py-3 text-gray-600">{carpark.town || '-'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              carpark.type === 'HDB' ? 'bg-blue-100 text-blue-800' :
                              carpark.type === 'MALL' ? 'bg-purple-100 text-purple-800' :
                              carpark.type === 'PUBLIC' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'}`}>
                              {carpark.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {carpark.motorcycleAllowed ? '🏍️' : ''} 
                            {carpark.carAllowed ? '🚗' : ''}
                          </td>
                          <td className="px-4 py-3">{carpark.totalMotoLots || '-'}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleEdit(carpark)}
                              className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                            <button onClick={() => handleDelete(carpark.id)}
                              className="text-red-600 hover:text-red-800">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Link to Suggest Page */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📢 Share with the Community</h3>
          <p className="text-sm text-blue-800 mb-3">
            Anyone can suggest new motorcycle parking locations at:
          </p>
          <code className="bg-blue-100 px-3 py-1 rounded text-blue-900">
            {typeof window !== 'undefined' ? window.location.origin : ''}/suggest
          </code>
        </div>
      </div>
    </div>
  )
}