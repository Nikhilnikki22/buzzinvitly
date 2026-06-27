'use client'

import { format } from 'date-fns'

interface Purchase {
  id: string
  stripePaymentId: string
  amount: number
  coins: number
  status: string
  createdAt: Date
  receiptUrl: string | null
}

interface PurchaseHistoryProps {
  purchases: Purchase[]
}

export default function PurchaseHistory({ purchases }: PurchaseHistoryProps) {
  if (purchases.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase History</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Coins</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-sm text-gray-900">
                  {format(new Date(purchase.createdAt), 'MMM d, yyyy h:mm a')}
                </td>
                <td className="py-4 px-4 text-sm">
                  <span className="font-semibold text-blue-600">{purchase.coins} coins</span>
                </td>
                <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                  ${purchase.amount.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      purchase.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : purchase.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : purchase.status === 'FAILED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {purchase.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm">
                  {purchase.receiptUrl ? (
                    <a
                      href={purchase.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Receipt
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {purchases.length >= 10 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Showing last 10 purchases
          </p>
        </div>
      )}
    </div>
  )
}
