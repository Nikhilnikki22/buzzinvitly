import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string
  }>
}

export default async function CoinPurchaseSuccess({ searchParams }: SuccessPageProps) {
  const session = await auth()
  const params = await searchParams

  if (!session) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { coinBalance: true },
  })

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Purchase Successful! 🎉
          </h1>
          <p className="text-gray-600 mb-8">
            Your coins have been added to your account
          </p>

          {/* Coin Balance */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 mb-8 border-2 border-yellow-200">
            <p className="text-sm text-gray-600 mb-2">Your New Balance</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl">💰</span>
              <span className="text-4xl font-bold text-gray-900">{user.coinBalance}</span>
              <span className="text-xl text-gray-600">coins</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              You can now send {user.coinBalance} email invitations!
            </p>
          </div>

          {/* Receipt Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <p>A receipt has been sent to your email address</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/events/create"
              className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Create an Event
            </Link>
            <Link
              href="/my-events"
              className="block w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              View My Events
            </Link>
            <Link
              href="/profile"
              className="block w-full py-2 px-4 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              View Purchase History
            </Link>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
