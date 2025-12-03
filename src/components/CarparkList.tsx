import { Carpark } from '@/types/carpark'
import CarparkCard from './CarparkCard'

interface CarparkListProps {
  carparks: Carpark[]
  selectedCarparkId: string | null
  onSelectCarpark: (carparkId: string | null) => void
}

export default function CarparkList({ carparks, selectedCarparkId, onSelectCarpark }: CarparkListProps) {
  if (carparks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No motorcycle parking found nearby.</p>
        <p className="text-sm text-gray-400 mt-1">Try searching in a different area.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {carparks.map((carpark) => (
        <CarparkCard
          key={carpark.id}
          carpark={carpark}
          isSelected={carpark.id === selectedCarparkId}
          onClick={() => onSelectCarpark(carpark.id === selectedCarparkId ? null : carpark.id)}
        />
      ))}
    </div>
  )
}
