import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status transition
    const validStatuses = ['pending_review', 'under_review', 'valuation_ready', 'quote_sent', 'accepted', 'declined', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get current quote status
    const { data: currentQuote, error: fetchError } = await supabase
      .from('quote_submissions')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !currentQuote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Check if status transition is valid
    const validTransitions: { [key: string]: string[] } = {
      'pending_review': ['under_review', 'declined', 'withdrawn'],
      'under_review': ['valuation_ready', 'declined', 'withdrawn'],
      'valuation_ready': ['quote_sent', 'under_review'],
      'quote_sent': ['accepted', 'declined', 'withdrawn'],
      'accepted': [],
      'declined': [],
      'withdrawn': []
    };

    if (!validTransitions[currentQuote.status]?.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${currentQuote.status} to ${status}` },
        { status: 400 }
      );
    }

    // Update quote status
    const { data: updatedQuote, error: updateError } = await supabase
      .from('quote_submissions')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating quote status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update quote status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: updatedQuote });
  } catch (error) {
    console.error('Error in PUT /api/admin/quotes/[id]/status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
