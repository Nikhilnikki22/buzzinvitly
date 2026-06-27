import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Coin packages configuration
export const COIN_PACKAGES = [
  {
    id: 'coins_10',
    coins: 10,
    price: 0.99,
    priceInCents: 99,
    popular: false,
  },
  {
    id: 'coins_50',
    coins: 50,
    price: 3.99,
    priceInCents: 399,
    popular: true,
  },
  {
    id: 'coins_100',
    coins: 100,
    price: 6.99,
    priceInCents: 699,
    popular: false,
  },
  {
    id: 'coins_500',
    coins: 500,
    price: 29.99,
    priceInCents: 2999,
    popular: false,
    bestValue: true,
  },
] as const;

export type CoinPackage = typeof COIN_PACKAGES[number];

export function getCoinPackage(packageId: string): CoinPackage | undefined {
  return COIN_PACKAGES.find((pkg) => pkg.id === packageId);
}

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'FREE',
    price: 0,
    interval: 'month',
    features: [
      '10 free coins on signup',
      'Unlimited events',
      'Unlimited guests',
      'Email invitations (1 coin per email)',
      'RSVP tracking',
      'Basic templates',
    ],
    limitations: [
      'No premium templates',
      'No custom branding',
      'Standard support',
    ],
  },
  PRO: {
    id: 'pro',
    name: 'PRO',
    price: 9.99,
    priceInCents: 999,
    interval: 'month',
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || '', // Set in env
    features: [
      'Everything in FREE',
      '✨ Unlimited email invitations',
      'All premium templates',
      'Custom branding',
      'Advanced analytics',
      'Priority support',
      'Remove BuzzInvitly branding',
      'Early access to features',
    ],
    popular: true,
  },
} as const;

export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS.FREE | typeof SUBSCRIPTION_PLANS.PRO;
