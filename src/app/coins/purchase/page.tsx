import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import CoinPurchaseForm from '@/components/coin-purchase-form'
import PurchaseHistory from '@/components/purchase-history'

export default async function CoinPurchasePage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  // Get user with coin balance
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      coinBalance: true,
      email: true,
      name: true,
    },
  })

  if (!user) {
    redirect('/auth/login')
  }

  // Get purchase history
  const purchases = await prisma.purchase.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              💰 Purchase Coins
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Your Balance:</span>{' '}
                <span className="font-semibold text-blue-600">
                  {user.coinBalance} coins
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Purchase Form */}
          <div className="lg:col-span-2">
            <CoinPurchaseForm userEmail={user.email} />
          </div>

          {/* Right Column - Info & History */}
          <div className="space-y-6">
            {/* Current Balance Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-sm p-6 border-2 border-yellow-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Coin Balance</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">💰</span>
                <div>
                  <div className="text-4xl font-bold text-gray-900">{user.coinBalance}</div>
                  <div className="text-sm text-gray-600">coins</div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 text-sm">
                <p className="text-gray-600 mb-1">What can you do?</p>
                <p className="font-semibold text-gray-900">
                  Send {user.coinBalance} email invitations
                </p>
                <p className="text-xs text-gray-500 mt-1">1 coin = 1 email</p>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Select Package</p>
                    <p className="text-xs text-gray-600">Choose the number of coins you need</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Secure Payment</p>
                    <p className="text-xs text-gray-600">Pay securely with Stripe</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Instant Coins</p>
                    <p className="text-xs text-gray-600">Coins added immediately to your balance</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Send Invitations</p>
                    <p className="text-xs text-gray-600">Use coins to send email invitations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Alternative */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm p-6 border-2 border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">💡 Want Unlimited?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upgrade to PRO for unlimited email invitations and premium features!
              </p>
              <Link
                href="/subscription/upgrade"
                className="block w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-center hover:from-purple-700 hover:to-pink-700 transition-colors text-sm"
              >
                Upgrade to PRO - $9.99/mo
              </Link>
            </div>
          </div>
        </div>

        {/* Purchase History */}
        {purchases.length > 0 && (
          <div className="mt-12">
            <PurchaseHistory purchases={purchases} />
          </div>
        )}
      </main>
    </div>
  )
}
