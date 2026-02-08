import { PrismaClient, Source } from '@prisma/client'

const prisma = new PrismaClient()
const AVAILABILITY_URL = 'https://api.data.gov.sg/v1/transport/carpark-availability'
const API_KEY = process.env.DATA_GOV_API_KEY

type CarparkInfo = {
  total_lots: string
  lot_type: string
  lots_available: string
}

type ApiCarpark = {
  carpark_number: string
  carpark_info: CarparkInfo[]
}

type MotoAvailability = {
  hasMoto: boolean
  totalLots: number | null
  availableLots: number | null
}

async function fetchAvailability(): Promise<Map<string, MotoAvailability>> {
  const headers: Record<string, string> = {}
  if (API_KEY) {
    headers['api-key'] = API_KEY
  }

  const response = await fetch(AVAILABILITY_URL, { headers })
  if (!response.ok) {
    throw new Error(`Availability API failed with status ${response.status}`)
  }

  const payload = await response.json()
  const carparkData: ApiCarpark[] = payload?.items?.[0]?.carpark_data || []
  if (!Array.isArray(carparkData) || carparkData.length === 0) {
    throw new Error('Availability API returned no carpark_data')
  }

  const availabilityMap = new Map<string, MotoAvailability>()

  for (const entry of carparkData) {
    const moto = entry.carpark_info?.find((info) => info.lot_type === 'Y')
    const hasMoto = Boolean(moto)
    const totalLots = hasMoto ? Number(moto?.total_lots) : null
    const availableLots = hasMoto ? Number(moto?.lots_available) : null

    availabilityMap.set(entry.carpark_number, {
      hasMoto,
      totalLots: Number.isFinite(totalLots) ? totalLots : null,
      availableLots: Number.isFinite(availableLots) ? availableLots : null
    })
  }

  return availabilityMap
}

async function main() {
  const availability = await fetchAvailability()
  const hdbCarparks = await prisma.carpark.findMany({
    where: { source: Source.HDB },
    select: { id: true, externalId: true }
  })

  let updated = 0
  let skipped = 0
  const timestamp = new Date()

  for (const carpark of hdbCarparks) {
    const moto = availability.get(carpark.externalId)

    if (!moto) {
      skipped += 1
      continue // Avoid wiping data when the API returns incomplete data
    }

    await prisma.carpark.update({
      where: { id: carpark.id },
      data: {
        motorcycleAllowed: moto.hasMoto ? true : false,
        totalMotoLots: moto.hasMoto ? moto.totalLots : null,
        lastAvailabilitySyncAt: timestamp
      }
    })

    updated += 1
  }

  console.log(
    `Enriched motorcycle data for ${updated} HDB carparks. Skipped ${skipped} missing in API.`
  )
}

main()
  .catch((error) => {
    console.error('Enrichment failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

