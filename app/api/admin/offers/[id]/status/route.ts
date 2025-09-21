import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, reason } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Offer ID is required' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Valid status values
    const validStatuses = [
      'draft',
      'sent',
      'viewed',
      'accepted',
      'declined',
      'expired',
      'archived',
      'cancelled',
      'completed'
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update the offer status
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString()
    };

    // Add reason to notes field if provided
    if (reason) {
      updateData.notes = reason;
    }

    const { data: offer, error: updateError } = await supabase
      .from('offers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating offer status:', updateError);
      console.error('Update data:', updateData);
      console.error('Offer ID:', id);
      return NextResponse.json(
        { error: `Failed to update offer status: ${updateError.message}` },
        { status: 500 }
      );
    }

    // If status is completed, also update the quote submission status
    if (status === 'completed') {
      const { error: quoteError } = await supabase
        .from('quote_submissions')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', offer.quote_submission_id);

      if (quoteError) {
        console.error('Error updating quote submission status:', quoteError);
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({
      success: true,
      message: `Offer status updated to ${status}`,
      offer
    });

  } catch (error) {
    console.error('Error updating offer status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
