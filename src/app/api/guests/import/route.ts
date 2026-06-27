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
    const { eventId, guests } = body

    if (!eventId || !guests || !Array.isArray(guests)) {
      return NextResponse.json(
        { error: 'Event ID and guests array are required' },
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
        { error: 'Only the event host can import guests' },
        { status: 403 }
      )
    }

    // Get existing guest emails for this event
    const existingGuests = await prisma.guest.findMany({
      where: { eventId },
      select: { email: true },
    })

    const existingEmails = new Set(existingGuests.map(g => g.email.toLowerCase()))

    // Filter out duplicates and prepare guest data
    const guestsToAdd = guests
      .filter((g: any) => {
        const email = g.email.toLowerCase()
        if (existingEmails.has(email)) {
          return false
        }
        existingEmails.add(email) // Prevent duplicates within the import
        return true
      })
      .map((g: any) => ({
        eventId,
        name: g.name,
        email: g.email.toLowerCase(),
        phone: g.phone || null,
        plusOne: g.plusOne || false,
      }))

    // Bulk create guests
    const result = await prisma.guest.createMany({
      data: guestsToAdd,
      skipDuplicates: true,
    })

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${result.count} guests`,
      added: result.count,
      skipped: guests.length - result.count,
    })
  } catch (error) {
    console.error('Import guests error:', error)
    return NextResponse.json(
      { error: 'Failed to import guests' },
      { status: 500 }
    )
  }
}
