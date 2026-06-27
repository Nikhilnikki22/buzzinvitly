'use client'

import Link from 'next/link'

interface CoinManagementProps {
  coinBalance: number
}

export default function CoinManagement({ coinBalance }: CoinManagementProps) {
  const coinPackages = [
    { amount: 10, price: 0.99 },
    { amount: 50, price: 3.99 },
    { amount: 100, price: 6.99 },
    { amount: 500, price: 29.99 },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Coin Balance</h3>

      {/* Current Balance */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 mb-6 border-2 border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Your Current Balance</p>
            <div className="flex items-center gap-2">
              <span className="text-4xl">💰</span>
              <span className="text-4xl font-bold text-gray-900">{coinBalance}</span>
              <span className="text-2xl text-gray-600">coins</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">What can you do?</p>
            <p className="text-lg font-semibold text-gray-900">
              Send {coinBalance} emails
            </p>
            <p className="text-xs text-gray-500">1 coin = 1 email</p>
          </div>
        </div>
      </div>

      {/* Coin Packages */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Purchase More Coins</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {coinPackages.map((pkg) => (
            <div
              key={pkg.amount}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer text-center"
            >
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {pkg.amount}
              </div>
              <div className="text-xs text-gray-500 mb-2">coins</div>
              <div className="text-lg font-bold text-gray-900">
                ${pkg.price}
              </div>
              <div className="text-xs text-gray-500">
                ${(pkg.price / pkg.amount).toFixed(3)}/coin
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Button */}
      <Link
        href="/coins/purchase"
        className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-center hover:from-blue-700 hover:to-purple-700 transition-colors"
      >
        Purchase Coins
      </Link>

      {/* Info */}
      <p className="text-sm text-gray-500 mt-4 text-center">
        💡 <strong>Tip:</strong> Upgrade to PRO for unlimited email invitations!
      </p>
    </div>
  )
}
