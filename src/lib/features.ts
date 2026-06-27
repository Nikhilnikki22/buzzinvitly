import { SubscriptionTier } from '@prisma/client';

export interface FeatureAccess {
  hasUnlimitedEmails: boolean;
  hasPremiumTemplates: boolean;
  hasCustomBranding: boolean;
  hasAdvancedAnalytics: boolean;
  hasPrioritySupport: boolean;
  canRemoveBranding: boolean;
}

export function getFeatureAccess(subscription: SubscriptionTier): FeatureAccess {
  const isPro = subscription === 'PRO';

  return {
    hasUnlimitedEmails: isPro,
    hasPremiumTemplates: isPro,
    hasCustomBranding: isPro,
    hasAdvancedAnalytics: isPro,
    hasPrioritySupport: isPro,
    canRemoveBranding: isPro,
  };
}

export function canSendEmail(subscription: SubscriptionTier, coinBalance: number): {
  canSend: boolean;
  reason?: string;
} {
  // PRO users have unlimited emails
  if (subscription === 'PRO') {
    return { canSend: true };
  }

  // FREE users need coins
  if (coinBalance >= 1) {
    return { canSend: true };
  }

  return {
    canSend: false,
    reason: 'Insufficient coins. Purchase more coins or upgrade to PRO for unlimited emails.',
  };
}

export function getEmailCost(subscription: SubscriptionTier): number {
  // PRO users don't pay per email
  if (subscription === 'PRO') {
    return 0;
  }

  // FREE users pay 1 coin per email
  return 1;
}
