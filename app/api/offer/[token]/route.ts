import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
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

    // Fetch offer by tracking token
    const { data: offer, error } = await supabase
      .from('offers')
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
          ),
          valuations (
            base_value,
            recommended_offer
          )
        )
      `)
      .eq('tracking_token', token)
      .single();

    if (error || !offer) {
      return NextResponse.json(
        { error: 'Offer not found or invalid token' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: offer });
  } catch (error) {
    console.error('Error in GET /api/offer/[token]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
