import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single carpark
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const carpark = await prisma.carpark.findUnique({
      where: { id },
      include: { photos: true }
    })

    if (!carpark) {
      return NextResponse.json({ error: 'Carpark not found' }, { status: 404 })
    }

    return NextResponse.json(carpark)
  } catch (error) {
    console.error('Failed to fetch carpark:', error)
    return NextResponse.json({ error: 'Failed to fetch carpark' }, { status: 500 })
  }
}

// PUT update carpark
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const data = await request.json()

    const updateData: any = {
      name: data.name,
      address: data.address,
      town: data.town,
      lat: data.lat,
      lng: data.lng,
      type: data.type,
      carAllowed: data.carAllowed,
      totalMotoLots: data.totalMotoLots,
      covered: data.covered,
      pricingNotes: data.pricingNotes,
      openingHours: data.openingHours,
      entranceNotes: data.entranceNotes
    }

    if ('externalId' in data) updateData.externalId = data.externalId
    if ('source' in data) updateData.source = data.source
    if ('confidenceLevel' in data) updateData.confidenceLevel = data.confidenceLevel
    if ('motorcycleAllowed' in data) updateData.motorcycleAllowed = data.motorcycleAllowed
    if ('verified' in data) updateData.verified = data.verified
    if ('lastAvailabilitySyncAt' in data) updateData.lastAvailabilitySyncAt = data.lastAvailabilitySyncAt

    const carpark = await prisma.carpark.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(carpark)
  } catch (error) {
    console.error('Failed to update carpark:', error)
    return NextResponse.json({ error: 'Failed to update carpark' }, { status: 500 })
  }
}

// DELETE carpark
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    await prisma.carpark.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete carpark:', error)
    return NextResponse.json({ error: 'Failed to delete carpark' }, { status: 500 })
  }
}
