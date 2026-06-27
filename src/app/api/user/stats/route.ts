import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get statistics
    const [totalEvents, totalGuests, totalInvitationsSent, upcomingEvents] = await Promise.all([
      // Total events created
      prisma.event.count({
        where: { hostId: user.id },
      }),

      // Total guests across all events
      prisma.guest.count({
        where: {
          event: {
            hostId: user.id,
          },
        },
      }),

      // Total invitations sent (guests with invitedAt set)
      prisma.guest.count({
        where: {
          event: {
            hostId: user.id,
          },
          invitedAt: {
            not: null,
          },
        },
      }),

      // Upcoming events (events with date in the future)
      prisma.event.count({
        where: {
          hostId: user.id,
          date: {
            gte: new Date(),
          },
        },
      }),
    ]);

    return NextResponse.json({
      totalEvents,
      totalGuests,
      totalInvitationsSent,
      upcomingEvents,
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
