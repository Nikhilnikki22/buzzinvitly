import { describe, it, expect } from 'vitest'

// Analytics calculation utilities
export function calculateResponseRate(total: number, responded: number): number {
  if (total === 0) return 0
  return Number(((responded / total) * 100).toFixed(1))
}

export function calculateAttendancePercentage(total: number, attending: number): number {
  if (total === 0) return 0
  return Number(((attending / total) * 100).toFixed(1))
}

export function groupResponsesByDate(guests: Array<{ respondedAt: Date | null; rsvpStatus: string }>) {
  const dataByDate: Record<string, { attending: number; notAttending: number; maybe: number }> = {}

  guests
    .filter(g => g.respondedAt)
    .forEach(guest => {
      const date = new Date(guest.respondedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

      if (!dataByDate[date]) {
        dataByDate[date] = { attending: 0, notAttending: 0, maybe: 0 }
      }

      if (guest.rsvpStatus === 'ATTENDING') dataByDate[date].attending += 1
      else if (guest.rsvpStatus === 'NOT_ATTENDING') dataByDate[date].notAttending += 1
      else if (guest.rsvpStatus === 'MAYBE') dataByDate[date].maybe += 1
    })

  return dataByDate
}

describe('Analytics Calculations', () => {
  describe('calculateResponseRate', () => {
    it('should calculate correct response rate', () => {
      expect(calculateResponseRate(100, 70)).toBe(70.0)
      expect(calculateResponseRate(50, 25)).toBe(50.0)
      expect(calculateResponseRate(10, 3)).toBe(30.0)
    })

    it('should handle edge cases', () => {
      expect(calculateResponseRate(0, 0)).toBe(0)
      expect(calculateResponseRate(10, 0)).toBe(0)
      expect(calculateResponseRate(10, 10)).toBe(100.0)
    })

    it('should round to one decimal place', () => {
      expect(calculateResponseRate(3, 1)).toBe(33.3)
      expect(calculateResponseRate(7, 2)).toBe(28.6)
    })
  })

  describe('calculateAttendancePercentage', () => {
    it('should calculate correct attendance percentage', () => {
      expect(calculateAttendancePercentage(100, 60)).toBe(60.0)
      expect(calculateAttendancePercentage(50, 30)).toBe(60.0)
    })

    it('should handle edge cases', () => {
      expect(calculateAttendancePercentage(0, 0)).toBe(0)
      expect(calculateAttendancePercentage(10, 0)).toBe(0)
      expect(calculateAttendancePercentage(10, 10)).toBe(100.0)
    })
  })

  describe('groupResponsesByDate', () => {
    it('should group responses by date', () => {
      const guests = [
        { respondedAt: new Date('2026-03-01'), rsvpStatus: 'ATTENDING' },
        { respondedAt: new Date('2026-03-01'), rsvpStatus: 'ATTENDING' },
        { respondedAt: new Date('2026-03-02'), rsvpStatus: 'NOT_ATTENDING' },
        { respondedAt: new Date('2026-03-02'), rsvpStatus: 'MAYBE' },
      ]

      const result = groupResponsesByDate(guests)

      expect(Object.keys(result)).toHaveLength(2)
      expect(result['Mar 1'].attending).toBe(2)
      expect(result['Mar 2'].notAttending).toBe(1)
      expect(result['Mar 2'].maybe).toBe(1)
    })

    it('should filter out guests without respondedAt', () => {
      const guests = [
        { respondedAt: new Date('2026-03-01'), rsvpStatus: 'ATTENDING' },
        { respondedAt: null, rsvpStatus: 'PENDING' },
      ]

      const result = groupResponsesByDate(guests)

      expect(Object.keys(result)).toHaveLength(1)
    })

    it('should handle empty guest list', () => {
      const result = groupResponsesByDate([])
      expect(Object.keys(result)).toHaveLength(0)
    })
  })
})
