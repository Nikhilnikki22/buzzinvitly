'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RsvpFormProps {
  eventId: string
  eventToken: string
}

export default function RsvpForm({ eventId, eventToken }: RsvpFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rsvpStatus: 'ATTENDING' as 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE',
    plusOneName: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.name || !formData.email) {
        throw new Error('Name and email are required')
      }

      const response = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          eventToken,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit RSVP')
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
          <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {formData.rsvpStatus === 'ATTENDING' ? '🎉 Thank You!' :
           formData.rsvpStatus === 'MAYBE' ? '👍 Thanks for Letting Us Know!' :
           '😢 We\'ll Miss You!'}
        </h3>
        <p className="text-gray-600 mb-6">
          {formData.rsvpStatus === 'ATTENDING' ?
            'Your RSVP has been confirmed. We look forward to seeing you!' :
           formData.rsvpStatus === 'MAYBE' ?
            'We\'ve received your response. Hope you can make it!' :
            'Thank you for letting us know. We hope to see you at a future event!'}
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Update My Response
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Phone (Optional)
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+1 234 567 8900"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* RSVP Status */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Will you be attending? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, rsvpStatus: 'ATTENDING' })}
            className={`px-6 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              formData.rsvpStatus === 'ATTENDING'
                ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-400 ring-offset-2'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-400'
            }`}
          >
            ✅ Yes, I'll be there
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, rsvpStatus: 'MAYBE' })}
            className={`px-6 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              formData.rsvpStatus === 'MAYBE'
                ? 'bg-yellow-600 text-white shadow-lg ring-2 ring-yellow-400 ring-offset-2'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-yellow-400'
            }`}
          >
            ❓ Maybe
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, rsvpStatus: 'NOT_ATTENDING' })}
            className={`px-6 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              formData.rsvpStatus === 'NOT_ATTENDING'
                ? 'bg-red-600 text-white shadow-lg ring-2 ring-red-400 ring-offset-2'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-400'
            }`}
          >
            ❌ Can't make it
          </button>
        </div>
      </div>

      {/* Plus One Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Plus One Name (if applicable)
        </label>
        <input
          type="text"
          value={formData.plusOneName}
          onChange={(e) => setFormData({ ...formData, plusOneName: e.target.value })}
          placeholder="Guest name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          If you're bringing a plus one, please enter their name
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Submitting...
          </span>
        ) : (
          'Submit RSVP'
        )}
      </button>
    </form>
  )
}
