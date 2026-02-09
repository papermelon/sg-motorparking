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
      // Select only columns that exist in older schemas to avoid runtime failures
      // when the database is behind the current Prisma model.
      select: {
        id: true,
        name: true,
        address: true,
        town: true,
        lat: true,
        lng: true,
        type: true,
        motorcycleAllowed: true,
        carAllowed: true,
        totalMotoLots: true,
        covered: true,
        seasonOnly: true,
        pricingNotes: true,
        openingHours: true,
        entranceNotes: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
        photos: {
          take: 2, // Get up to 2 photos
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            carparkId: true,
            url: true,
            caption: true,
            takenAt: true,
            createdAt: true
          }
        }
      },
    })

    // Calculate precise distances and filter by radius
    const results = carparks
      .map(carpark => ({
        ...carpark,
        externalId: carpark.id,
        source: 'COMMUNITY' as const,
        confidenceLevel: 'community' as const,
        lastAvailabilitySyncAt: null,
        distance: getDistanceInMeters(lat, lng, carpark.lat, carpark.lng)
      }))
      .filter(carpark => carpark.distance <= radiusMeters)
      .sort((a, b) => a.distance - b.distance)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Carpark search error:', error)
    
    // Log full error details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    // Check for common database connection errors
    const errorMessage = error instanceof Error ? error.message : String(error)
    let userMessage = 'Failed to search carparks'
    
    if (errorMessage.includes('P1001') || errorMessage.includes('Can\'t reach database')) {
      userMessage = 'Database connection failed. Please check your database configuration.'
    } else if (errorMessage.includes('P2025') || errorMessage.includes('Record not found')) {
      userMessage = 'Database query failed. Please check your database schema.'
    } else if (errorMessage.includes('P2002') || errorMessage.includes('Unique constraint')) {
      userMessage = 'Database constraint error.'
    }
    
    // In development, show more details
    const errorDetails = process.env.NODE_ENV === 'development' 
      ? `${userMessage}: ${errorMessage}` 
      : userMessage
    
    return NextResponse.json(
      { error: errorDetails },
      { status: 500 }
    )
  }
}
