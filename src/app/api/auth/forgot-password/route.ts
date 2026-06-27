import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateEmail } from '@/lib/auth-utils'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json({
        message: 'If that email exists, a password reset link has been sent',
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Token expires in 1 hour
    const expires = new Date(Date.now() + 3600000)

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    })

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token: hashedToken,
        expires,
      },
    })

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

    // TODO: Send email with reset link
    // For now, we'll just log it in development
    if (process.env.NODE_ENV === 'development') {
      console.log('\n=================================')
      console.log('PASSWORD RESET LINK (DEV MODE):')
      console.log(resetUrl)
      console.log('=================================\n')
    }

    // In production, you would send an email here using Resend or similar service
    // Example:
    // await sendPasswordResetEmail(email, resetUrl)

    return NextResponse.json({
      message: 'If that email exists, a password reset link has been sent',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
