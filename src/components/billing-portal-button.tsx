'use client'

import { useState } from 'react'

export default function BillingPortalButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOpenPortal = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/subscription/portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open billing portal')
      }

      // Redirect to Stripe billing portal
      window.location.href = data.url
    } catch (err: any) {
      setError(err.message || 'Failed to open billing portal')
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleOpenPortal}
        disabled={isLoading}
        className="py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Opening...' : 'Open Billing Portal'}
      </button>
    </div>
  )
}
