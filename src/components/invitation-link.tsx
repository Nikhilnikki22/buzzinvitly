'use client'

import { useState, useEffect } from 'react'

interface InvitationLinkProps {
  eventId: string
  initialToken: string | null
}

export default function InvitationLink({ eventId, initialToken }: InvitationLinkProps) {
  const [token, setToken] = useState<string | null>(initialToken)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const invitationUrl = token && typeof window !== 'undefined'
    ? `${window.location.origin}/rsvp/${token}`
    : null

  const generateToken = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/events/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      })

      const data = await response.json()

      if (response.ok) {
        setToken(data.token)
      } else {
        alert(data.error || 'Failed to generate invitation link')
      }
    } catch (error) {
      console.error('Failed to generate token:', error)
      alert('Failed to generate invitation link')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (!invitationUrl) return

    try {
      await navigator.clipboard.writeText(invitationUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Failed to copy link')
    }
  }

  if (!token) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">📧 Invitation Link</h3>
        <p className="text-gray-600 mb-4">
          Generate a shareable invitation link for your guests to RSVP
        </p>
        <button
          onClick={generateToken}
          disabled={isGenerating}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </span>
          ) : (
            '✨ Generate Invitation Link'
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
      <h3 className="text-lg font-bold text-gray-900 mb-3">📧 Invitation Link</h3>
      <p className="text-gray-600 mb-4 text-sm">
        Share this link with your guests so they can RSVP
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={invitationUrl || ''}
          readOnly
          className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg font-mono text-sm text-gray-700"
        />
        <button
          onClick={copyToClipboard}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <a
          href={invitationUrl || ''}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-4 bg-white border border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors text-center"
        >
          👁️ Preview
        </a>
        <button
          onClick={() => {
            const subject = encodeURIComponent('You\'re Invited!')
            const body = encodeURIComponent(`You're invited!\n\nPlease RSVP here: ${invitationUrl}`)
            window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
          }}
          className="flex-1 py-2 px-4 bg-white border border-purple-300 text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition-colors text-center"
        >
          📧 Email Link
        </button>
      </div>
    </div>
  )
}
