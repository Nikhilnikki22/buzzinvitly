import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendReceiptEmailParams {
  to: string;
  userName: string;
  coins: number;
  amount: number;
  transactionId: string;
  newBalance: number;
}

export async function sendReceiptEmail({
  to,
  userName,
  coins,
  amount,
  transactionId,
  newBalance,
}: SendReceiptEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'BuzzInvitly <onboarding@resend.dev>',
      to: [to],
      subject: 'Receipt for Your Coin Purchase - BuzzInvitly',
      html: generateReceiptHTML({
        userName,
        coins,
        amount,
        transactionId,
        newBalance,
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send receipt email:', error);
    throw error;
  }
}

function generateReceiptHTML({
  userName,
  coins,
  amount,
  transactionId,
  newBalance,
}: Omit<SendReceiptEmailParams, 'to'>) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purchase Receipt</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                💰 Purchase Confirmed!
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hi ${userName},
              </p>

              <p style="margin: 0 0 30px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Thank you for your purchase! Your coins have been added to your BuzzInvitly account.
              </p>

              <!-- Receipt Details -->
              <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 20px; font-weight: bold;">
                  Receipt Details
                </h2>

                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 15px;">
                      <strong style="color: #374151;">Date:</strong>
                    </td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 15px; text-align: right;">
                      ${currentDate}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 15px;">
                      <strong style="color: #374151;">Transaction ID:</strong>
                    </td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 15px; text-align: right;">
                      ${transactionId}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 15px;">
                      <strong style="color: #374151;">Coins Purchased:</strong>
                    </td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 15px; text-align: right;">
                      <strong>${coins} coins</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 15px;">
                      <strong style="color: #374151;">Amount Paid:</strong>
                    </td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 15px; text-align: right;">
                      <strong>$${amount.toFixed(2)} USD</strong>
                    </td>
                  </tr>
                  <tr style="border-top: 2px solid #d1d5db;">
                    <td style="padding: 15px 0 0 0; color: #6b7280; font-size: 15px;">
                      <strong style="color: #374151;">New Balance:</strong>
                    </td>
                    <td style="padding: 15px 0 0 0; color: #2563eb; font-size: 18px; text-align: right;">
                      <strong>${newBalance} coins</strong>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- What's Next -->
              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
                <h3 style="margin: 0 0 10px; color: #1f2937; font-size: 16px; font-weight: bold;">
                  📧 What's Next?
                </h3>
                <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
                  You can now use your ${newBalance} coins to send email invitations to your event guests. Each email costs 1 coin.
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${process.env.NEXTAUTH_URL}/events/create"
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                  Create an Event
                </a>
              </div>

              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                Need help? Reply to this email and we'll be happy to assist you!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 12px;">
                Thank you for using BuzzInvitly!
              </p>
              <p style="margin: 0; color: #d1d5db; font-size: 11px;">
                This is an automated receipt. Please do not reply to this email.
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
