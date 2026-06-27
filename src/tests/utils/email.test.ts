import { describe, it, expect } from 'vitest'

// Email validation utility
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

describe('Email Validation', () => {
  it('should validate correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('user.name@domain.co.uk')).toBe(true)
    expect(validateEmail('first+last@company.org')).toBe(true)
  })

  it('should reject invalid email addresses', () => {
    expect(validateEmail('invalid')).toBe(false)
    expect(validateEmail('missing@domain')).toBe(false)
    expect(validateEmail('@nodomain.com')).toBe(false)
    expect(validateEmail('no@domain@multiple.com')).toBe(false)
    expect(validateEmail('')).toBe(false)
  })

  it('should handle edge cases', () => {
    expect(validateEmail(' ')).toBe(false)
    expect(validateEmail('test @example.com')).toBe(false)
    expect(validateEmail('test@example .com')).toBe(false)
  })
})
