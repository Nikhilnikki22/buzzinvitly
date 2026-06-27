import { prisma } from './src/lib/prisma';
import { sendInvitationEmail } from './src/lib/email';

async function debugInvitation() {
  try {
    // Find a test event with guests
    const events = await prisma.event.findMany({
      include: {
        guests: true,
        host: true,
      },
      take: 1,
    });

    if (events.length === 0) {
      console.log('❌ No events found');
      return;
    }

    const event = events[0];
    console.log('✅ Found event:', event.title);
    console.log('📧 Guests:', event.guests.length);

    if (event.guests.length === 0) {
      console.log('❌ No guests found');
      return;
    }

    const guest = event.guests[0];
    console.log('\n🧪 Testing email send to:', guest.email);

    // Test 1: Send email
    try {
      const emailResult = await sendInvitationEmail({
        to: guest.email,
        guestName: guest.name,
        eventTitle: event.title,
        eventDate: event.date.toString(),
        eventLocation: event.location || undefined,
        rsvpUrl: `http://localhost:3001/rsvp/${event.invitationToken}`,
        hostName: event.host.name || 'Your Host',
      });
      console.log('✅ Email sent successfully:', emailResult);
    } catch (emailError) {
      console.error('❌ Email send failed:', emailError);
      return;
    }

    // Test 2: Update database
    try {
      const updateResult = await prisma.guest.update({
        where: { id: guest.id },
        data: { invitedAt: new Date() },
      });
      console.log('✅ Database updated successfully:', updateResult.invitedAt);
    } catch (dbError) {
      console.error('❌ Database update failed:', dbError);
      return;
    }

    console.log('\n✅ Both operations completed successfully!');
  } catch (error) {
    console.error('❌ Debug error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugInvitation();
