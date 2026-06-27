'use client'

import { useState } from 'react'

interface ImportGuestsCsvProps {
  eventId: string
  onImportComplete: () => void
}

export default function ImportGuestsCsv({ eventId, onImportComplete }: ImportGuestsCsvProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ added: number; errors: string[] } | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())

      if (lines.length === 0) {
        throw new Error('CSV file is empty')
      }

      // Parse CSV (expecting: name,email,phone,plusOne)
      const guests = []
      const errors: string[] = []

      // Skip header row if it exists
      const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const parts = line.split(',').map(p => p.trim())

        if (parts.length < 2) {
          errors.push(`Line ${i + 1}: Invalid format (needs at least name and email)`)
          continue
        }

        const [name, email, phone = '', plusOne = 'false'] = parts

        if (!name || !email) {
          errors.push(`Line ${i + 1}: Missing name or email`)
          continue
        }

        // Basic email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors.push(`Line ${i + 1}: Invalid email format: ${email}`)
          continue
        }

        guests.push({
          name,
          email,
          phone: phone || null,
          plusOne: plusOne.toLowerCase() === 'true' || plusOne === '1',
        })
      }

      if (guests.length === 0) {
        throw new Error('No valid guests found in CSV')
      }

      // Send to API
      const response = await fetch('/api/guests/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, guests }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import guests')
      }

      setResult({ added: data.added, errors })
      onImportComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import CSV')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Import CSV
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Import Guests from CSV</h3>
          <button
            onClick={() => {
              setIsOpen(false)
              setError(null)
              setResult(null)
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-semibold mb-2">
              ✅ Successfully imported {result.added} guest{result.added !== 1 ? 's' : ''}
            </p>
            {result.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-red-700 font-semibold mb-1">Errors:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  {result.errors.slice(0, 5).map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                  {result.errors.length > 5 && (
                    <li>... and {result.errors.length - 5} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">CSV Format</h4>
            <p className="text-xs text-blue-700 mb-2">
              Your CSV file should have these columns:
            </p>
            <pre className="text-xs bg-white p-2 rounded border border-blue-200 overflow-x-auto">
              name,email,phone,plusOne
            </pre>
            <p className="text-xs text-blue-600 mt-2">
              Example:
            </p>
            <pre className="text-xs bg-white p-2 rounded border border-blue-200 overflow-x-auto">
{`John Doe,john@example.com,+1234567890,true
Jane Smith,jane@example.com,,false`}
            </pre>
            <p className="text-xs text-blue-600 mt-2">
              • Phone and plusOne are optional<br />
              • First row can be headers (will be skipped if detected)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <svg className="w-8 h-8 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="ml-3 text-gray-600">Processing CSV...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
