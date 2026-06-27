# BuzzInvitly - Complete Testing Guide

## Quick Start Testing

This guide will walk you through testing all four features in sequence to verify everything works together.

---

## Prerequisites

### 1. Environment Setup
Ensure `.env.local` has all required variables:
```bash
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Resend Email
RESEND_API_KEY="re_Ci4njdZP_37YLXEXnkRHneQXEiNnKw4rL"

# Stripe (use test keys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_..."
```

### 2. Database
```bash
# Apply migrations
npx prisma db push

# Seed test data (if you have seeds)
npx prisma db seed
```

### 3. Development Server
```bash
npm run dev
# or
pnpm dev
```

### 4. Stripe Webhook (Local Testing)
```bash
# In a separate terminal
stripe listen --forward-to localhost:3000/api/coins/webhook
stripe listen --forward-to localhost:3000/api/subscription/webhook
```

---

## Test Flow 1: FREE User Journey

### Step 1: Create Account & Login
1. Navigate to `http://localhost:3000`
2. Sign up for a new account
3. Verify you start as FREE tier

**Expected:**
- New user created
- `subscription = 'FREE'`
- `coinBalance = 0` (or default amount)

---

### Step 2: View Profile
1. Go to `/profile`
2. Check all sections load

**Expected:**
- Account Stats show 0s for new user
- Coin Management shows 0 balance
- Subscription shows FREE tier
- Notification Preferences toggles work

---

### Step 3: Purchase Coins
1. From profile, click "Purchase Coins"
2. Or navigate to `/coins/purchase`
3. Select "Popular" package (50 coins for $3.99)
4. Click "Purchase 50 Coins"

**Expected:**
- Redirected to Stripe Checkout
- Test card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)

5. Complete payment
6. Redirected to `/coins/success`

**Expected:**
- Success message shown
- Webhook processed payment
- User balance updated to 50 coins
- Receipt email sent to user
- Purchase record created in database

**Verify in Database:**
```sql
SELECT * FROM "Purchase" WHERE "userId" = '<your-user-id>';
SELECT "coinBalance" FROM "User" WHERE id = '<your-user-id>';
```

---

### Step 4: Create Event
1. Go to `/dashboard`
2. Click "Create Event"
3. Fill in event details:
   - Title: "Test Event"
   - Date: Tomorrow
   - Location: "123 Test St"
4. Submit form

**Expected:**
- Event created successfully
- Redirected to event details page

---

### Step 5: Add Guests
1. On event details page
2. Add guest form:
   - Name: "Test Guest 1"
   - Email: "test1@example.com"
3. Add another:
   - Name: "Test Guest 2"
   - Email: "test2@example.com"
4. Submit

**Expected:**
- 2 guests added to event
- Both show `rsvpStatus = 'PENDING'`

---

### Step 6: Send Invitations (as FREE user)
1. On event details page
2. Click "Send Invitations" tab
3. Select both guests
4. Review coin cost (should show 2 coins)
5. Click "Send Invitations"

**Expected:**
- Success message: "Successfully sent 2 invitations"
- Coin balance decreased: 50 → 48 coins
- Response shows:
  ```json
  {
    "success": true,
    "sent": 2,
    "failed": 0,
    "coinsUsed": 2,
    "remainingCoins": 48,
    "isPro": false
  }
  ```
- Emails sent to both guests
- `invitedAt` timestamp updated for both guests
- Event status changed to "SENT"

**Verify Emails:**
- Check inbox for test1@example.com and test2@example.com
- Should contain invitation with RSVP link
- RSVP link format: `http://localhost:3000/rsvp/{token}`

---

## Test Flow 2: Upgrade to PRO

### Step 7: Upgrade to PRO
1. Go to `/subscription/upgrade`
2. Review plan comparison
3. Click "Upgrade to PRO"

**Expected:**
- Redirected to Stripe Checkout
- Shows "$9.99/month" recurring payment
- Test card: `4242 4242 4242 4242`

4. Complete payment
5. Redirected to `/subscription/success`

**Expected:**
- Success message shown
- PRO features listed
- Webhook processed subscription
- User upgraded to PRO tier

**Verify in Database:**
```sql
SELECT
  subscription,
  "stripeCustomerId",
  "stripeSubscriptionId",
  "stripeCurrentPeriodEnd"
FROM "User"
WHERE id = '<your-user-id>';
```

Should show:
- `subscription = 'PRO'`
- `stripeCustomerId` populated
- `stripeSubscriptionId` populated
- `stripeCurrentPeriodEnd` set to ~30 days from now

---

### Step 8: Send Unlimited Emails (as PRO user)
1. Create another event or add more guests
2. Send invitations to 5+ guests
3. Check coin balance before and after

