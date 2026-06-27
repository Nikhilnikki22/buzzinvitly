import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, amount } = await request.json()

    const user = await prisma.user.update({
      where: { email: email || 'test2@buzzinvitly.com' },
      data: {
        coinBalance: amount || 100
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        coinBalance: user.coinBalance
      }
    })
  } catch (error) {
    console.error('Error adding coins:', error)
    return NextResponse.json({ error: 'Failed to add coins' }, { status: 500 })
  }
}
