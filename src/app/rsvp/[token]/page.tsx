import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import RsvpForm from '@/components/rsvp-form'

interface RsvpPageProps {
  params: Promise<{
    token: string
  }>
}

export default async function RsvpPage({ params }: RsvpPageProps) {
  const { token } = await params

  // Fetch event by invitation token
  const event = await prisma.event.findUnique({
    where: { invitationToken: token },
    include: {
      template: true,
      host: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!event) {
    notFound()
  }

  const customizationData = event.customizationData as any

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎉 BuzzInvitly
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Invitation Preview */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="relative aspect-[3/4] max-h-[600px] bg-gray-100">
            {event.template && (
              <>
                <Image
                  src={event.template.thumbnailUrl}
                  alt="Invitation"
                  fill
                  className="object-cover opacity-60"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${customizationData?.primaryColor || '#3B82F6'}15 0%, ${customizationData?.secondaryColor || '#8B5CF6'}15 100%)`
                  }}
                >
                  <div
                    className="text-4xl md:text-5xl font-bold mb-6 px-6 py-3 rounded-xl"
                    style={{
                      color: customizationData?.primaryColor || '#3B82F6',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}
                  >
                    {event.title}
                  </div>

                  <div
                    className="text-xl md:text-2xl font-semibold mb-4 px-6 py-2 rounded-lg"
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

                  <div
                    className="text-lg md:text-xl mb-4 px-6 py-2 rounded-lg"
                    style={{
                      color: customizationData?.secondaryColor || '#8B5CF6',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    🕐 {new Date(event.date).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>

                  {event.location && (
                    <div className="text-base md:text-lg mb-6 px-5 py-2 rounded-lg bg-white/85 text-gray-800">
                      📍 {event.location}
                    </div>
                  )}

                  {customizationData?.customMessage && (
                    <div className="text-base md:text-lg italic max-w-md px-6 py-3 rounded-lg mt-4 bg-white/95 text-gray-900">
                      "{customizationData.customMessage}"
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Event Details */}
        {event.description && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">About This Event</h2>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
        )}

        {/* Host Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Hosted By</h2>
          <p className="text-gray-700">
            {event.host.name || event.host.email}
          </p>
        </div>

        {/* RSVP Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">RSVP</h2>
          <p className="text-gray-600 mb-6">
            Let us know if you can make it!
          </p>

          <RsvpForm eventId={event.id} eventToken={token} />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center text-gray-600 text-sm">
        <p>Powered by <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">BuzzInvitly</span></p>
      </footer>
    </div>
  )
}
