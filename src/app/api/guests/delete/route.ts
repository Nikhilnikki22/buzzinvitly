import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { guestId } = body

    if (!guestId) {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      )
    }

    // Fetch guest with event info
    const guest = await prisma.guest.findUnique({
      where: { id: guestId },
      include: {
        event: {
          select: { hostId: true },
        },
      },
    })

    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
    }

    // Verify user is the event host
    if (guest.event.hostId !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the event host can delete guests' },
        { status: 403 }
      )
    }

    // Delete guest
    await prisma.guest.delete({
      where: { id: guestId },
    })

    return NextResponse.json({
      success: true,
      message: 'Guest deleted successfully',
    })
  } catch (error) {
    console.error('Delete guest error:', error)
    return NextResponse.json(
      { error: 'Failed to delete guest' },
      { status: 500 }
    )
  }
}
