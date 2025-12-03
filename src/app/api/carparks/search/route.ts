import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDistanceInMeters, getBoundingBox } from '@/lib/geo'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')
  const radiusMeters = parseFloat(searchParams.get('radiusMeters') || '2000') // Default 2km

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Valid lat and lng parameters are required' }, { status: 400 })
  }

  try {
    // Get bounding box for rough filtering
    const bbox = getBoundingBox(lat, lng, radiusMeters)

    // Query carparks with rough bounding box filter (only verified)
    const carparks = await prisma.carpark.findMany({
      where: {
        motorcycleAllowed: true,
        verified: true, // Only show verified carparks
        lat: {
          gte: bbox.minLat,
          lte: bbox.maxLat
        },
        lng: {
          gte: bbox.minLng,
          lte: bbox.maxLng
        }
      },
      include: {
        photos: {
          take: 2, // Get up to 2 photos
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    // Calculate precise distances and filter by radius
    const results = carparks
      .map(carpark => ({
        ...carpark,
        distance: getDistanceInMeters(lat, lng, carpark.lat, carpark.lng)
      }))
      .filter(carpark => carpark.distance <= radiusMeters)
      .sort((a, b) => a.distance - b.distance)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Carpark search error:', error)
    return NextResponse.json(
      { error: 'Failed to search carparks' },
      { status: 500 }
    )
  }
}
