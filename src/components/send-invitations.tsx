'use client'

import { useState } from 'react'

interface Guest {
  id: string
  name: string
  email: string
  rsvpStatus: string
  invitedAt: string | null
}

interface SendInvitationsProps {
  eventId: string
  guests: Guest[]
  userCoinBalance: number
  onSuccess?: () => void
}

export default function SendInvitations({
  eventId,
  guests,
  userCoinBalance,
  onSuccess,
}: SendInvitationsProps) {
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<{
    sent: number
    failed: number
    coinsUsed: number
    remainingCoins: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Filter guests who haven't been invited yet
  const uninvitedGuests = guests.filter((g) => !g.invitedAt)
  const invitedGuests = guests.filter((g) => g.invitedAt)

  const guestsToSend = selectedGuests.length > 0
    ? guests.filter((g) => selectedGuests.includes(g.id))
    : uninvitedGuests

  const emailCost = guestsToSend.length
  const canAfford = userCoinBalance >= emailCost

  const toggleGuest = (guestId: string) => {
    setSelectedGuests((prev) =>
      prev.includes(guestId)
        ? prev.filter((id) => id !== guestId)
        : [...prev, guestId]
    )
  }

  const selectAll = () => {
    setSelectedGuests(uninvitedGuests.map((g) => g.id))
  }

  const deselectAll = () => {
    setSelectedGuests([])
  }

  const sendInvitations = async () => {
    if (!canAfford) {
      setError(`You need ${emailCost} coins but only have ${userCoinBalance}`)
      return
    }

    setIsSending(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/invitations/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          guestIds: selectedGuests.length > 0 ? selectedGuests : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitations')
      }

      setResult({
        sent: data.sent,
        failed: data.failed,
        coinsUsed: data.coinsUsed,
        remainingCoins: data.remainingCoins,
      })

      setSelectedGuests([])

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSending(false)
    }
  }

  if (uninvitedGuests.length === 0 && invitedGuests.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <p className="text-gray-600 text-center">
          📭 No guests added yet. Add guests to send invitations.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <span>📧</span>
        <span>Send Email Invitations</span>
        <span className="ml-auto text-sm font-normal text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
          💰 {userCoinBalance} coins
        </span>
      </h3>

      {/* Status Messages */}
      {result && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-semibold mb-1">
            ✅ Invitations sent successfully!
          </p>
          <p className="text-green-700 text-sm">
            Sent: {result.sent} | Failed: {result.failed} | Coins used: {result.coinsUsed}
          </p>
          <p className="text-green-600 text-xs mt-1">
            Remaining balance: {result.remainingCoins} coins
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">❌ {error}</p>
        </div>
      )}

      {/* Guest Selection */}
      {uninvitedGuests.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">
              Select guests to invite ({uninvitedGuests.length} not yet invited)
            </p>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-xs text-purple-600 hover:text-purple-800 font-medium"
              >
                Select All
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={deselectAll}
                className="text-xs text-purple-600 hover:text-purple-800 font-medium"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto bg-white rounded-lg border border-gray-200 p-3">
            {uninvitedGuests.map((guest) => (
              <label
                key={guest.id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedGuests.includes(guest.id)}
                  onChange={() => toggleGuest(guest.id)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{guest.name}</p>
                  <p className="text-xs text-gray-500">{guest.email}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Already Invited */}
      {invitedGuests.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            ✅ Already invited ({invitedGuests.length})
          </p>
          <div className="max-h-32 overflow-y-auto bg-white rounded-lg border border-gray-200 p-3">
            {invitedGuests.map((guest) => (
              <div key={guest.id} className="flex items-center gap-3 p-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{guest.name}</p>
                  <p className="text-xs text-gray-500">{guest.email}</p>
                </div>
                <span className="text-xs text-green-600 font-medium">Sent</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost Summary */}
      {uninvitedGuests.length > 0 && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-purple-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Emails to send:</span>
            <span className="text-sm font-bold text-gray-900">{emailCost}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Cost (1 coin per email):</span>
            <span className="text-sm font-bold text-purple-700">💰 {emailCost} coins</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Balance after:</span>
            <span className={`text-sm font-bold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
              💰 {canAfford ? userCoinBalance - emailCost : userCoinBalance} coins
            </span>
          </div>
        </div>
      )}

      {/* Send Button */}
      {uninvitedGuests.length > 0 && (
        <button
          onClick={sendInvitations}
          disabled={isSending || !canAfford || emailCost === 0}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSending ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </>
          ) : !canAfford ? (
            <>
              ⚠️ Not enough coins (need {emailCost - userCoinBalance} more)
            </>
          ) : emailCost === 0 ? (
            <>
              ⚠️ Select guests to send invitations
            </>
          ) : (
            <>
              <span>📧</span>
              <span>Send {emailCost} Email{emailCost !== 1 ? 's' : ''}</span>
              <span>(-{emailCost} 💰)</span>
            </>
          )}
        </button>
      )}

      {!canAfford && emailCost > 0 && (
        <p className="mt-3 text-center text-sm text-red-600">
          💳 <a href="/coins/purchase" className="underline font-semibold">Purchase more coins</a> to send invitations
        </p>
      )}
    </div>
  )
}
