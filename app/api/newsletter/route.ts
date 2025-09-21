import { NextRequest, NextResponse } from 'next/server';

interface NewsletterSubscription {
  email: string;
  firstName?: string;
  lastName?: string;
  preferences?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const subscriptionData: NewsletterSubscription = await request.json();
    
    // Validate required fields
    if (!subscriptionData.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subscriptionData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // For now, just log the subscription
    // In the future, this will integrate with email marketing services and database
    console.log('Newsletter subscription:', {
      timestamp: new Date().toISOString(),
      subscriptionId: `newsletter-${Date.now()}`,
      ...subscriptionData,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to our newsletter! You will receive updates about car selling tips, market trends, and exclusive offers.',
      subscriptionId: `newsletter-${Date.now()}`
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter. Please try again.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required for unsubscription' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // For now, just log the unsubscription
    console.log('Newsletter unsubscription:', {
      timestamp: new Date().toISOString(),
      email,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter. We\'re sorry to see you go!'
    });

  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter. Please try again.' },
      { status: 500 }
    );
  }
}



