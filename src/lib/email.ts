import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendInvitationEmailParams {
  to: string;
  guestName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation?: string;
  rsvpUrl: string;
  hostName?: string;
}

export async function sendInvitationEmail({
  to,
  guestName,
  eventTitle,
  eventDate,
  eventLocation,
  rsvpUrl,
  hostName = 'Your Host',
}: SendInvitationEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'BuzzInvitly <onboarding@resend.dev>',
      to: [to],
      subject: `You're Invited: ${eventTitle}`,
      html: generateInvitationHTML({
        guestName,
        eventTitle,
        eventDate,
        eventLocation,
        rsvpUrl,
        hostName,
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send invitation email:', error);
    throw error;
  }
}

function generateInvitationHTML({
  guestName,
  eventTitle,
  eventDate,
  eventLocation,
  rsvpUrl,
  hostName,
}: Omit<SendInvitationEmailParams, 'to'>) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're Invited!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                🎉 You're Invited!
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 18px; line-height: 1.6;">
                Hi ${guestName},
              </p>

              <p style="margin: 0 0 30px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                ${hostName} has invited you to:
              </p>

              <!-- Event Details Box -->
              <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: bold; text-align: center;">
                  ${eventTitle}
                </h2>

                <table style="width: 100%; margin-bottom: 10px;">
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 15px;">
                      <strong style="color: #374151;">📅 Date:</strong>
                    </td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 15px; text-align: right;">
                      ${eventDate}
                    </td>
                  </tr>
                  ${eventLocation ? `
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 15px;">
                      <strong style="color: #374151;">📍 Location:</strong>
                    </td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 15px; text-align: right;">
                      ${eventLocation}
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- RSVP Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${rsvpUrl}"
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                  RSVP Now
                </a>
              </div>

              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                We hope you can make it! Please let us know if you'll be attending.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 12px;">
                Sent via BuzzInvitly
              </p>
              <p style="margin: 0; color: #d1d5db; font-size: 11px;">
                <a href="${rsvpUrl}" style="color: #667eea; text-decoration: none;">View Invitation</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendTestEmail(to: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'BuzzInvitly <onboarding@resend.dev>',
      to: [to],
      subject: 'Test Email from BuzzInvitly',
      html: '<h1>Test Email</h1><p>This is a test email from BuzzInvitly using Resend.</p>',
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send test email:', error);
    throw error;
  }
}
