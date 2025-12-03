import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Approve or update a suggestion
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const data = await request.json()

    const carpark = await prisma.carpark.update({
      where: { id },
      data: {
        verified: data.verified ?? true,
        name: data.name,
        address: data.address,
        town: data.town,
        lat: data.lat,
        lng: data.lng,
        type: data.type,
        motorcycleAllowed: data.motorcycleAllowed,
        carAllowed: data.carAllowed,
        totalMotoLots: data.totalMotoLots,
        covered: data.covered,
        pricingNotes: data.pricingNotes,
        entranceNotes: data.entranceNotes
      }
    })

    return NextResponse.json(carpark)
  } catch (error) {
    console.error('Failed to update suggestion:', error)
    return NextResponse.json(
      { error: 'Failed to update suggestion' },
      { status: 500 }
    )
  }
}

// DELETE - Reject/delete a suggestion
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    // Delete associated photos first
    await prisma.photo.deleteMany({
      where: { carparkId: id }
    })

    // Delete the carpark
    await prisma.carpark.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete suggestion:', error)
    return NextResponse.json(
      { error: 'Failed to delete suggestion' },
      { status: 500 }
    )
  }
}
