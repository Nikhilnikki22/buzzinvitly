'use client'

import Link from 'next/link'

interface SubscriptionManagementProps {
  subscription: 'FREE' | 'PRO'
}

export default function SubscriptionManagement({ subscription }: SubscriptionManagementProps) {
  const isPro = subscription === 'PRO'

  const features = {
    FREE: [
      { name: '10 free coins on signup', included: true },
      { name: 'Unlimited events', included: true },
      { name: 'Unlimited guests', included: true },
      { name: 'Email invitations', included: true, note: '1 coin per email' },
      { name: 'RSVP tracking', included: true },
      { name: 'Basic templates', included: true },
      { name: 'Premium templates', included: false },
      { name: 'Custom branding', included: false },
      { name: 'Priority support', included: false },
    ],
    PRO: [
      { name: 'Everything in FREE', included: true },
      { name: 'Unlimited email invitations', included: true, highlight: true },
      { name: 'All premium templates', included: true },
      { name: 'Custom branding', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Priority support', included: true },
      { name: 'Remove BuzzInvitly branding', included: true },
      { name: 'Early access to new features', included: true },
    ],
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Subscription Plan</h3>

      {/* Current Plan Badge */}
      <div className={`rounded-xl p-6 mb-6 ${
        isPro
          ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200'
          : 'bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{isPro ? '⭐' : '🆓'}</span>
              <span className="text-3xl font-bold text-gray-900">
                {subscription}
              </span>
            </div>
            <p className="text-gray-600">
              {isPro
                ? 'You have access to all premium features!'
                : 'Upgrade to unlock unlimited invitations and premium features'}
            </p>
          </div>
          {isPro && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Billing</p>
              <p className="text-xl font-bold text-gray-900">$9.99/mo</p>
            </div>
          )}
        </div>

        {!isPro && (
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upgrade to PRO</p>
                <p className="text-2xl font-bold text-purple-600">$9.99/month</p>
              </div>
              <Link
                href="/subscription/upgrade"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Features List */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          {isPro ? 'Your Features' : 'FREE Plan Features'}
        </h4>
        <ul className="space-y-3">
          {features[subscription].map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                feature.included
                  ? feature.highlight
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {feature.included ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <span className={`${
                  feature.included ? 'text-gray-900' : 'text-gray-400 line-through'
                } ${feature.highlight ? 'font-semibold' : ''}`}>
                  {feature.name}
                </span>
                {feature.note && (
                  <span className="text-sm text-gray-500 ml-2">({feature.note})</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      {isPro ? (
        <div className="flex gap-3">
          <Link
            href="/subscription/manage"
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium text-center hover:bg-gray-300 transition-colors"
          >
            Manage Subscription
          </Link>
          <Link
            href="/subscription/cancel"
            className="py-2 px-4 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      ) : (
        <Link
          href="/subscription/upgrade"
          className="block w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-center hover:from-purple-700 hover:to-pink-700 transition-colors"
        >
          Upgrade to PRO
        </Link>
      )}
    </div>
  )
}
