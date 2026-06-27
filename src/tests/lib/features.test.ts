import { describe, it, expect } from 'vitest'
import { getFeatureAccess, canSendEmail, getEmailCost } from '@/lib/features'

describe('Feature Access', () => {
  describe('getFeatureAccess', () => {
    it('should grant all features to PRO users', () => {
      const access = getFeatureAccess('PRO')

      expect(access.hasUnlimitedEmails).toBe(true)
      expect(access.hasPremiumTemplates).toBe(true)
      expect(access.hasCustomBranding).toBe(true)
      expect(access.hasAdvancedAnalytics).toBe(true)
      expect(access.hasPrioritySupport).toBe(true)
      expect(access.canRemoveBranding).toBe(true)
    })

    it('should restrict features for FREE users', () => {
      const access = getFeatureAccess('FREE')

      expect(access.hasUnlimitedEmails).toBe(false)
      expect(access.hasPremiumTemplates).toBe(false)
      expect(access.hasCustomBranding).toBe(false)
      expect(access.hasAdvancedAnalytics).toBe(false)
      expect(access.hasPrioritySupport).toBe(false)
      expect(access.canRemoveBranding).toBe(false)
    })
  })

  describe('canSendEmail', () => {
    it('should allow PRO users to send emails regardless of coin balance', () => {
      const result1 = canSendEmail('PRO', 0)
      const result2 = canSendEmail('PRO', 100)

      expect(result1.canSend).toBe(true)
      expect(result1.reason).toBeUndefined()
      expect(result2.canSend).toBe(true)
      expect(result2.reason).toBeUndefined()
    })

    it('should allow FREE users with sufficient coins', () => {
      const result1 = canSendEmail('FREE', 1)
      const result2 = canSendEmail('FREE', 10)

      expect(result1.canSend).toBe(true)
      expect(result1.reason).toBeUndefined()
      expect(result2.canSend).toBe(true)
      expect(result2.reason).toBeUndefined()
    })

    it('should prevent FREE users with insufficient coins', () => {
      const result = canSendEmail('FREE', 0)

      expect(result.canSend).toBe(false)
      expect(result.reason).toBe('Insufficient coins. Purchase more coins or upgrade to PRO for unlimited emails.')
    })
  })

  describe('getEmailCost', () => {
    it('should return 0 cost for PRO users', () => {
      const cost = getEmailCost('PRO')
      expect(cost).toBe(0)
    })

    it('should return 1 coin cost for FREE users', () => {
      const cost = getEmailCost('FREE')
      expect(cost).toBe(1)
    })
  })
})
