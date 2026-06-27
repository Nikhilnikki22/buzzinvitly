import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const { type, message, email, url, userAgent, timestamp } = body

    // Validate input
    if (!message || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Store feedback in database (create Feedback table if needed)
    // For now, we'll just send an email to the team

    // Send email notification to team
    const feedbackEmail = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'feedback@buzzinvitly.com',
      to: 'beta@buzzinvitly.com',
      subject: `[${type.toUpperCase()}] New Feedback from ${session?.user?.email || email || 'Anonymous'}`,
      html: `
        <h2>New ${type} Feedback</h2>

        <h3>User Information</h3>
        <ul>
          <li><strong>User:</strong> ${session?.user?.email || 'Not logged in'}</li>
          <li><strong>Contact Email:</strong> ${email || 'Not provided'}</li>
          <li><strong>User ID:</strong> ${session?.user?.id || 'N/A'}</li>
        </ul>

        <h3>Feedback Details</h3>
        <ul>
          <li><strong>Type:</strong> ${type}</li>
          <li><strong>Timestamp:</strong> ${timestamp}</li>
          <li><strong>Page URL:</strong> ${url}</li>
          <li><strong>User Agent:</strong> ${userAgent}</li>
        </ul>

        <h3>Message</h3>
        <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message}
        </p>

        <hr style="margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">
          This feedback was submitted via the BuzzInvitly feedback widget.
        </p>
      `,
    })

    // If user is logged in, store in database for tracking
    if (session?.user?.id) {
      try {
        // Create a simple log entry (you can create a proper Feedback model later)
        console.log('Feedback from user:', session.user.id, type, message.substring(0, 50))
      } catch (error) {
        console.error('Failed to store feedback:', error)
        // Don't fail the request if database storage fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
    })
  } catch (error) {
    console.error('Feedback submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}
