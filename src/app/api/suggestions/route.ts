import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Submit a new suggestion
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.address || !data.town || !data.lat || !data.lng) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate coordinates are in Singapore
    if (data.lat < 1.1 || data.lat > 1.5 || data.lng < 103.6 || data.lng > 104.1) {
      return NextResponse.json(
        { error: 'Coordinates must be within Singapore' },
        { status: 400 }
      )
    }

    // Create the carpark (unverified by default)
    const carpark = await prisma.carpark.create({
      data: {
        name: data.name,
        address: data.address,
        town: data.town,
        lat: data.lat,
        lng: data.lng,
        type: data.type || 'OTHER',
        motorcycleAllowed: data.motorcycleAllowed ?? true,
        carAllowed: data.carAllowed ?? false,
        totalMotoLots: data.totalMotoLots,
        covered: data.covered ?? false,
        pricingNotes: data.pricingNotes,
        entranceNotes: data.entranceNotes,
        verified: false // All suggestions start unverified
      }
    })

    // Add photos if provided
    const photos = []
    if (data.photoUrl1) {
      photos.push({
        carparkId: carpark.id,
        url: data.photoUrl1,
        caption: data.photoCaption1 || null
      })
    }
    if (data.photoUrl2) {
      photos.push({
        carparkId: carpark.id,
        url: data.photoUrl2,
        caption: data.photoCaption2 || null
      })
    }

    if (photos.length > 0) {
      await prisma.photo.createMany({
        data: photos
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Suggestion submitted successfully',
      id: carpark.id
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to create suggestion:', error)
    return NextResponse.json(
      { error: 'Failed to submit suggestion' },
      { status: 500 }
    )
  }
}

// GET - Get all pending (unverified) suggestions (for admin)
export async function GET() {
  try {
    const suggestions = await prisma.carpark.findMany({
      where: { verified: false },
      include: { photos: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('Failed to fetch suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    )
  }
}
