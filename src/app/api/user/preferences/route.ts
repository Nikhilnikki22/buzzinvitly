import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For now, return default preferences
    // In the future, you can store these in the database
    const preferences = {
      emailOnRSVP: true,
      emailOnEventReminder: true,
      emailOnNewGuest: true,
      marketingEmails: false,
    };

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Preferences fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const preferences = await req.json();

    // Validate preferences
    const validKeys = ['emailOnRSVP', 'emailOnEventReminder', 'emailOnNewGuest', 'marketingEmails'];
    const isValid = Object.keys(preferences).every(key => validKeys.includes(key));

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid preferences' },
        { status: 400 }
      );
    }

    // In the future, store these in the database
    // For now, just return success
    console.log('User preferences updated:', preferences);

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences,
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