**Expected:**
- No coins deducted (PRO users pay 0 coins)
- Response shows:
  ```json
  {
    "success": true,
    "sent": 5,
    "failed": 0,
    "coinsUsed": 0,
    "remainingCoins": 48,  // unchanged
    "isPro": true
  }
  ```
- All emails sent successfully
- Coin balance remains at 48

---

### Step 9: Manage Subscription
1. Go to `/profile`
2. Subscription section shows "PRO" tier
3. Click "Manage Subscription"
4. On `/subscription/manage`, click "Manage Billing"

**Expected:**
- Redirected to Stripe Billing Portal
- Can see:
  - Current subscription
  - Next billing date
  - Payment method
  - Invoice history
- Can update payment method

---

### Step 10: Cancel Subscription
1. From `/subscription/manage`, click "Cancel Subscription"
2. On `/subscription/cancel`, select reason: "Too expensive"
3. Click "Confirm Cancellation"

**Expected:**
- Redirected to `/subscription/canceled`
- Confirmation message shown
- In Stripe Dashboard, subscription shows `cancel_at_period_end: true`
- User still has PRO access until period end

**Verify:**
- User `subscription` still shows 'PRO'
- Can still send unlimited emails
- Billing portal shows "Cancels on [date]"

---

### Step 11: Simulate Period End (Stripe Dashboard)
1. Go to Stripe Dashboard
2. Find the subscription
3. Click "..." → "Cancel immediately" (to simulate period end)

**Expected:**
- Webhook `customer.subscription.deleted` triggered
- User downgraded to FREE tier
- Subscription fields cleared

**Verify in Database:**
```sql
SELECT
  subscription,
  "stripeSubscriptionId",
  "stripePriceId",
  "stripeCurrentPeriodEnd"
FROM "User"
WHERE id = '<your-user-id>';
```

Should show:
- `subscription = 'FREE'`
- `stripeSubscriptionId = null`
- `stripePriceId = null`
- `stripeCurrentPeriodEnd = null`

---

### Step 12: Send Emails After Downgrade
1. Try sending invitations again
2. Should cost 1 coin per email again

**Expected:**
- Coin deduction resumes
- Response shows `isPro: false`
- Coins deducted from balance

---

## Edge Case Testing

### Test: Insufficient Coins (FREE user)
1. Ensure user has < 5 coins
2. Try to send 5 invitations

**Expected:**
- Error response with 402 status code
- Message: "Insufficient coins. You need 5 coins but only have X. Upgrade to PRO for unlimited emails!"
- No emails sent
- No coins deducted

---

### Test: Send to Already Invited Guests
1. Send invitations to guests
2. Try sending again to same guests

**Expected:**
- Emails sent again (duplicate invitations allowed)
- Coins deducted again (for FREE users)
- `invitedAt` timestamp updated to new time

---

### Test: Payment Failure (Coin Purchase)
1. Try to purchase coins
2. Use test card: `4000 0000 0000 9995` (always declined)

**Expected:**
- Stripe Checkout shows error
- No purchase record created
- No coins added
- No receipt email sent

---

### Test: Subscription Payment Failure
1. Subscribe to PRO
2. In Stripe Dashboard, trigger failed payment

**Expected:**
- Webhook `invoice.payment_failed` received
- User gets email from Stripe about failed payment
- Subscription enters "past_due" status
- After retry period, subscription canceled

---

### Test: Refund (Coin Purchase)
1. Purchase coins successfully
2. In Stripe Dashboard, refund the payment

**Expected:**
- Webhook `charge.refunded` received
- Purchase status updated to 'REFUNDED'
- Coins deducted from user balance
- If balance goes negative, handled gracefully

---

### Test: Cancel Subscription then Reactivate
1. Cancel subscription (cancel_at_period_end)
2. Before period ends, go to Billing Portal
3. Click "Resume subscription"

**Expected:**
- Subscription `cancel_at_period_end` set to false
- User keeps PRO access
- Next billing date unchanged

---

## Automated Testing

### API Endpoint Tests

Create test file: `__tests__/api/invitations.test.ts`

```typescript
import { POST } from '@/app/api/invitations/send/route'

describe('Send Invitations API', () => {
  it('should deduct coins for FREE users', async () => {
    // Test FREE user sending invitations
  })

  it('should not deduct coins for PRO users', async () => {
    // Test PRO user sending invitations
  })

  it('should return 402 for insufficient coins', async () => {
    // Test insufficient coins error
  })
})
```

### Webhook Tests

Create test file: `__tests__/webhooks/subscription.test.ts`

```typescript
describe('Subscription Webhook', () => {
  it('should activate PRO on checkout.session.completed', async () => {
    // Test subscription activation
  })

  it('should downgrade to FREE on subscription.deleted', async () => {
    // Test downgrade
  })
})
```

