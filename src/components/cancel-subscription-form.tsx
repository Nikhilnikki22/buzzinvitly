'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CancelSubscriptionForm() {
  const router = useRouter()
  const [reason, setReason] = useState('')
  const [isCanceling, setIsCanceling] = useState(false)
  const [error, setError] = useState('')

  const handleCancel = async () => {
    if (!reason) {
      setError('Please select a reason for canceling')
      return
    }

    setError('')
    setIsCanceling(true)

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription')
      }

      // Redirect to confirmation page
      router.push('/subscription/canceled')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription')
      setIsCanceling(false)
    }
  }

  const reasons = [
    'Too expensive',
    'Not using it enough',
    'Missing features I need',
    'Found a better alternative',
    'Technical issues',
    'Other',
  ]

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Reason Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Why are you canceling? (Optional but helps us improve)
        </label>
        <div className="space-y-2">
          {reasons.map((r) => (
            <label key={r} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={(e) => setReason(e.target.value)}
                className="w-4 h-4 text-red-600 focus:ring-red-500"
              />
              <span className="text-gray-700">{r}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Link
          href="/subscription/manage"
          className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold text-center hover:bg-gray-300 transition-colors"
        >
          Keep PRO
        </Link>
        <button
          onClick={handleCancel}
          disabled={isCanceling}
          className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCanceling ? 'Canceling...' : 'Confirm Cancellation'}
        </button>
      </div>
    </div>
  )
}
