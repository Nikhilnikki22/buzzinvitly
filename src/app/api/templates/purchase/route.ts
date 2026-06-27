import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { templateId } = await request.json()

    if (!templateId) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Check if user is PRO (gets templates for free)
    if (user.subscription === 'PRO') {
      return NextResponse.json({
        success: true,
        message: 'Template unlocked (PRO member)',
        coinsDeducted: 0
      })
    }

    // Check if user has enough coins
    if (user.coinBalance < template.coinCost) {
      return NextResponse.json(
        {
          error: `Insufficient coins. You need ${template.coinCost} coins but only have ${user.coinBalance}.`,
          coinsNeeded: template.coinCost,
          currentBalance: user.coinBalance
        },
        { status: 402 }
      )
    }

    // Deduct coins
    await prisma.user.update({
      where: { id: user.id },
      data: {
        coinBalance: {
          decrement: template.coinCost,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Template purchased successfully',
      coinsDeducted: template.coinCost,
      remainingBalance: user.coinBalance - template.coinCost
    })
  } catch (error) {
    console.error('Failed to purchase template:', error)
    return NextResponse.json({ error: 'Failed to purchase template' }, { status: 500 })
  }
}