---

## Monitoring Checklist

### During Testing, Monitor:

- [ ] Browser console for errors
- [ ] Network tab for failed API calls
- [ ] Terminal logs for server errors
- [ ] Stripe Dashboard webhook logs
- [ ] Email inbox for deliveries
- [ ] Database for data consistency

### Stripe Dashboard Checks:

- [ ] Payments appear in Payments tab
- [ ] Subscriptions appear in Subscriptions tab
- [ ] Customers created in Customers tab
- [ ] Webhooks delivered successfully
- [ ] No failed webhook events

### Database Checks:

```sql
-- Check user balances
SELECT email, subscription, "coinBalance" FROM "User";

-- Check purchases
SELECT * FROM "Purchase" ORDER BY "createdAt" DESC LIMIT 10;

-- Check events and guests
SELECT e.title, COUNT(g.id) as guest_count
FROM "Event" e
LEFT JOIN "Guest" g ON e.id = g."eventId"
GROUP BY e.id, e.title;

-- Check invitations sent
SELECT COUNT(*) FROM "Guest" WHERE "invitedAt" IS NOT NULL;
```

---

## Performance Testing

### Load Test: Bulk Email Sending
1. Create event with 100 guests
2. Send invitations to all
3. Monitor:
   - API response time
   - Email delivery success rate
   - Webhook processing time
   - Database query performance

### Expected Performance:
- API response: < 5 seconds for 100 emails
- Email delivery: 95%+ success rate
- Webhook processing: < 1 second
- No database locks or timeouts

---

## Security Testing

### Test: Authorization
- [ ] Try accessing `/api/subscription/cancel` without auth
- [ ] Try sending invitations for someone else's event
- [ ] Try canceling someone else's subscription

All should return 401/403 errors.

### Test: Webhook Signature Verification
- [ ] Send webhook without signature → Should reject
- [ ] Send webhook with invalid signature → Should reject
- [ ] Send valid webhook → Should process

### Test: SQL Injection
- [ ] Try SQL injection in event title
- [ ] Try SQL injection in guest email
- [ ] Try SQL injection in user name

Prisma ORM should prevent all SQL injection.

---

## Success Criteria

All features are working if:

✅ **Email Invitations**
- FREE users pay 1 coin per email
- PRO users pay 0 coins per email
- Emails delivered successfully
- Invitations tracked correctly

✅ **Profile & Settings**
- Statistics display correctly
- Preferences save successfully
- Subscription tier shown accurately

✅ **Coin Purchase**
- Stripe checkout completes
- Coins added to balance
- Receipt email sent
- Purchase history shown

✅ **Subscription Upgrade**
- Upgrade to PRO works
- Unlimited emails enabled
- Billing portal accessible
- Cancellation works correctly
- Downgrade to FREE works

---

## Troubleshooting

### Issue: Emails Not Sending
**Check:**
- Resend API key is correct
- Sender email is `onboarding@resend.dev`
- Network connection to Resend API
- User has sufficient coins (FREE) or is PRO

### Issue: Webhook Not Processing
**Check:**
- Webhook secret is correct
- Webhook URL is accessible
- Stripe CLI is forwarding correctly
- Check Stripe Dashboard webhook logs

### Issue: Coins Not Added After Purchase
**Check:**
- Webhook was delivered
- Webhook signature verified
- Check database for Purchase record
- Check user coinBalance field

### Issue: Subscription Not Activating
**Check:**
- Webhook delivered successfully
- Stripe price ID matches environment variable
- Database fields updated correctly
- Check Stripe Dashboard subscription status

---

## Next Steps After Testing

Once all tests pass:

1. **Code Review**
   - Review all API endpoints
   - Check error handling
   - Verify security measures

2. **Performance Optimization**
   - Add database indexes
   - Implement caching
   - Optimize bulk email sending

3. **Production Preparation**
   - Switch to production Stripe keys
   - Verify custom domain with Resend
   - Set up monitoring and alerts
   - Deploy to production environment

4. **Documentation**
   - Write user guides
   - Create API documentation
   - Document deployment process

---

## Test Results Template

Use this to track your testing:

```
Date: ___________
Tester: ___________

✅/❌ Email Invitations (FREE)
✅/❌ Email Invitations (PRO)
✅/❌ Coin Purchase
✅/❌ Subscription Upgrade
✅/❌ Subscription Management
✅/❌ Subscription Cancellation
✅/❌ Profile & Settings
✅/❌ Webhook Processing
✅/❌ Error Handling
✅/❌ Security Tests

Notes:
_____________________________________
_____________________________________
```

Happy Testing! 🚀
