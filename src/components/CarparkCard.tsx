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
          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
          : 'border-slate-700 bg-slate-700/30 hover:border-slate-600 hover:bg-slate-700/50 hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-white text-sm leading-tight">
          {carpark.name}
        </h3>
        {carpark.distance && (
          <span className="text-xs text-slate-400 ml-2 whitespace-nowrap font-medium">
            {formatDistance(carpark.distance)}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-300 mb-3 line-clamp-2">
        {carpark.address}
      </p>

      <div className="flex items-center justify-between text-xs mb-2">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          carpark.carAllowed
            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        }`}>
          {carpark.carAllowed ? '🚗 Car + Motorcycle' : '🏍️ Motorcycle only'}
        </span>
        <span className="text-slate-400">
          {getTypeLabel(carpark.type)}
        </span>
      </div>

      {carpark.pricingNotes && (
        <p className="text-xs text-slate-300 mt-2 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
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
              className={`${carpark.photos.length === 1 ? 'w-full' : 'w-1/2'} h-20 object-cover rounded border border-slate-700/50`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
