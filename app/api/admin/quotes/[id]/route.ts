import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const { data, error } = await supabase
      .from('quote_submissions')
      .select(`
        *,
        customers (
          name,
          email,
          phone,
          address
        ),
        vehicles (
          make,
          model,
          year,
          vin,
          mileage,
          color,
          condition
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching quote submission:', error);
      return NextResponse.json({ error: 'Quote submission not found' }, { status: 404 });
    }

    // Fetch valuations separately
    const { data: valuations, error: valuationsError } = await supabase
      .from('valuations')
      .select('final_valuation, market_value, status')
      .eq('quote_submission_id', id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!valuationsError && valuations && valuations.length > 0) {
      data.valuations = valuations[0];
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in quote submission GET API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const { data, error } = await supabase
      .from('quote_submissions')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating quote submission:', error);
      return NextResponse.json({ error: 'Failed to update quote submission' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in quote submission PUT API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { error } = await supabase
      .from('quote_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting quote submission:', error);
      return NextResponse.json({ error: 'Failed to delete quote submission' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Quote submission deleted successfully' });
  } catch (error) {
    console.error('Error in quote submission DELETE API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
