# Subscription Upgrade System - Complete ✅

## Overview
The Subscription Upgrade System allows users to upgrade from FREE to PRO tier for unlimited email invitations and premium features. Built with Stripe Subscriptions and integrated with the existing coin system.

## Features Implemented

### 1. Subscription Plans
- **FREE Plan**: Default tier, 1 coin per email, limited features
- **PRO Plan**: $9.99/month, unlimited emails, all premium features

### 2. Feature Gating
Created `/src/lib/features.ts` with functions to control access:
- `getFeatureAccess()` - Returns feature access based on subscription tier
- `canSendEmail()` - Checks if user can send emails
- `getEmailCost()` - Returns cost per email (0 for PRO, 1 for FREE)

### 3. Database Schema
Added subscription fields to User model in `prisma/schema.prisma`:
```prisma
stripeCustomerId       String?   @unique
stripeSubscriptionId   String?   @unique
stripePriceId          String?
stripeCurrentPeriodEnd DateTime?
```

### 4. Pages Created

#### `/subscription/upgrade`
- Plan comparison (FREE vs PRO)
- Feature lists with visual indicators
- Value proposition section
- Integration with SubscriptionUpgradeForm component

#### `/subscription/success`
- Success confirmation after upgrade
- Shows activated features
- Quick start guide
- Links to dashboard and manage subscription

#### `/subscription/manage`
- Current plan details
- Next billing date
- Access to Stripe Billing Portal
- Cancellation option

#### `/subscription/cancel`
- Cancellation flow with reason selection
- Shows what will be lost
- "Keep PRO" vs "Confirm Cancellation" buttons

#### `/subscription/canceled`
- Confirmation of cancellation
- Explains what happens next (keeps access until period end)
- Option to reactivate

### 5. Components Created

#### `SubscriptionUpgradeForm`
- Creates Stripe checkout session for subscription
- Handles loading states
- Redirects to Stripe Checkout

#### `BillingPortalButton`
- Opens Stripe-hosted billing portal
- Allows payment method updates
- Shows invoice history

#### `CancelSubscriptionForm`
- Radio buttons for cancellation reasons
- Validates reason selection
- Calls cancel API endpoint

### 6. API Endpoints

#### `POST /api/subscription/create-checkout`
- Creates Stripe subscription checkout session
- Sets up customer if not exists
- Configures success/cancel URLs
- Returns checkout URL

#### `POST /api/subscription/webhook`
Handles Stripe subscription events:
- `checkout.session.completed` - Activates PRO subscription
- `customer.subscription.updated` - Updates subscription status
- `customer.subscription.deleted` - Downgrades to FREE
- `invoice.payment_succeeded` - Extends billing period
- `invoice.payment_failed` - Handles failed payments

#### `POST /api/subscription/portal`
- Creates Stripe Billing Portal session
- Returns portal URL for customer management

#### `POST /api/subscription/cancel`
- Sets subscription to cancel at period end
- Stores cancellation reason in Stripe metadata
- User keeps access until period ends

### 7. Integration with Email System

Updated `/api/invitations/send/route.ts` to support PRO users:

```typescript
const costPerEmail = getEmailCost(event.host.subscription);
const emailCost = guestsToEmail.length * costPerEmail;

// Check if user has enough coins (PRO users have unlimited)
if (costPerEmail > 0 && event.host.coinBalance < emailCost) {
  return NextResponse.json({
    error: `Insufficient coins. You need ${emailCost} coins but only have ${event.host.coinBalance}. Upgrade to PRO for unlimited emails!`,
  }, { status: 402 });
}

// Deduct coins only for successful sends (PRO users don't pay)
if (successful > 0 && costPerEmail > 0) {
  await prisma.user.update({
    where: { id: event.host.id },
    data: { coinBalance: { decrement: successful * costPerEmail } },
  });
}
```

**Key Changes:**
- PRO users pay 0 coins per email (unlimited)
- FREE users pay 1 coin per email
- Coin deduction only happens for FREE users
- Error message suggests upgrading to PRO

## PRO Plan Features

### Included Features
✅ **Unlimited Email Invitations** - No coin cost
✅ **Premium Email Templates** - Beautiful designs
✅ **Custom Branding** - Add your logo and colors
✅ **Advanced Analytics** - Detailed insights
✅ **Priority Support** - Faster response times
✅ **Remove BuzzInvitly Branding** - White-label experience

### FREE Plan Limitations
❌ Pay 1 coin per email invitation
❌ Basic email templates only
❌ BuzzInvitly branding on emails
❌ Basic analytics
❌ Standard support

## Environment Variables

Add to `.env.local`:
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...  # Created in Stripe Dashboard

