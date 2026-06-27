import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import BillingPortalButton from '@/components/billing-portal-button'

export default async function ManageSubscriptionPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      subscription: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
    },
  })

  if (!user) {
    redirect('/auth/login')
  }

  // If not PRO, redirect to upgrade
  if (user.subscription !== 'PRO') {
    redirect('/subscription/upgrade')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/profile" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Profile
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ⭐ Manage Subscription
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Current Plan */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm p-8 mb-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">PRO Plan</h2>
              <p className="text-purple-700 font-semibold">Active Subscription</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">$9.99</div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
          </div>

          {user.stripeCurrentPeriodEnd && (
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Next billing date:</span>
                <span className="font-semibold text-gray-900">
                  {format(new Date(user.stripeCurrentPeriodEnd), 'MMMM d, yyyy')}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">Unlimited email invitations</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">All premium templates & features</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">Priority support</span>
            </div>
          </div>
        </div>

        {/* Billing Portal */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Billing Management</h3>
          <p className="text-gray-600 mb-6">
            Update your payment method, view invoices, or manage your subscription through our secure billing portal.
          </p>

          <BillingPortalButton />
        </div>

        {/* Cancel Subscription */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Subscription</h3>
          <p className="text-gray-600 mb-6">
            Need to cancel? You'll retain PRO access until the end of your current billing period.
          </p>

          <Link
            href="/subscription/cancel"
            className="inline-block py-2 px-6 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Cancel Subscription
          </Link>
        </div>
      </main>
    </div>
  )
}
