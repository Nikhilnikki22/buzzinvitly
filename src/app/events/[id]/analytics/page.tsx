import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import EventAnalytics from '@/components/analytics/EventAnalytics'
import ExportGuestList from '@/components/analytics/ExportGuestList'

interface AnalyticsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/auth/login')
  }

  const { id } = await params

  // Fetch event with guests
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      guests: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!event) {
    notFound()
  }

  // Check if user is the host
  const isHost = event.hostId === session.user.id

  if (!isHost) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href={`/events/${event.id}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Event
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📊 Event Analytics
            </h1>
            <div className="w-32" /> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
          <p className="text-gray-600">
            {new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Empty State */}
        {event.guests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Analytics Yet</h2>
            <p className="text-gray-600 mb-6">
              Add guests to your event to see analytics and statistics
            </p>
            <Link
              href={`/events/${event.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Guests
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Analytics Charts */}
            <EventAnalytics guests={event.guests} eventDate={event.date} />

            {/* Export Section */}
            <ExportGuestList guests={event.guests} eventTitle={event.title} />
          </div>
        )}
      </main>
    </div>
  )
}
