import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import EventCreationWrapper from '@/components/event-creation-wrapper'

interface CreateEventPageProps {
  searchParams: Promise<{
    templateId?: string
  }>
}

export default async function CreateEventPage({ searchParams }: CreateEventPageProps) {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const params = await searchParams
  const templateId = params.templateId

  if (!templateId) {
    // No template selected, redirect to template gallery
    redirect('/templates')
  }

  // Fetch template
  const template = await prisma.template.findUnique({
    where: { id: templateId },
  })

  if (!template) {
    redirect('/templates')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/templates" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Templates
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎉 BuzzInvitly
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Coins:</span>{' '}
                <span className="font-semibold text-blue-600">
                  {session.user.coinBalance}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Event
          </h1>
          <p className="text-gray-600">
            Customize your invitation using the <strong>{template.name}</strong> template
          </p>
        </div>

        <EventCreationWrapper
          template={template}
          userId={session.user.id}
        />
      </main>
    </div>
  )
}
