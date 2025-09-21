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
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Valuation ID is required' },
        { status: 400 }
      );
    }

    // Fetch valuation with related data
    const { data: valuation, error: valuationError } = await supabase
      .from('valuations')
      .select(`
        *,
        quote_submissions (
          id,
          status,
          customers (
            name,
            email,
            phone
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
        )
      `)
      .eq('id', id)
      .single();

    if (valuationError) {
      console.error('Error fetching valuation:', valuationError);
      return NextResponse.json(
        { error: 'Failed to fetch valuation' },
        { status: 500 }
      );
    }

    if (!valuation) {
      return NextResponse.json(
        { error: 'Valuation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: valuation });
  } catch (error) {
    console.error('Error in GET /api/admin/valuations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Valuation ID is required' },
        { status: 400 }
      );
    }

    // Check if valuation exists
    const { data: existingValuation, error: fetchError } = await supabase
      .from('valuations')
      .select('id, version, status, quote_submission_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingValuation) {
      return NextResponse.json(
        { error: 'Valuation not found' },
        { status: 404 }
      );
    }

    // If marking as final, just update the status for now
    if (body.status === 'final' && existingValuation.status !== 'final') {
      const { data: updatedValuation, error: updateError } = await supabase
        .from('valuations')
        .update({
          status: 'final',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating valuation status:', updateError);
        return NextResponse.json(
          { error: 'Failed to update valuation status' },
          { status: 500 }
        );
      }

      return NextResponse.json({ data: updatedValuation });
    } else {
      // Update existing valuation
      const { data: updatedValuation, error: updateError } = await supabase
        .from('valuations')
        .update({
          ...body,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating valuation:', updateError);
        return NextResponse.json(
          { error: 'Failed to update valuation' },
          { status: 500 }
        );
      }

      return NextResponse.json({ data: updatedValuation });
    }
  } catch (error) {
    console.error('Error in PUT /api/admin/valuations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
