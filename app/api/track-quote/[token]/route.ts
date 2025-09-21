import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const resolvedParams = await params;
    const { token } = resolvedParams;

    if (!token) {
      return NextResponse.json(
        { error: 'Tracking token is required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch quote submission with related data
    const { data: quote, error: quoteError } = await supabase
      .from('quote_submissions')
      .select(`
        id,
        public_token,
        status,
        estimated_value,
        additional_notes,
        created_at,
        updated_at,
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
        ),
        valuations (
          base_value,
          recommended_offer
        ),
        offers (
          offer_amount,
          valid_until,
          terms_conditions
        ),
        media_assets (
          category,
          file_name,
          file_path
        )
      `)
      .eq('public_token', token)
      .single();

    if (quoteError) {
      console.error('Quote fetch error:', quoteError);
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Transform the data to match the expected format
    const transformedQuote = {
      id: quote.id,
      public_token: quote.public_token,
      status: quote.status,
      estimated_value: quote.estimated_value,
      created_at: quote.created_at,
      updated_at: quote.updated_at,
      customer: {
        name: (quote.customers as unknown as Record<string, unknown>)?.name || '',
        email: (quote.customers as unknown as Record<string, unknown>)?.email || '',
        phone: (quote.customers as unknown as Record<string, unknown>)?.phone || '',
        address: (quote.customers as unknown as Record<string, unknown>)?.address || {
          street: '',
          city: '',
          state: '',
          zip: ''
        }
      },
      vehicle: {
        make: (quote.vehicles as unknown as Record<string, unknown>)?.make || '',
        model: (quote.vehicles as unknown as Record<string, unknown>)?.model || '',
        year: (quote.vehicles as unknown as Record<string, unknown>)?.year || 0,
        mileage: (quote.vehicles as unknown as Record<string, unknown>)?.mileage || 0,
        color: (quote.vehicles as unknown as Record<string, unknown>)?.color || '',
        condition: (quote.vehicles as unknown as Record<string, unknown>)?.condition || '',
        additional_notes: quote.additional_notes
      },
      photos: quote.media_assets?.map((asset: Record<string, unknown>) => ({
        category: asset.category,
        filename: asset.file_name,
        url: asset.file_path
      })) || [],
      valuation: quote.valuations ? {
        market_value: (quote.valuations as unknown as Record<string, unknown>).base_value,
        final_valuation: (quote.valuations as unknown as Record<string, unknown>).recommended_offer
      } : undefined,
      offer: quote.offers ? {
        offer_amount: (quote.offers as unknown as Record<string, unknown>).offer_amount,
        valid_until: (quote.offers as unknown as Record<string, unknown>).valid_until,
        terms_conditions: (quote.offers as unknown as Record<string, unknown>).terms_conditions
      } : undefined
    };

    return NextResponse.json(transformedQuote);

  } catch (error) {
    console.error('Track quote error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote details' },
      { status: 500 }
    );
  }
}
