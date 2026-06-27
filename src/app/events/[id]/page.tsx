import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import GuestManagement from '@/components/guest-management'
import InvitationLink from '@/components/invitation-link'
import SendInvitations from '@/components/send-invitations'

interface EventDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const { id } = await params

  // Fetch event details
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      template: true,
      host: {
        select: {
          id: true,
          name: true,
          email: true,
          coinBalance: true,
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

  const customizationData = event.customizationData as any

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎉 BuzzInvitly
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Coins:</span>{' '}
                <span className="font-semibold text-blue-600">
                  {isHost ? event.host.coinBalance : session.user.coinBalance || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Status Badge */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {event.title}
              </h1>
              <p className="text-gray-600">
                Created by {isHost ? 'you' : event.host.name || event.host.email}
              </p>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                event.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                event.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                event.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {event.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Event Preview */}
          <div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
                <h3 className="text-white font-bold text-center">Your Invitation</h3>
              </div>

              <div className="p-4">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                  {event.template && (
                    <>
                      <Image
                        src={event.template.thumbnailUrl}
                        alt="Template"
                        fill
                        className="object-cover opacity-60"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                        style={{
                          background: `linear-gradient(135deg, ${customizationData?.primaryColor || '#3B82F6'}15 0%, ${customizationData?.secondaryColor || '#8B5CF6'}15 100%)`
                        }}
                      >
                        <div
                          className="text-3xl font-bold mb-4 px-4 py-2 rounded-lg"
                          style={{
                            color: customizationData?.primaryColor || '#3B82F6',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                          }}
                        >
                          {event.title}
                        </div>

                        <div
                          className="text-lg font-semibold mb-2 px-4 py-1 rounded"
                          style={{
                            color: customizationData?.secondaryColor || '#8B5CF6',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)'
                          }}
                        >
                          📅 {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>

                        {event.location && (
                          <div className="text-sm mb-4 px-3 py-1 rounded bg-white/85 text-gray-800">
                            📍 {event.location}
                          </div>
                        )}

                        {customizationData?.customMessage && (
                          <div className="text-sm italic max-w-xs px-4 py-2 rounded mt-2 bg-white/95 text-gray-900">
                            "{customizationData.customMessage}"
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div>
            {/* Advanced Design Editor Button */}
            {isHost && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-md p-6 mb-6 border-2 border-purple-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 4 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">🎨 Advanced Design Editor</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Use our powerful visual editor to customize text, images, fonts, and colors with precision
                    </p>
                    <Link
                      href={`/events/${event.id}/design`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Open Design Editor
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Dashboard Button */}
            {isHost && event.guests.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 mb-6 border-2 border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">📊 Event Analytics</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      View RSVP statistics, response timeline, and export guest lists
                    </p>
                    <Link
                      href={`/events/${event.id}/analytics`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                      View Analytics
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Event Information</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(event.date).toLocaleString('en-US', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>

                {event.location && (
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-lg font-semibold text-gray-900">{event.location}</p>
                  </div>
                )}

                {event.description && (
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-gray-900">{event.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Event Type</p>
                  <p className="text-lg font-semibold text-gray-900">{event.type}</p>
                </div>

                {event.template && (
                  <div>
                    <p className="text-sm text-gray-600">Template Used</p>
                    <p className="text-lg font-semibold text-gray-900">{event.template.name}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Invitation Link Section */}
        {isHost && (
          <div className="mt-12">
            <InvitationLink
              eventId={event.id}
              initialToken={event.invitationToken}
            />
          </div>
        )}

        {/* Send Email Invitations Section */}
        {isHost && event.invitationToken && (
          <div className="mt-8">
            <SendInvitations
              eventId={event.id}
              guests={event.guests}
              userCoinBalance={event.host.coinBalance}
            />
          </div>
        )}

        {/* Guest Management Section */}
        {isHost && (
          <div className="mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Guest Management
              </h2>
              <p className="text-gray-600">
                Add guests, import from CSV, and track RSVPs
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <GuestManagement
                eventId={event.id}
                initialGuests={event.guests}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
