import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DesignEditorWrapper from './DesignEditorWrapper'

interface DesignPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DesignPage({ params }: DesignPageProps) {
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/auth/login')
  }

  const { id } = await params

  // Fetch the event
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      template: true,
      host: true,
    },
  })

  if (!event) {
    redirect('/dashboard')
  }

  // Verify user is the host
  if (event.host.email !== session.user.email) {
    redirect('/dashboard')
  }

  if (!event.template) {
    redirect('/dashboard')
  }

  return <DesignEditorWrapper eventId={event.id} template={event.template} />
}
