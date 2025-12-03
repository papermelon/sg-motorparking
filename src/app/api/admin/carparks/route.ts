import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all carparks
export async function GET() {
  try {
    const carparks = await prisma.carpark.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(carparks)
  } catch (error) {
    console.error('Failed to fetch carparks:', error)
    return NextResponse.json({ error: 'Failed to fetch carparks' }, { status: 500 })
  }
}

// POST create new carpark
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const carpark = await prisma.carpark.create({
      data: {
        name: data.name,
        address: data.address,
        town: data.town,
        lat: data.lat,
        lng: data.lng,
        type: data.type,
        motorcycleAllowed: data.motorcycleAllowed ?? true,
        carAllowed: data.carAllowed ?? true,
        totalMotoLots: data.totalMotoLots,
        covered: data.covered,
        pricingNotes: data.pricingNotes,
        openingHours: data.openingHours,
        entranceNotes: data.entranceNotes,
        verified: false // New submissions start as unverified
      }
    })

    return NextResponse.json(carpark, { status: 201 })
  } catch (error) {
    console.error('Failed to create carpark:', error)
    return NextResponse.json({ error: 'Failed to create carpark' }, { status: 500 })
  }
}
