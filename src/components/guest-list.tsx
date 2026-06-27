'use client'

import { useState } from 'react'

interface Guest {
  id: string
  name: string
  email: string
  phone: string | null
  rsvpStatus: string
  plusOne: boolean
  plusOneName: string | null
  invitedAt: string | null
}

interface GuestListProps {
  guests: Guest[]
  onUpdate: () => void
}

export default function GuestList({ guests, onUpdate }: GuestListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (guestId: string) => {
    if (!confirm('Are you sure you want to remove this guest?')) {
      return
    }

    setDeletingId(guestId)

    try {
      const response = await fetch('/api/guests/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete guest')
      }

      onUpdate()
    } catch (error) {
      console.error('Failed to delete guest:', error)
      alert('Failed to delete guest')
    } finally {
      setDeletingId(null)
    }
  }

  const getRsvpBadgeColor = (status: string) => {
    switch (status) {
      case 'ATTENDING':
        return 'bg-green-100 text-green-800'
      case 'NOT_ATTENDING':
        return 'bg-red-100 text-red-800'
      case 'MAYBE':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRsvpIcon = (status: string) => {
    switch (status) {
      case 'ATTENDING':
        return '✅'
      case 'NOT_ATTENDING':
        return '❌'
      case 'MAYBE':
        return '❓'
      default:
        return '⏳'
    }
  }

  if (guests.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-gray-600 font-medium">No guests added yet</p>
        <p className="text-sm text-gray-500 mt-1">Add your first guest to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Guest List ({guests.length})
        </h3>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-600">
            ✅ {guests.filter(g => g.rsvpStatus === 'ATTENDING').length} Attending
          </span>
          <span className="text-gray-600">
            ❌ {guests.filter(g => g.rsvpStatus === 'NOT_ATTENDING').length} Declined
          </span>
          <span className="text-gray-600">
            ⏳ {guests.filter(g => g.rsvpStatus === 'PENDING').length} Pending
          </span>
        </div>
      </div>

      {guests.map((guest) => (
        <div
          key={guest.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-gray-900">{guest.name}</h4>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getRsvpBadgeColor(guest.rsvpStatus)}`}>
                  {getRsvpIcon(guest.rsvpStatus)} {guest.rsvpStatus}
                </span>
                {guest.plusOne && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
                    +1
                  </span>
                )}
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {guest.email}
                </p>
                {guest.phone && (
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {guest.phone}
                  </p>
                )}
                {guest.plusOne && guest.plusOneName && (
                  <p className="text-purple-700 font-medium">
                    Plus One: {guest.plusOneName}
                  </p>
                )}
                {guest.invitedAt && (
                  <p className="text-xs text-gray-500">
                    Invited: {new Date(guest.invitedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => handleDelete(guest.id)}
              disabled={deletingId === guest.id}
              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
              title="Remove guest"
            >
              {deletingId === guest.id ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
