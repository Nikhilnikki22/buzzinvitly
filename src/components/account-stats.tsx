'use client'

import { useEffect, useState } from 'react'

interface Stats {
  totalEvents: number
  totalGuests: number
  totalInvitationsSent: number
  upcomingEvents: number
}

export default function AccountStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Account Statistics</h3>
        <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const statCards = [
    {
      label: 'Total Events',
      value: stats.totalEvents,
      icon: '🎉',
      color: 'blue',
    },
    {
      label: 'Total Guests',
      value: stats.totalGuests,
      icon: '👥',
      color: 'purple',
    },
    {
      label: 'Invitations Sent',
      value: stats.totalInvitationsSent,
      icon: '📧',
      color: 'green',
    },
    {
      label: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: '📅',
      color: 'orange',
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Account Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-3xl font-bold text-${stat.color}-600 mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
