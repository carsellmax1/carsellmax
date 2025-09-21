import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const quote_submission_id = searchParams.get('quote_submission_id');

    const offset = (page - 1) * limit;

    let query = supabase
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
          )
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (quote_submission_id) {
      query = query.eq('quote_submission_id', quote_submission_id);
    }

    const { data: offers, error } = await query;

    if (error) {
      console.error('Error fetching offers:', error);
      return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
    }

    // Filter by search term if provided
    let filteredOffers = offers || [];
    if (search) {
      filteredOffers = offers?.filter(offer => {
        const customerName = offer.quote_submissions?.customers?.name || '';
        const customerEmail = offer.quote_submissions?.customers?.email || '';
        const vehicleMake = offer.quote_submissions?.vehicles?.make || '';
        const vehicleModel = offer.quote_submissions?.vehicles?.model || '';
        
        return customerName.toLowerCase().includes(search.toLowerCase()) ||
               customerEmail.toLowerCase().includes(search.toLowerCase()) ||
               vehicleMake.toLowerCase().includes(search.toLowerCase()) ||
               vehicleModel.toLowerCase().includes(search.toLowerCase());
      }) || [];
    }

    return NextResponse.json({ 
      data: filteredOffers,
      pagination: {
        page,
        limit,
        total: filteredOffers.length
      }
    });
  } catch (error) {
    console.error('Error in GET /api/admin/offers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      quote_submission_id,
      offer_amount,
      expiry_days = 7,
      terms_conditions,
      inspection_required = true,
      payment_method = 'bank_transfer',
      notes,
      status = 'draft'
    } = body;

    if (!quote_submission_id || !offer_amount) {
      return NextResponse.json(
        { error: 'Quote submission ID and offer amount are required' },
        { status: 400 }
      );
    }

    // Check if offer already exists for this quote
    const { data: existingOffer } = await supabase
      .from('offers')
      .select('id')
      .eq('quote_submission_id', quote_submission_id)
      .single();

    if (existingOffer) {
      return NextResponse.json(
        { error: 'Offer already exists for this quote submission' },
        { status: 409 }
      );
    }

    // Generate tracking token
    const trackingToken = Buffer.from(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiry_days);

    const offerData = {
      quote_submission_id,
      offer_amount: parseFloat(offer_amount),
      expiry_date: expiryDate.toISOString(),
      terms_conditions: terms_conditions || 'Standard terms and conditions apply. Vehicle must pass inspection. Payment will be processed within 2-3 business days after acceptance.',
      inspection_required,
      payment_method,
      status,
      tracking_token: trackingToken,
      notes: notes || '',
      created_by: '34734e2b-b12d-414b-9b1f-373c2986076f' // Admin user
    };

    const { data: offer, error } = await supabase
      .from('offers')
      .insert([offerData])
      .select()
      .single();

    if (error) {
      console.error('Error creating offer:', error);
      return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
    }

    return NextResponse.json({ data: offer });
  } catch (error) {
    console.error('Error in POST /api/admin/offers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}