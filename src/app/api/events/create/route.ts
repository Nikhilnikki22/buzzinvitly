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
    const {
      templateId,
      title,
      description,
      date,
      location,
      status,
      customizationData,
    } = body

    // Validate required fields
    if (!title || !date) {
      return NextResponse.json(
        { error: 'Title and date are required' },
        { status: 400 }
      )
    }

    // Validate status
    if (!['DRAFT', 'ACTIVE', 'SCHEDULED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Determine event type based on template category (simplified)
    const eventType = 'CARD' // Default to CARD, can be extended later

    // Create event
    const event = await prisma.event.create({
      data: {
        hostId: session.user.id,
        templateId,
        title,
        description,
        type: eventType,
        date: new Date(date),
        location,
        status,
        customizationData,
      },
      include: {
        template: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      event: {
        id: event.id,
        title: event.title,
        status: event.status,
      },
    })
  } catch (error) {
    console.error('Event creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
