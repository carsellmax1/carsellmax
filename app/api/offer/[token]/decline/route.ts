import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const resolvedParams = await params;
    const { token } = resolvedParams;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Check if offer exists and is not already accepted/declined
    const { data: offer, error: fetchError } = await supabase
      .from('offers')
      .select('id, status, quote_submission_id')
      .eq('tracking_token', token)
      .single();

    if (fetchError || !offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }

    if (offer.status === 'accepted') {
      return NextResponse.json(
        { error: 'Offer has already been accepted' },
        { status: 400 }
      );
    }

    if (offer.status === 'declined') {
      return NextResponse.json(
        { error: 'Offer has already been declined' },
        { status: 400 }
      );
    }

    // Update offer status to declined
    const { error: updateError } = await supabase
      .from('offers')
      .update({
        status: 'declined',
        declined_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', offer.id);

    if (updateError) {
      console.error('Error updating offer status:', updateError);
      return NextResponse.json(
        { error: 'Failed to decline offer' },
        { status: 500 }
      );
    }

    // Update quote submission status to declined
    const { error: quoteUpdateError } = await supabase
      .from('quote_submissions')
      .update({
        status: 'declined',
        updated_at: new Date().toISOString()
      })
      .eq('id', offer.quote_submission_id);

    if (quoteUpdateError) {
      console.error('Error updating quote status:', quoteUpdateError);
      // Don't fail the request if we can't update the quote status
    }

    return NextResponse.json({ 
      data: { 
        message: 'Offer declined successfully',
        status: 'declined'
      } 
    });
  } catch (error) {
    console.error('Error in POST /api/offer/[id]/decline:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
