import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { reason } = await request.json().catch(() => ({}));

    if (!id) {
      return NextResponse.json(
        { error: 'Offer ID is required' },
        { status: 400 }
      );
    }

    // First, get the offer to check if it can be deleted
    const { data: offer, error: fetchError } = await supabase
      .from('offers')
      .select('id, status, quote_submission_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching offer:', fetchError);
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }

    // Check if offer can be deleted (only draft offers can be deleted)
    if (offer.status !== 'draft') {
      return NextResponse.json(
        { 
          error: 'Only draft offers can be deleted. Please archive or cancel sent offers instead.',
          currentStatus: offer.status
        },
        { status: 400 }
      );
    }

    // Delete the offer
    const { error: deleteError } = await supabase
      .from('offers')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting offer:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete offer' },
        { status: 500 }
      );
    }

    // Log the deletion in audit logs
    if (reason) {
      await supabase
        .from('audit_logs')
        .insert({
          table_name: 'offers',
          record_id: id,
          action: 'delete',
          old_values: { status: offer.status },
          new_values: null,
          admin_user: 'admin@carsellmax.com', // In real app, get from auth
          notes: `Offer deleted. Reason: ${reason}`
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Offer deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
