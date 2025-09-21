import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';

    let query = supabase
      .from('valuations')
      .select(`
        *,
        quote_submissions!inner(
          customer_id,
          vehicle_id,
          customers(name, email),
          vehicles(make, model, year, mileage, condition)
        )
      `)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching valuations:', error);
      return NextResponse.json({ error: 'Failed to fetch valuations' }, { status: 500 });
    }

    // Transform the data to flatten the nested structure
    const transformedData = data?.map(valuation => ({
      ...valuation,
      quote_submission: {
        customer_name: valuation.quote_submissions?.customers?.name,
        customer_email: valuation.quote_submissions?.customers?.email,
        vehicle_make: valuation.quote_submissions?.vehicles?.make,
        vehicle_model: valuation.quote_submissions?.vehicles?.model,
        vehicle_year: valuation.quote_submissions?.vehicles?.year,
        vehicle_mileage: valuation.quote_submissions?.vehicles?.mileage,
        vehicle_condition: valuation.quote_submissions?.vehicles?.condition,
      }
    })) || [];

    return NextResponse.json({ data: transformedData, count: transformedData.length });
  } catch (error) {
    console.error('Error in valuations API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    const { quote_submission_id } = body;

    if (!quote_submission_id) {
      return NextResponse.json(
        { error: 'Quote submission ID is required' },
        { status: 400 }
      );
    }

    // Fetch the quote submission with vehicle and customer data
    const { data: submission, error: submissionError } = await supabase
      .from('quote_submissions')
      .select(`
        id,
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
      `)
      .eq('id', quote_submission_id)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json(
        { error: 'Quote submission not found' },
        { status: 404 }
      );
    }

    // Check if a valuation already exists for this submission
    const { data: existingValuation } = await supabase
      .from('valuations')
      .select('id')
      .eq('quote_submission_id', quote_submission_id)
      .single();

    if (existingValuation) {
      return NextResponse.json(
        { error: 'Valuation already exists for this submission' },
        { status: 409 }
      );
    }

    // Create initial valuation with default values
    const initialValuation = {
      quote_submission_id,
      version: 1,
      status: 'draft',
      vehicle_year: (submission.vehicles as unknown as Record<string, unknown>)?.year || 0,
      vehicle_make: (submission.vehicles as unknown as Record<string, unknown>)?.make || '',
      vehicle_model: (submission.vehicles as unknown as Record<string, unknown>)?.model || '',
      vehicle_vin: (submission.vehicles as unknown as Record<string, unknown>)?.vin || null,
      vehicle_mileage: (submission.vehicles as unknown as Record<string, unknown>)?.mileage || 0,
      vehicle_color: (submission.vehicles as unknown as Record<string, unknown>)?.color || null,
      vehicle_condition: (submission.vehicles as unknown as Record<string, unknown>)?.condition || 'good',
      base_value: 0,
      condition_adjustment: 0,
      mileage_adjustment: 0,
      options_adjustment: 0,
      market_adjustment: 0,
      total_adjustments: 0,
      adjusted_value: 0,
      inspection_fee: 150,
      processing_fee: 200,
      total_fees: 350,
      net_offer_min: 0,
      net_offer_max: 0,
      recommended_offer: 0,
      justification_rationale: '',
      calculation_notes: '',
      market_analysis: '',
      condition_assessment: '',
      risk_factors: '',
      market_data: {},
      comparable_sales: [],
      market_trends: {},
      created_by: '34734e2b-b12d-414b-9b1f-373c2986076f' // Admin user
    };

    const { data, error } = await supabase
      .from('valuations')
      .insert([initialValuation])
      .select()
      .single();

    if (error) {
      console.error('Error creating valuation:', error);
      return NextResponse.json({ error: 'Failed to create valuation' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in valuations POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
