# Beta Tester Invitation Email Template

## Subject Line Options

1. "You're Invited to the BuzzInvitly Beta! 🎉"
2. "Help Shape BuzzInvitly: Beta Testing Invitation"
3. "Exclusive Early Access: BuzzInvitly Beta Program"

---

## Email Template (HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BuzzInvitly Beta Invitation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">BuzzInvitly</h1>
              <p style="margin: 10px 0 0 0; color: #E0E7FF; font-size: 16px;">Beta Testing Program</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">

              <h2 style="margin: 0 0 20px 0; color: #1F2937; font-size: 24px; font-weight: bold;">
                You're Invited! 🎉
              </h2>

              <p style="margin: 0 0 16px 0; color: #4B5563; font-size: 16px; line-height: 24px;">
                Hi {{firstName}},
              </p>

              <p style="margin: 0 0 16px 0; color: #4B5563; font-size: 16px; line-height: 24px;">
                We're excited to invite you to be one of the first to experience <strong>BuzzInvitly</strong> – a modern platform for creating beautiful event invitations, managing guests, and tracking RSVPs.
              </p>

              <p style="margin: 0 0 16px 0; color: #4B5563; font-size: 16px; line-height: 24px;">
                As a beta tester, you'll get:
              </p>

              <ul style="margin: 0 0 24px 0; padding-left: 20px; color: #4B5563; font-size: 16px; line-height: 28px;">
                <li><strong>FREE PRO plan</strong> access during beta</li>
                <li><strong>1000 bonus coins</strong> ($100 value) to test invitations</li>
                <li><strong>Early access</strong> to all features</li>
                <li><strong>Direct line</strong> to our development team</li>
                <li><strong>50% off PRO plan</strong> for 6 months after launch</li>
                <li><strong>Exclusive swag</strong> and beta tester badge</li>
              </ul>

              <!-- CTA Button -->
              <table role="presentation" style="margin: 30px 0; width: 100%;">
                <tr>
                  <td align="center">
                    <a href="{{betaURL}}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                      Start Beta Testing →
                    </a>
                  </td>
                </tr>
              </table>

              <h3 style="margin: 30px 0 16px 0; color: #1F2937; font-size: 20px; font-weight: bold;">
                What We Need From You
              </h3>

              <p style="margin: 0 0 12px 0; color: #4B5563; font-size: 16px; line-height: 24px;">
                <strong>Time Commitment:</strong> 2-3 hours over 2 weeks
              </p>

              <p style="margin: 0 0 12px 0; color: #4B5563; font-size: 16px; line-height: 24px;">
                <strong>Your Tasks:</strong>
              </p>

              <ul style="margin: 0 0 16px 0; padding-left: 20px; color: #4B5563; font-size: 16px; line-height: 26px;">
                <li>Create and send test event invitations</li>
                <li>Report any bugs or issues you encounter</li>
                <li>Share feedback on features and user experience</li>
                <li>Complete 2 short surveys (5 minutes each)</li>
              </ul>

              <h3 style="margin: 30px 0 16px 0; color: #1F2937; font-size: 20px; font-weight: bold;">
                Your Beta Credentials
              </h3>

              <table style="width: 100%; background-color: #F3F4F6; border-radius: 6px; padding: 20px; border: 1px solid #E5E7EB; margin: 0 0 24px 0;">
                <tr>
                  <td style="padding: 0;">
                    <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 14px;">
                      <strong>Beta URL:</strong>
                    </p>
                    <p style="margin: 0 0 16px 0; color: #3B82F6; font-size: 16px; font-family: monospace;">
                      {{betaURL}}
                    </p>

                    <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 14px;">
                      <strong>Email:</strong>
                    </p>
                    <p style="margin: 0 0 16px 0; color: #1F2937; font-size: 16px; font-family: monospace;">
                      {{email}}
                    </p>

                    <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 14px;">
                      <strong>Temporary Password:</strong>
                    </p>
                    <p style="margin: 0 0 8px 0; color: #1F2937; font-size: 16px; font-family: monospace;">
                      {{temporaryPassword}}
                    </p>
                    <p style="margin: 0; color: #9CA3AF; font-size: 12px; font-style: italic;">
                      Please change this password after your first login
                    </p>
                  </td>
                </tr>
              </table>

              <h3 style="margin: 30px 0 16px 0; color: #1F2937; font-size: 20px; font-weight: bold;">
                Beta Testing Timeline
              </h3>

              <table style="width: 100%; margin: 0 0 24px 0;">
                <tr>
                  <td style="padding: 12px; background-color: #EEF2FF; border-left: 4px solid #3B82F6; margin-bottom: 8px;">
                    <p style="margin: 0; color: #1F2937; font-size: 14px;"><strong>Week 1 (Jan 20-27):</strong> Core feature testing</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px; background-color: #F0FDF4; border-left: 4px solid #10B981; margin-bottom: 8px;">
                    <p style="margin: 0; color: #1F2937; font-size: 14px;"><strong>Week 2 (Jan 28 - Feb 3):</strong> Polish and feedback</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px; background-color: #FEF3C7; border-left: 4px solid #F59E0B;">
                    <p style="margin: 0; color: #1F2937; font-size: 14px;"><strong>Feb 5:</strong> Public launch! 🚀</p>
                  </td>
                </tr>
              </table>

              <h3 style="margin: 30px 0 16px 0; color: #1F2937; font-size: 20px; font-weight: bold;">
                Getting Help
              </h3>

              <p style="margin: 0 0 12px 0; color: #4B5563; font-size: 16px; line-height: 24px;">
                Have questions? We're here to help!
              </p>

              <ul style="margin: 0 0 24px 0; padding-left: 20px; color: #4B5563; font-size: 16px; line-height: 26px;">
                <li><strong>Email:</strong> beta@buzzinvitly.com (2-4 hour response)</li>
                <li><strong>Beta Guide:</strong> <a href="{{betaGuideURL}}" style="color: #3B82F6; text-decoration: none;">Read the full guide →</a></li>
                <li><strong>Feedback Widget:</strong> Click the blue button in-app</li>
              </ul>

              <p style="margin: 24px 0 0 0; color: #4B5563; font-size: 16px; line-height: 24px;">
                Thanks for being part of our journey! We can't wait to hear your thoughts.
              </p>

              <p style="margin: 16px 0 0 0; color: #4B5563; font-size: 16px; line-height: 24px;">
                Happy testing! 🎉
              </p>

              <p style="margin: 24px 0 0 0; color: #4B5563; font-size: 16px; line-height: 24px;">
                <strong>The BuzzInvitly Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #F9FAFB; border-radius: 0 0 8px 8px; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 8px 0; color: #9CA3AF; font-size: 12px; text-align: center;">
                This is an exclusive invitation for beta testing. Please keep your credentials secure.
              </p>
              <p style="margin: 0; color: #9CA3AF; font-size: 12px; text-align: center;">
                Questions? Email us at <a href="mailto:beta@buzzinvitly.com" style="color: #3B82F6; text-decoration: none;">beta@buzzinvitly.com</a>
              </p>
              <p style="margin: 16px 0 0 0; color: #9CA3AF; font-size: 12px; text-align: center;">
                © 2024 BuzzInvitly. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Plain Text Version

