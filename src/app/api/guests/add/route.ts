import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { eventId, name, email, phone, plusOne } = body

    // Validate required fields
    if (!eventId || !name || !email) {
      return NextResponse.json(
        { error: 'Event ID, name, and email are required' },
        { status: 400 }
      )
    }

    // Verify event exists and user is the host
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { hostId: true },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.hostId !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the event host can add guests' },
        { status: 403 }
      )
    }

    // Check if guest already exists for this event
    const existingGuest = await prisma.guest.findUnique({
      where: {
        eventId_email: {
          eventId,
          email: email.toLowerCase(),
        },
      },
    })

    if (existingGuest) {
      return NextResponse.json(
        { error: 'Guest with this email already added to this event' },
        { status: 400 }
      )
    }

    // Create guest
    const guest = await prisma.guest.create({
      data: {
        eventId,
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        plusOne: plusOne || false,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Guest added successfully',
      guest,
    })
  } catch (error) {
    console.error('Add guest error:', error)
    return NextResponse.json(
      { error: 'Failed to add guest' },
      { status: 500 }
    )
  }
}
