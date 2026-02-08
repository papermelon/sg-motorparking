import fs from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'csv-parse/sync'
import proj4 from 'proj4'
import { PrismaClient, Source, ConfidenceLevel } from '@prisma/client'

const prisma = new PrismaClient()

type RawCarparkRow = {
  car_park_no: string
  address: string
  x_coord: string
  y_coord: string
  car_park_type?: string
  type_of_parking_system?: string
  short_term_parking?: string
  free_parking?: string
  night_parking?: string
  car_park_decks?: string
  gantry_height?: string
  car_park_basement?: string
}

const SVY21_PROJECTION =
  '+proj=tmerc +lat_0=1.366666 +lon_0=103.833333 +k=1.0 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs'

const CSV_CANDIDATES = [
  process.env.HDB_CARPARK_CSV && path.resolve(process.env.HDB_CARPARK_CSV),
  path.resolve(process.cwd(), 'data/raw/hdb_carpark_information.csv'),
  '/mnt/data/HDBCarparkInformation.csv'
].filter(Boolean) as string[]

function svy21ToWgs84(x: number, y: number): { lat: number; lng: number } {
  const [lng, lat] = proj4(SVY21_PROJECTION, proj4.WGS84, [x, y])
  return { lat, lng }
}

async function loadCsv(): Promise<{ rows: RawCarparkRow[]; source: string }> {
  for (const candidate of CSV_CANDIDATES) {
    try {
      await fs.access(candidate)
      const content = await fs.readFile(candidate, 'utf8')
      const rows = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      }) as RawCarparkRow[]

      return { rows, source: candidate }
    } catch (error: any) {
      if (error?.code !== 'ENOENT') {
        console.warn(`Failed reading ${candidate}:`, error)
      }
    }
  }

  throw new Error(
    'HDB carpark CSV not found. Provide HDB_CARPARK_CSV or place the file at data/raw/hdb_carpark_information.csv'
  )
}

async function main() {
  const { rows, source } = await loadCsv()
  let created = 0
  let updated = 0
  let skipped = 0

  for (const row of rows) {
    const externalId = row.car_park_no?.trim()
    const x = Number(row.x_coord)
    const y = Number(row.y_coord)

    if (!externalId || !Number.isFinite(x) || !Number.isFinite(y)) {
      skipped += 1
      continue
    }

    const { lat, lng } = svy21ToWgs84(x, y)
    const existing = await prisma.carpark.findUnique({
      where: { externalId },
      select: { id: true }
    })

    await prisma.carpark.upsert({
      where: { externalId },
      update: {
        name: row.address,
        address: row.address,
        lat,
        lng,
        type: 'HDB',
        source: Source.HDB,
        confidenceLevel: ConfidenceLevel.official,
        carAllowed: true
      },
      create: {
        externalId,
        name: row.address,
        address: row.address,
        lat,
        lng,
        type: 'HDB',
        source: Source.HDB,
        confidenceLevel: ConfidenceLevel.official,
        motorcycleAllowed: null,
        carAllowed: true,
        totalMotoLots: null,
        verified: true
      }
    })

    if (existing) {
      updated += 1
    } else {
      created += 1
    }
  }

  console.log(
    `Imported HDB carparks from ${source}. Created: ${created}, Updated: ${updated}, Skipped: ${skipped}`
  )
}

main()
  .catch((error) => {
    console.error('Import failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

