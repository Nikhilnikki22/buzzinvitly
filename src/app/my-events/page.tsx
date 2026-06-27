import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import UserAccountDropdown from '@/components/user-account-dropdown'

export default async function MyEventsPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch user's events with guest statistics
  const events = await prisma.event.findMany({
    where: { hostId: session.user.id },
    include: {
      template: true,
      guests: true,
      _count: {
        select: { guests: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Calculate statistics
  const totalEvents = events.length
  const totalGuests = events.reduce((sum, event) => sum + event.guests.length, 0)
  const attendingCount = events.reduce(
    (sum, event) => sum + event.guests.filter(g => g.rsvpStatus === 'ATTENDING').length,
    0
  )
  const pendingCount = events.reduce(
    (sum, event) => sum + event.guests.filter(g => g.rsvpStatus === 'PENDING').length,
    0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard">
              <h1 className="text-2xl italic text-gray-900" style={{ fontFamily: 'cursive' }}>
                BuzzInvitly
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <UserAccountDropdown
                userName={session.user.name}
                userEmail={session.user.email!}
                coinBalance={session.user.coinBalance}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            My Events
          </h2>
          <p className="text-gray-600">
            Manage your events and track RSVPs all in one place
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{totalEvents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Guests</p>
                <p className="text-3xl font-bold text-gray-900">{totalGuests}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Attending</p>
                <p className="text-3xl font-bold text-green-600">{attendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Event Button */}
        <div className="mb-8">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Event
          </Link>
        </div>

        {/* Events List */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Events</h3>

          {events.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-600 mb-6">Create your first event to get started!</p>
              <Link
                href="/templates"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Browse Templates
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const attending = event.guests.filter(g => g.rsvpStatus === 'ATTENDING').length
                const notAttending = event.guests.filter(g => g.rsvpStatus === 'NOT_ATTENDING').length
                const maybe = event.guests.filter(g => g.rsvpStatus === 'MAYBE').length
                const pending = event.guests.filter(g => g.rsvpStatus === 'PENDING').length

                return (
                  <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Event Preview */}
                    {event.template && (
                      <div className="relative h-48 bg-gray-100">
                        <Image
                          src={event.template.thumbnailUrl}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            event.status === 'ACTIVE' ? 'bg-green-500 text-white' :
                            event.status === 'DRAFT' ? 'bg-gray-500 text-white' :
                            event.status === 'SCHEDULED' ? 'bg-blue-500 text-white' :
                            'bg-purple-500 text-white'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Event Details */}
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        📅 {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>

                      {/* Guest Statistics */}
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Total Guests:</span>
                          <span className="font-semibold text-gray-900">{event.guests.length}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="text-center">
                            <div className="font-semibold text-green-600">{attending}</div>
                            <div className="text-gray-500">Attending</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-yellow-600">{maybe}</div>
                            <div className="text-gray-500">Maybe</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-red-600">{notAttending}</div>
                            <div className="text-gray-500">Declined</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-600">{pending}</div>
                            <div className="text-gray-500">Pending</div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <Link
                        href={`/events/${event.id}`}
                        className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Manage Event
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