```
Subject: You're Invited to the BuzzInvitly Beta! 🎉

Hi {{firstName}},

You're Invited!

We're excited to invite you to be one of the first to experience BuzzInvitly – a modern platform for creating beautiful event invitations, managing guests, and tracking RSVPs.

As a beta tester, you'll get:

- FREE PRO plan access during beta
- 1000 bonus coins ($100 value) to test invitations
- Early access to all features
- Direct line to our development team
- 50% off PRO plan for 6 months after launch
- Exclusive swag and beta tester badge

START BETA TESTING: {{betaURL}}

---

What We Need From You

Time Commitment: 2-3 hours over 2 weeks

Your Tasks:
- Create and send test event invitations
- Report any bugs or issues you encounter
- Share feedback on features and user experience
- Complete 2 short surveys (5 minutes each)

---

Your Beta Credentials

Beta URL: {{betaURL}}
Email: {{email}}
Temporary Password: {{temporaryPassword}}

(Please change this password after your first login)

---

Beta Testing Timeline

Week 1 (Jan 20-27): Core feature testing
Week 2 (Jan 28 - Feb 3): Polish and feedback
Feb 5: Public launch! 🚀

---

Getting Help

Have questions? We're here to help!

- Email: beta@buzzinvitly.com (2-4 hour response)
- Beta Guide: {{betaGuideURL}}
- Feedback Widget: Click the blue button in-app

---

Thanks for being part of our journey! We can't wait to hear your thoughts.

Happy testing! 🎉

The BuzzInvitly Team

---

This is an exclusive invitation for beta testing. Please keep your credentials secure.
Questions? Email us at beta@buzzinvitly.com

© 2024 BuzzInvitly. All rights reserved.
```

---

## Variable Placeholders

Replace these variables when sending:

- `{{firstName}}` - Beta tester's first name
- `{{email}}` - Beta tester's email address
- `{{betaURL}}` - Beta environment URL (e.g., https://beta.buzzinvitly.com)
- `{{temporaryPassword}}` - Generated temporary password
- `{{betaGuideURL}}` - Link to beta testing guide (e.g., https://beta.buzzinvitly.com/beta-guide)

---

## Sending Script Example

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

async function inviteBetaTester(tester: {
  email: string
  firstName: string
  temporaryPassword: string
}) {
  await resend.emails.send({
    from: 'BuzzInvitly Beta <beta@buzzinvitly.com>',
    to: tester.email,
    subject: "You're Invited to the BuzzInvitly Beta! 🎉",
    html: betaInvitationTemplate
      .replace(/{{firstName}}/g, tester.firstName)
      .replace(/{{email}}/g, tester.email)
      .replace(/{{betaURL}}/g, 'https://beta.buzzinvitly.com')
      .replace(/{{temporaryPassword}}/g, tester.temporaryPassword)
      .replace(/{{betaGuideURL}}/g, 'https://beta.buzzinvitly.com/docs/beta-guide'),
  })
}
```

---

## Follow-up Emails

### Week 1 Check-in (Day 4)

**Subject:** "How's beta testing going?"

Brief check-in asking about:
- Any issues encountered
- Features tested so far
- Questions or blockers
- Reminder about Week 1 survey

### Week 2 Reminder (Day 8)

**Subject:** "Final week of beta testing!"

Reminder about:
- Week 2 focus areas
- Final survey deadline
- Launch date approaching
- Thanks for participation

### Thank You Email (After Beta)

**Subject:** "Thank you for beta testing! Here's your reward 🎁"

Include:
- Thanks for participation
- Beta tester benefits activation
- Discount code for PRO plan
- Swag redemption instructions
- Credits in launch announcement
