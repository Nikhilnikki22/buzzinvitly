'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { COIN_PACKAGES } from '@/lib/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CoinPurchaseFormProps {
  userEmail: string
}

export default function CoinPurchaseForm({ userEmail }: CoinPurchaseFormProps) {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState(COIN_PACKAGES[1].id)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const selectedPkg = COIN_PACKAGES.find((pkg) => pkg.id === selectedPackage)!

  const handlePurchase = async () => {
    setError('')
    setIsProcessing(true)

    try {
      // Create checkout session
      const response = await fetch('/api/coins/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process purchase')
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Coin Package</h2>
      <p className="text-gray-600 mb-8">
        Choose how many coins you'd like to purchase
      </p>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Coin Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {COIN_PACKAGES.map((pkg) => {
          const isSelected = selectedPackage === pkg.id
          const costPerCoin = (pkg.price / pkg.coins).toFixed(3)

          return (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              disabled={isProcessing}
              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Badges */}
              <div className="absolute top-3 right-3 flex gap-2">
                {pkg.popular && (
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                    POPULAR
                  </span>
                )}
                {pkg.bestValue && (
                  <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
                    BEST VALUE
                  </span>
                )}
              </div>

              {/* Coin Amount */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-bold text-gray-900">{pkg.coins}</span>
                <span className="text-lg text-gray-600">coins</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-blue-600">${pkg.price}</span>
              </div>

              {/* Cost per coin */}
              <div className="text-sm text-gray-500">
                ${costPerCoin} per coin
              </div>

              {/* Emails */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  📧 Send <strong className="text-gray-900">{pkg.coins} emails</strong>
                </p>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 left-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Purchase Summary */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Purchase Summary</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Package:</span>
            <span className="font-semibold text-gray-900">{selectedPkg.coins} coins</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-semibold text-gray-900">${selectedPkg.price}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Cost per coin:</span>
            <span className="text-gray-600">${(selectedPkg.price / selectedPkg.coins).toFixed(3)}</span>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-blue-600">${selectedPkg.price}</span>
          </div>
        </div>
      </div>

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={isProcessing}
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          <>
            🔒 Secure Checkout - ${selectedPkg.price}
          </>
        )}
      </button>

      {/* Security Info */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure Payment
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Instant Receipt
        </div>
      </div>
    </div>
  )
}
