import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendReceiptEmail } from '@/lib/email-receipt';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleExpiredSession(session);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const coins = parseInt(session.metadata?.coins || '0');
  const price = parseFloat(session.metadata?.price || '0');

  if (!userId || !coins) {
    console.error('Missing metadata in session:', session.id);
    return;
  }

  // Create purchase record
  const purchase = await prisma.purchase.create({
    data: {
      userId,
      stripePaymentId: session.payment_intent as string,
      amount: price,
      coins,
      status: 'COMPLETED',
      receiptUrl: (session as any).receipt_url || null,
    },
  });

  // Update user's coin balance
  await prisma.user.update({
    where: { id: userId },
    data: {
      coinBalance: {
        increment: coins,
      },
    },
  });

  // Get user details for receipt email
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, coinBalance: true },
  });

  if (user) {
    // Send receipt email
    await sendReceiptEmail({
      to: user.email,
      userName: user.name || 'User',
      coins,
      amount: price,
      transactionId: purchase.id,
      newBalance: user.coinBalance,
    }).catch(err => console.error('Failed to send receipt email:', err));
  }

  console.log(`Successfully processed payment for user ${userId}: +${coins} coins`);
}

async function handleExpiredSession(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (!userId) {
    return;
  }

  console.log(`Checkout session expired for user ${userId}`);
  // Optionally track abandoned checkouts
}

async function handleRefund(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent as string;

  if (!paymentIntentId) {
    return;
  }

  // Find the purchase by payment intent
  const purchase = await prisma.purchase.findUnique({
    where: { stripePaymentId: paymentIntentId },
    include: { user: true },
  });

  if (!purchase) {
    console.error('Purchase not found for refund:', paymentIntentId);
    return;
  }

  // Update purchase status
  await prisma.purchase.update({
    where: { id: purchase.id },
    data: { status: 'REFUNDED' },
  });

  // Deduct coins from user balance
  await prisma.user.update({
    where: { id: purchase.userId },
    data: {
      coinBalance: {
        decrement: purchase.coins,
      },
    },
  });

  console.log(`Processed refund for purchase ${purchase.id}: -${purchase.coins} coins`);
}