# Same as before
NEXTAUTH_URL=http://localhost:3000
```

## Stripe Dashboard Setup

### 1. Create Product
1. Go to Stripe Dashboard → Products
2. Create new product "BuzzInvitly PRO"
3. Set pricing: $9.99/month recurring
4. Copy the Price ID to `STRIPE_PRO_PRICE_ID`

### 2. Enable Billing Portal
1. Go to Settings → Billing → Customer portal
2. Enable customer portal
3. Configure allowed actions:
   - Update payment methods
   - View invoices
   - Cancel subscriptions (at period end)

### 3. Configure Webhooks
Add webhook endpoint: `https://yourdomain.com/api/subscription/webhook`

Required events:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## User Flow

### Upgrade Flow
1. User clicks "Upgrade to PRO" from dashboard/profile
2. Views `/subscription/upgrade` with plan comparison
3. Clicks "Upgrade to PRO" button
4. Redirected to Stripe Checkout
5. Enters payment details
6. Redirected to `/subscription/success`
7. Subscription activated via webhook
8. User now has unlimited emails

### Manage Flow
1. PRO user visits `/subscription/manage`
2. Sees current plan and next billing date
3. Clicks "Manage Billing" to open Stripe Portal
4. Can update payment method or cancel subscription
5. Returns to manage page

### Cancel Flow
1. User clicks "Cancel Subscription" from manage page
2. Views `/subscription/cancel` with impact warning
3. Selects cancellation reason (optional)
4. Clicks "Confirm Cancellation"
5. Redirected to `/subscription/canceled`
6. Subscription set to cancel at period end
7. User keeps PRO access until billing period ends
8. After period ends, webhook downgrades user to FREE

### Downgrade Behavior
When subscription ends/cancels:
- User tier changes from PRO → FREE
- Stripe subscription fields cleared
- User can still send emails but pays 1 coin each
- No data is lost
- Can re-subscribe anytime

## Testing

### Test Mode
Use Stripe test mode credit cards:
- Success: `4242 4242 4242 4242`
- Requires authentication: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 9995`

### Test Subscription Flow
1. Start as FREE user with some coins
2. Send invitation (costs 1 coin)
3. Upgrade to PRO via checkout
4. Send invitation (costs 0 coins)
5. Cancel subscription
6. Verify still PRO until period end
7. Simulate period end in Stripe Dashboard
8. Verify downgrade to FREE
9. Send invitation (costs 1 coin again)

### Webhook Testing
Use Stripe CLI for local testing:
```bash
stripe listen --forward-to localhost:3000/api/subscription/webhook
stripe trigger checkout.session.completed
stripe trigger customer.subscription.deleted
```

## Security Features

- ✅ Webhook signature verification
- ✅ User authentication required
- ✅ Stripe subscription ID validation
- ✅ Idempotent webhook processing
- ✅ Secure checkout sessions
- ✅ Customer portal authentication

## Files Created/Modified

### New Files
- `src/lib/features.ts` - Feature gating utilities
- `src/app/subscription/upgrade/page.tsx` - Upgrade page
- `src/app/subscription/success/page.tsx` - Success confirmation
- `src/app/subscription/manage/page.tsx` - Manage subscription
- `src/app/subscription/cancel/page.tsx` - Cancel flow
- `src/app/subscription/canceled/page.tsx` - Cancellation confirmation
- `src/components/subscription-upgrade-form.tsx` - Upgrade form
- `src/components/billing-portal-button.tsx` - Portal access
- `src/components/cancel-subscription-form.tsx` - Cancel form
- `src/app/api/subscription/create-checkout/route.ts` - Checkout API
- `src/app/api/subscription/webhook/route.ts` - Webhook handler
- `src/app/api/subscription/portal/route.ts` - Portal API
- `src/app/api/subscription/cancel/route.ts` - Cancel API

### Modified Files
- `prisma/schema.prisma` - Added subscription fields to User model
- `src/lib/stripe.ts` - Added SUBSCRIPTION_PLANS configuration
- `src/app/api/invitations/send/route.ts` - Integrated unlimited emails for PRO
- `src/components/subscription-management.tsx` - Updated to show PRO features

## Next Steps

### Production Deployment
1. Create production Stripe product and price
2. Update `STRIPE_PRO_PRICE_ID` with production price ID
3. Configure production webhook endpoint
4. Enable Stripe Billing Portal in production
5. Test full subscription lifecycle in production mode

### Future Enhancements
- Add annual billing option with discount
- Implement trial period (7-day free trial)
- Add usage-based pricing tier
- Send subscription confirmation emails
- Add subscription cancellation surveys
- Implement proration for mid-cycle changes
- Add team/organization plans
- Implement referral discounts

## Support

### Common Issues

**Issue: Webhook not working**
- Verify webhook secret is correct
- Check webhook URL is accessible
- Ensure HTTPS in production
- Check Stripe webhook logs

**Issue: Subscription not activating**
- Check webhook events are enabled
- Verify price ID matches Stripe Dashboard
- Check database connection
- Review API logs

**Issue: User still charged after cancellation**
- Verify `cancel_at_period_end: true` is set
- Check subscription status in Stripe Dashboard
- Ensure webhook processed subscription.deleted event

## Status: ✅ Complete

All subscription upgrade features are implemented and ready for testing!
