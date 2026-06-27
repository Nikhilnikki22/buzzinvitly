'use client'

import Image from 'next/image'

interface Template {
  id: string
  name: string
  thumbnailUrl: string
}

interface EventPreviewProps {
  template: Template
  eventTitle: string
  eventDate: string
  eventLocation: string
  primaryColor: string
  secondaryColor: string
  customMessage: string
}

export default function EventPreview({
  template,
  eventTitle,
  eventDate,
  eventLocation,
  primaryColor,
  secondaryColor,
  customMessage,
}: EventPreviewProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
        <h3 className="text-white font-bold text-center">Live Preview</h3>
      </div>

      <div className="p-4">
        {/* Template Base */}
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-4">
          <Image
            src={template.thumbnailUrl}
            alt="Template preview"
            fill
            className="object-cover opacity-60"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Overlay with customizations */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}15 100%)`
            }}
          >
            {/* Event Title */}
            {eventTitle && (
              <div
                className="text-2xl md:text-3xl font-bold mb-4 px-4 py-2 rounded-lg"
                style={{
                  color: primaryColor,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                {eventTitle}
              </div>
            )}

            {/* Event Date */}
            {eventDate && (
              <div
                className="text-lg font-semibold mb-2 px-4 py-1 rounded"
                style={{
                  color: secondaryColor,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                📅 {new Date(eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}

            {/* Event Location */}
            {eventLocation && (
              <div
                className="text-sm mb-4 px-3 py-1 rounded"
                style={{
                  color: '#374151',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)'
                }}
              >
                📍 {eventLocation}
              </div>
            )}

            {/* Custom Message */}
            {customMessage && (
              <div
                className="text-sm italic max-w-xs px-4 py-2 rounded mt-2"
                style={{
                  color: '#1F2937',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}
              >
                "{customMessage}"
              </div>
            )}
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="text-center">
            <div
              className="w-8 h-8 rounded-full mx-auto mb-1 border-2 border-gray-200"
              style={{ backgroundColor: primaryColor }}
            />
            <p className="text-xs text-gray-500">Primary</p>
          </div>
          <div className="text-center">
            <div
              className="w-8 h-8 rounded-full mx-auto mb-1 border-2 border-gray-200"
              style={{ backgroundColor: secondaryColor }}
            />
            <p className="text-xs text-gray-500">Secondary</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Using: {template.name}
        </p>
      </div>
    </div>
  )
}
