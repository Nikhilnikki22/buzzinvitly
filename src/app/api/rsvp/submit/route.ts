import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      eventId,
      eventToken,
      name,
      email,
      phone,
      rsvpStatus,
      plusOneName,
    } = body

    // Validate required fields
    if (!eventId || !eventToken || !name || !email || !rsvpStatus) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify event exists and token is valid
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { invitationToken: true },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.invitationToken !== eventToken) {
      return NextResponse.json({ error: 'Invalid invitation link' }, { status: 403 })
    }

    // Check if guest already exists
    const existingGuest = await prisma.guest.findUnique({
      where: {
        eventId_email: {
          eventId,
          email: email.toLowerCase(),
        },
      },
    })

    if (existingGuest) {
      // Update existing guest
      const updatedGuest = await prisma.guest.update({
        where: { id: existingGuest.id },
        data: {
          name,
          phone: phone || null,
          rsvpStatus,
          plusOneName: plusOneName || null,
          respondedAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: 'RSVP updated successfully',
        guest: updatedGuest,
      })
    }

    // Create new guest
    const guest = await prisma.guest.create({
      data: {
        eventId,
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        rsvpStatus,
        plusOneName: plusOneName || null,
        plusOne: !!plusOneName,
        invitedAt: new Date(),
        respondedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'RSVP submitted successfully',
      guest,
    })
  } catch (error) {
    console.error('RSVP submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    )
  }
}
