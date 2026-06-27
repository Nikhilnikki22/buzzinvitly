'use client'

import { useState } from 'react'

interface Guest {
  id: string
  name: string
  email: string
  phone: string | null
  rsvpStatus: 'PENDING' | 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE'
  plusOne: boolean
  plusOneName: string | null
  invitedAt: Date | null
  respondedAt: Date | null
  createdAt: Date
}

interface ExportGuestListProps {
  guests: Guest[]
  eventTitle: string
}

export default function ExportGuestList({ guests, eventTitle }: ExportGuestListProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = () => {
    setIsExporting(true)

    try {
      // Prepare CSV headers
      const headers = [
        'Name',
        'Email',
        'Phone',
        'RSVP Status',
        'Plus One',
        'Plus One Name',
        'Invited At',
        'Responded At',
        'Created At',
      ]

      // Prepare CSV rows
      const rows = guests.map(guest => [
        guest.name,
        guest.email,
        guest.phone || '',
        guest.rsvpStatus,
        guest.plusOne ? 'Yes' : 'No',
        guest.plusOneName || '',
        guest.invitedAt ? new Date(guest.invitedAt).toLocaleString() : '',
        guest.respondedAt ? new Date(guest.respondedAt).toLocaleString() : '',
        new Date(guest.createdAt).toLocaleString(),
      ])

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n')

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `${sanitizeFilename(eventTitle)}_guest_list.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Show success message
      setTimeout(() => {
        alert('✅ Guest list exported successfully!')
      }, 100)
    } catch (error) {
      console.error('Export error:', error)
      alert('❌ Failed to export guest list. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportAttendingOnly = () => {
    const attendingGuests = guests.filter(g => g.rsvpStatus === 'ATTENDING')

    if (attendingGuests.length === 0) {
      alert('No attending guests to export.')
      return
    }

    setIsExporting(true)

    try {
      const headers = ['Name', 'Email', 'Phone', 'Plus One', 'Plus One Name', 'Responded At']

      const rows = attendingGuests.map(guest => [
        guest.name,
        guest.email,
        guest.phone || '',
        guest.plusOne ? 'Yes' : 'No',
        guest.plusOneName || '',
        guest.respondedAt ? new Date(guest.respondedAt).toLocaleString() : '',
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `${sanitizeFilename(eventTitle)}_attending_guests.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => {
        alert(`✅ Exported ${attendingGuests.length} attending guests!`)
      }, 100)
    } catch (error) {
      console.error('Export error:', error)
      alert('❌ Failed to export. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Export Guest List</h3>
          <p className="text-sm text-gray-600">
            Download your guest list as CSV for use in spreadsheets
          </p>
        </div>
        <div className="text-3xl">📥</div>
      </div>

      <div className="space-y-3">
        {/* Export All Guests */}
        <button
          onClick={exportToCSV}
          disabled={isExporting || guests.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {isExporting ? 'Exporting...' : `Export All Guests (${guests.length})`}
        </button>

        {/* Export Attending Only */}
        <button
          onClick={exportAttendingOnly}
          disabled={isExporting || guests.filter(g => g.rsvpStatus === 'ATTENDING').length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {isExporting ? 'Exporting...' : `Export Attending Only (${guests.filter(g => g.rsvpStatus === 'ATTENDING').length})`}
        </button>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Tip:</strong> The exported CSV can be opened in Excel, Google Sheets, or any spreadsheet application.
          </p>
        </div>
      </div>
    </div>
  )
}

// Helper function to sanitize filename
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase()
}
