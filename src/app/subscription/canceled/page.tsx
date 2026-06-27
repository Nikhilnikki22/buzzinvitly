import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function SubscriptionCanceledPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Confirmation Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Subscription Canceled
          </h1>
          <p className="text-gray-600 mb-8">
            Your PRO subscription has been set to cancel at the end of the current billing period
          </p>

          {/* Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8 text-sm text-left">
            <p className="font-semibold text-blue-900 mb-2">What happens next:</p>
            <ul className="space-y-1 text-blue-800">
              <li>• You'll keep PRO access until your billing period ends</li>
              <li>• No further charges will be made</li>
              <li>• You can reactivate anytime before the period ends</li>
              <li>• After that, you'll switch to the FREE plan</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/subscription/manage"
              className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Reactivate Subscription
            </Link>
            <Link
              href="/dashboard"
              className="block w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            We're sorry to see you go. Your feedback helps us improve BuzzInvitly for everyone.
          </p>
        </div>
      </div>
    </div>
  )
}
