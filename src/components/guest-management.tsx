'use client'

import { useState, useEffect } from 'react'
import AddGuestForm from './add-guest-form'
import GuestList from './guest-list'
import ImportGuestsCsv from './import-guests-csv'

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

interface GuestManagementProps {
  eventId: string
  initialGuests: Guest[]
}

export default function GuestManagement({ eventId, initialGuests }: GuestManagementProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [isLoading, setIsLoading] = useState(false)

  const fetchGuests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/guests/list?eventId=${eventId}`)
      if (response.ok) {
        const data = await response.json()
        setGuests(data.guests)
      }
    } catch (error) {
      console.error('Failed to fetch guests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <AddGuestForm eventId={eventId} onGuestAdded={fetchGuests} />
        <ImportGuestsCsv eventId={eventId} onImportComplete={fetchGuests} />
      </div>

      {/* Guest List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <svg className="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : (
        <GuestList guests={guests} onUpdate={fetchGuests} />
      )}
    </div>
  )
}
