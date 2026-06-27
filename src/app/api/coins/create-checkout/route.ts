import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { stripe, getCoinPackage } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { packageId } = await req.json();

    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }

    // Get coin package details
    const coinPackage = getCoinPackage(packageId);

    if (!coinPackage) {
      return NextResponse.json(
        { error: 'Invalid package ID' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${coinPackage.coins} BuzzInvitly Coins`,
              description: `Purchase ${coinPackage.coins} coins to send email invitations`,
              images: [], // Add your logo URL here if desired
            },
            unit_amount: coinPackage.priceInCents,
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        packageId: coinPackage.id,
        coins: coinPackage.coins.toString(),
        price: coinPackage.price.toString(),
      },
      success_url: `${process.env.NEXTAUTH_URL}/coins/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/coins/purchase?canceled=true`,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
    });
  } catch (error: any) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
