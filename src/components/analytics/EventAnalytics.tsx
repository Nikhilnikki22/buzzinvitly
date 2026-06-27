'use client'

import { useMemo } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Guest {
  id: string
  name: string
  email: string
  rsvpStatus: 'PENDING' | 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE'
  invitedAt: Date | null
  respondedAt: Date | null
  createdAt: Date
}

interface EventAnalyticsProps {
  guests: Guest[]
  eventDate: Date
}

const RSVP_COLORS = {
  ATTENDING: '#10B981',      // Green
  NOT_ATTENDING: '#EF4444',  // Red
  MAYBE: '#F59E0B',          // Orange
  PENDING: '#6B7280',        // Gray
}

const RSVP_LABELS = {
  ATTENDING: 'Attending',
  NOT_ATTENDING: 'Not Attending',
  MAYBE: 'Maybe',
  PENDING: 'Pending',
}

export default function EventAnalytics({ guests, eventDate }: EventAnalyticsProps) {
  // Calculate RSVP statistics
  const stats = useMemo(() => {
    const total = guests.length
    const attending = guests.filter(g => g.rsvpStatus === 'ATTENDING').length
    const notAttending = guests.filter(g => g.rsvpStatus === 'NOT_ATTENDING').length
    const maybe = guests.filter(g => g.rsvpStatus === 'MAYBE').length
    const pending = guests.filter(g => g.rsvpStatus === 'PENDING').length
    const responded = attending + notAttending + maybe
    const responseRate = total > 0 ? ((responded / total) * 100).toFixed(1) : '0'

    return {
      total,
      attending,
      notAttending,
      maybe,
      pending,
      responded,
      responseRate,
    }
  }, [guests])

  // Prepare data for pie chart
  const pieData = useMemo(() => {
    return [
      { name: RSVP_LABELS.ATTENDING, value: stats.attending, color: RSVP_COLORS.ATTENDING },
      { name: RSVP_LABELS.NOT_ATTENDING, value: stats.notAttending, color: RSVP_COLORS.NOT_ATTENDING },
      { name: RSVP_LABELS.MAYBE, value: stats.maybe, color: RSVP_COLORS.MAYBE },
      { name: RSVP_LABELS.PENDING, value: stats.pending, color: RSVP_COLORS.PENDING },
    ].filter(item => item.value > 0)
  }, [stats])

  // Prepare data for timeline chart (responses over time)
  const timelineData = useMemo(() => {
    const respondedGuests = guests
      .filter(g => g.respondedAt)
      .sort((a, b) => new Date(a.respondedAt!).getTime() - new Date(b.respondedAt!).getTime())

    const dataByDate: { [key: string]: { date: string; attending: number; notAttending: number; maybe: number; total: number } } = {}

    respondedGuests.forEach(guest => {
      const date = new Date(guest.respondedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

      if (!dataByDate[date]) {
        dataByDate[date] = { date, attending: 0, notAttending: 0, maybe: 0, total: 0 }
      }

      dataByDate[date].total += 1

      if (guest.rsvpStatus === 'ATTENDING') dataByDate[date].attending += 1
      else if (guest.rsvpStatus === 'NOT_ATTENDING') dataByDate[date].notAttending += 1
      else if (guest.rsvpStatus === 'MAYBE') dataByDate[date].maybe += 1
    })

    // Convert to cumulative data
    let cumulativeAttending = 0
    let cumulativeNotAttending = 0
    let cumulativeMaybe = 0

    return Object.values(dataByDate).map(day => {
      cumulativeAttending += day.attending
      cumulativeNotAttending += day.notAttending
      cumulativeMaybe += day.maybe

      return {
        date: day.date,
        Attending: cumulativeAttending,
        'Not Attending': cumulativeNotAttending,
        Maybe: cumulativeMaybe,
      }
    })
  }, [guests])

  // Prepare data for bar chart (by status)
  const barData = useMemo(() => {
    return [
      { status: 'Attending', count: stats.attending, fill: RSVP_COLORS.ATTENDING },
      { status: 'Not Attending', count: stats.notAttending, fill: RSVP_COLORS.NOT_ATTENDING },
      { status: 'Maybe', count: stats.maybe, fill: RSVP_COLORS.MAYBE },
      { status: 'Pending', count: stats.pending, fill: RSVP_COLORS.PENDING },
    ]
  }, [stats])

  return (
    <div className="space-y-6">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Guests"
          value={stats.total}
          icon="👥"
          color="bg-blue-500"
        />
        <StatCard
          title="Attending"
          value={stats.attending}
          icon="✅"
          color="bg-green-500"
        />
        <StatCard
          title="Response Rate"
          value={`${stats.responseRate}%`}
          icon="📊"
          color="bg-purple-500"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon="⏳"
          color="bg-gray-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - RSVP Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">RSVP Breakdown</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No RSVP data yet
            </div>
          )}
        </div>

        {/* Bar Chart - Status Count */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Guest Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline Chart - Responses Over Time */}
      {timelineData.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Response Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Attending" stroke={RSVP_COLORS.ATTENDING} strokeWidth={2} />
              <Line type="monotone" dataKey="Not Attending" stroke={RSVP_COLORS.NOT_ATTENDING} strokeWidth={2} />
              <Line type="monotone" dataKey="Maybe" stroke={RSVP_COLORS.MAYBE} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Detailed Stats */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Invited</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Responded</p>
            <p className="text-2xl font-bold text-gray-900">{stats.responded}</p>
            <p className="text-xs text-gray-500">{stats.responseRate}% response rate</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Confirmed Attendees</p>
            <p className="text-2xl font-bold text-green-600">{stats.attending}</p>
            <p className="text-xs text-gray-500">
              {stats.total > 0 ? ((stats.attending / stats.total) * 100).toFixed(1) : '0'}% of total
            </p>
          </div>
        </div>

        {/* Breakdown by Status */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Breakdown by Status</h4>
          <div className="space-y-3">
            <StatusBar label="Attending" count={stats.attending} total={stats.total} color={RSVP_COLORS.ATTENDING} />
            <StatusBar label="Not Attending" count={stats.notAttending} total={stats.total} color={RSVP_COLORS.NOT_ATTENDING} />
            <StatusBar label="Maybe" count={stats.maybe} total={stats.total} color={RSVP_COLORS.MAYBE} />
            <StatusBar label="Pending Response" count={stats.pending} total={stats.total} color={RSVP_COLORS.PENDING} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper component for stat cards
function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// Helper component for status bars
function StatusBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percentage = total > 0 ? (count / total) * 100 : 0

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
