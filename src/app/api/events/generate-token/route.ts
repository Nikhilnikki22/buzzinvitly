import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { eventId } = body

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Verify event exists and user is the host
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { hostId: true, invitationToken: true },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.hostId !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the event host can generate invitation links' },
        { status: 403 }
      )
    }

    // If token already exists, return it
    if (event.invitationToken) {
      return NextResponse.json({
        success: true,
        token: event.invitationToken,
      })
    }

    // Generate a unique token
    const token = randomBytes(16).toString('hex')

    // Update event with token
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { invitationToken: token },
    })

    return NextResponse.json({
      success: true,
      token: updatedEvent.invitationToken,
    })
  } catch (error) {
    console.error('Generate token error:', error)
    return NextResponse.json(
      { error: 'Failed to generate invitation link' },
      { status: 500 }
    )
  }
}
