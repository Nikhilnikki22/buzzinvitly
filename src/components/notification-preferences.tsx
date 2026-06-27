'use client'

import { useState } from 'react'

interface NotificationPreferencesProps {
  initialPreferences?: {
    emailOnRSVP: boolean
    emailOnEventReminder: boolean
    emailOnNewGuest: boolean
    marketingEmails: boolean
  }
}

export default function NotificationPreferences({ initialPreferences }: NotificationPreferencesProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [preferences, setPreferences] = useState({
    emailOnRSVP: initialPreferences?.emailOnRSVP ?? true,
    emailOnEventReminder: initialPreferences?.emailOnEventReminder ?? true,
    emailOnNewGuest: initialPreferences?.emailOnNewGuest ?? true,
    marketingEmails: initialPreferences?.marketingEmails ?? false,
  })

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setSuccess('')

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        setSuccess('Preferences saved successfully!')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const preferencesOptions = [
    {
      key: 'emailOnRSVP' as const,
      label: 'RSVP Notifications',
      description: 'Get notified when someone RSVPs to your event',
      icon: '📬',
    },
    {
      key: 'emailOnEventReminder' as const,
      label: 'Event Reminders',
      description: 'Receive reminders before your upcoming events',
      icon: '⏰',
    },
    {
      key: 'emailOnNewGuest' as const,
      label: 'New Guest Alerts',
      description: 'Get notified when a new guest is added to your event',
      icon: '👋',
    },
    {
      key: 'marketingEmails' as const,
      label: 'Marketing Emails',
      description: 'Receive updates about new features and promotions',
      icon: '📢',
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {preferencesOptions.map((option) => (
          <div
            key={option.key}
            className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start gap-3 flex-1">
              <span className="text-2xl">{option.icon}</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{option.label}</h4>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle(option.key)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                preferences[option.key] ? 'bg-blue-600' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={preferences[option.key]}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  preferences[option.key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  )
}
