'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface UseTemplateButtonProps {
  templateId: string
  templateName: string
  coinCost: number
  isPremium: boolean
  canAfford: boolean
  userCoins: number
}

export default function UseTemplateButton({
  templateId,
  templateName,
  coinCost,
  isPremium,
  canAfford,
  userCoins,
}: UseTemplateButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUseTemplate = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (isPremium && coinCost > 0) {
        // For premium templates, we need to purchase first
        const response = await fetch('/api/templates/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to purchase template')
        }

        // Show success message briefly
        alert(`✅ Template purchased! ${coinCost} coins deducted.`)
      }

      // Navigate to event creation with the template
      router.push(`/events/create?templateId=${templateId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  const buttonDisabled = (isPremium && !canAfford) || isLoading

  return (
    <div>
      <button
        onClick={handleUseTemplate}
        disabled={buttonDisabled}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform ${
          buttonDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : coinCost === 0 ? (
          '🎉 Use This Template (FREE)'
        ) : canAfford ? (
          `✨ Use This Template (${coinCost} coins)`
        ) : (
          `🔒 Not Enough Coins (Need ${coinCost - userCoins} more)`
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {coinCost === 0 && (
        <p className="text-center text-sm text-gray-500 mt-3">
          This is a free template - start creating your event now!
        </p>
      )}
    </div>
  )
}
