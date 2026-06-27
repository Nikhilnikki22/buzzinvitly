'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function saveDesign(eventId: string, canvasData: any) {
  const session = await auth()

  if (!session?.user?.email) {
    throw new Error('Unauthorized')
  }

  // Verify user owns the event
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { host: true },
  })

  if (!event || event.host.email !== session.user.email) {
    throw new Error('Unauthorized')
  }

  // Update event with new design data
  await prisma.event.update({
    where: { id: eventId },
    data: {
      customizationData: canvasData,
    },
  })

  return { success: true }
}
