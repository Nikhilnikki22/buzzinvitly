import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { sendInvitationEmail } from '@/lib/email';
import { format } from 'date-fns';
import { getEmailCost } from '@/lib/features';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { eventId, guestIds } = await req.json();

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Get the event with host and guests
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        host: true,
        guests: guestIds
          ? { where: { id: { in: guestIds } } }
          : { where: { rsvpStatus: 'PENDING' } },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Verify the user is the host
    if (event.host.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Only the event host can send invitations' },
        { status: 403 }
      );
    }

    // Check if invitation token exists
    if (!event.invitationToken) {
      return NextResponse.json(
        { error: 'Event must have an invitation link before sending emails' },
        { status: 400 }
      );
    }

    const guestsToEmail = event.guests;
    const costPerEmail = getEmailCost(event.host.subscription);
    const emailCost = guestsToEmail.length * costPerEmail;

    // Check if user has enough coins (PRO users have unlimited)
    if (costPerEmail > 0 && event.host.coinBalance < emailCost) {
      return NextResponse.json(
        {
          error: `Insufficient coins. You need ${emailCost} coins but only have ${event.host.coinBalance}. Upgrade to PRO for unlimited emails!`,
          required: emailCost,
          available: event.host.coinBalance,
        },
        { status: 402 } // Payment Required
      );
    }

    // Generate RSVP URL
    const rsvpUrl = `${process.env.NEXTAUTH_URL}/rsvp/${event.invitationToken}`;

    // Format event date
    const formattedDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy \'at\' h:mm a');

    // Send emails to all guests
    const results = await Promise.allSettled(
      guestsToEmail.map(async (guest) => {
        try {
          await sendInvitationEmail({
            to: guest.email,
            guestName: guest.name,
            eventTitle: event.title,
            eventDate: formattedDate,
            eventLocation: event.location || undefined,
            rsvpUrl,
            hostName: event.host.name || 'Your Host',
          });

          // Update guest record with invitation sent time
          await prisma.guest.update({
            where: { id: guest.id },
            data: { invitedAt: new Date() },
          });

          return { email: guest.email, success: true };
        } catch (error) {
          console.error(`Failed to send to ${guest.email}:`, error);
          return { email: guest.email, success: false, error };
        }
      })
    );

    // Count successful sends
    const successful = results.filter(
      (r) => r.status === 'fulfilled' && r.value.success
    ).length;

    const failed = results.filter(
      (r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)
    ).length;

    // Deduct coins only for successful sends (PRO users don't pay)
    if (successful > 0 && costPerEmail > 0) {
      await prisma.user.update({
        where: { id: event.host.id },
        data: { coinBalance: { decrement: successful * costPerEmail } },
      });
    }

    // Update event status to SENT if it was DRAFT or SCHEDULED
    if (event.status === 'DRAFT' || event.status === 'SCHEDULED') {
      await prisma.event.update({
        where: { id: eventId },
        data: { status: 'SENT' },
      });
    }

    return NextResponse.json({
      success: true,
      sent: successful,
      failed,
      coinsUsed: successful * costPerEmail,
      remainingCoins: event.host.coinBalance - (successful * costPerEmail),
      isPro: event.host.subscription === 'PRO',
      results: results.map((r, i) => ({
        email: guestsToEmail[i].email,
        success: r.status === 'fulfilled' && r.value.success,
      })),
    });
  } catch (error) {
    console.error('Send invitations error:', error);
    return NextResponse.json(
      { error: 'Failed to send invitations' },
      { status: 500 }
    );
  }
}
