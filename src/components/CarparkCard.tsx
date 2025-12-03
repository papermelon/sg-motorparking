import { Carpark } from '@/types/carpark'

interface CarparkCardProps {
  carpark: Carpark
  isSelected: boolean
  onClick: () => void
}

export default function CarparkCard({ carpark, isSelected, onClick }: CarparkCardProps) {
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`
    }
    return `${(meters / 1000).toFixed(1)}km`
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'HDB': return '🏢 HDB'
      case 'MALL': return '🛍️ Mall'
      case 'OFFICE': return '🏢 Office'
      case 'PUBLIC': return '🌳 Public'
      default: return '🏪 Other'
    }
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
          {carpark.name}
        </h3>
        {carpark.distance && (
          <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
            {formatDistance(carpark.distance)}
          </span>
        )}
      </div>

      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
        {carpark.address}
      </p>

      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          carpark.carAllowed
            ? 'bg-blue-100 text-blue-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {carpark.carAllowed ? 'Car + Moto' : 'Moto only'}
        </span>
        <span className="text-gray-500">
          {getTypeLabel(carpark.type)}
        </span>
      </div>

      {carpark.pricingNotes && (
        <p className="text-xs text-gray-500 mt-2">
          💰 {carpark.pricingNotes}
        </p>
      )}

      {carpark.photos && carpark.photos.length > 0 && (
        <div className="mt-3 flex gap-2">
          {carpark.photos.slice(0, 2).map((photo, idx) => (
            <img
              key={idx}
              src={photo.url}
              alt={photo.caption || carpark.name}
              className={`${carpark.photos.length === 1 ? 'w-full' : 'w-1/2'} h-20 object-cover rounded`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
