import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'finance';
    const format = searchParams.get('format') || 'csv';
    const days = parseInt(searchParams.get('days') || '30');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (type === 'finance') {
      return await exportFinanceData(startDate, format);
    } else if (type === 'daily-summary') {
      return await exportDailySummary(startDate, format);
    } else {
      return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in export API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function exportFinanceData(startDate: Date, format: string) {
  const { data: offers, error } = await supabase
    .from('offers')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }

  // Fetch related data separately
  const submissionIds = offers?.map(o => o.quote_submission_id).filter(Boolean) || [];
  
  // Get quote submissions data
  const { data: submissions } = await supabase
    .from('quote_submissions')
    .select('id, estimated_value, customer_id, vehicle_id')
    .in('id', submissionIds);

  // Get customers data
  const { data: customers } = await supabase
    .from('customers')
    .select('id, name, email, phone')
    .in('id', submissions?.map(s => s.customer_id).filter(Boolean) || []);

  // Get vehicles data
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('id, make, model, year, vin, mileage')
    .in('id', submissions?.map(s => s.vehicle_id).filter(Boolean) || []);

  // Get valuations data
  const { data: valuations } = await supabase
    .from('valuations')
    .select('quote_submission_id, final_valuation, market_value')
    .in('quote_submission_id', submissionIds);

  // Create lookup maps
  const submissionsMap = new Map(submissions?.map(s => [s.id, s]) || []);
  const customersMap = new Map(customers?.map(c => [c.id, c]) || []);
  const vehiclesMap = new Map(vehicles?.map(v => [v.id, v]) || []);
  const valuationsMap = new Map(valuations?.map(v => [v.quote_submission_id, v]) || []);

  // Enrich offers with related data
  const enrichedOffers = offers?.map(offer => {
    const submission = submissionsMap.get(offer.quote_submission_id);
    const customer = submission ? customersMap.get(submission.customer_id) : null;
    const vehicle = submission ? vehiclesMap.get(submission.vehicle_id) : null;
    const valuation = valuationsMap.get(offer.quote_submission_id);

    return {
      ...offer,
      quote_submissions: submission ? {
        ...submission,
        customers: customer,
        vehicles: vehicle
      } : null,
      valuations: valuation ? [valuation] : []
    };
  }) || [];

  if (format === 'csv') {
    const csvData = enrichedOffers?.map(offer => ({
      'Offer ID': offer.id,
      'Customer Name': offer.quote_submissions?.customers?.name || '',
      'Customer Email': offer.quote_submissions?.customers?.email || '',
      'Customer Phone': offer.quote_submissions?.customers?.phone || '',
      'Vehicle': `${offer.quote_submissions?.vehicles?.year || ''} ${offer.quote_submissions?.vehicles?.make || ''} ${offer.quote_submissions?.vehicles?.model || ''}`,
      'VIN': offer.quote_submissions?.vehicles?.vin || '',
      'Mileage': offer.quote_submissions?.vehicles?.mileage || '',
      'Market Value': offer.valuations?.[0]?.market_value || offer.quote_submissions?.estimated_value || 0,
      'Final Valuation': offer.valuations?.[0]?.final_valuation || 0,
      'Offer Amount': offer.offer_amount || 0,
      'Discount': (offer.valuations?.[0]?.final_valuation || 0) - (offer.offer_amount || 0),
      'Discount %': offer.valuations?.[0]?.final_valuation ? 
        (((offer.valuations[0].final_valuation - (offer.offer_amount || 0)) / offer.valuations[0].final_valuation) * 100).toFixed(2) : 0,
      'Status': offer.status || '',
      'Created Date': offer.created_at ? new Date(offer.created_at).toLocaleDateString() : '',
      'Sent Date': offer.sent_at ? new Date(offer.sent_at).toLocaleDateString() : '',
      'Accepted Date': offer.accepted_at ? new Date(offer.accepted_at).toLocaleDateString() : '',
      'Declined Date': offer.declined_at ? new Date(offer.declined_at).toLocaleDateString() : '',
      'Expiry Date': offer.expiry_date ? new Date(offer.expiry_date).toLocaleDateString() : ''
    })) || [];

    const csv = convertToCSV(csvData);
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="finance-export-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  }

  return NextResponse.json({ data: enrichedOffers });
}

async function exportDailySummary(startDate: Date, format: string) {
  const endDate = new Date();
  
  // Get daily metrics
  const { data: submissions, error: submissionsError } = await supabase
    .from('quote_submissions')
    .select(`
      id,
      status,
      created_at,
      estimated_value,
      customers (name, email),
      vehicles (make, model, year)
    `)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  const { data: offers, error: offersError } = await supabase
    .from('offers')
    .select(`
      id,
      offer_amount,
      status,
      created_at,
      accepted_at,
      declined_at,
      quote_submissions (
        customers (name, email),
        vehicles (make, model, year)
      )
    `)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (submissionsError || offersError) {
    console.error('Error fetching data:', submissionsError || offersError);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }

  // Calculate daily metrics
  const totalSubmissions = submissions?.length || 0;
  const pendingReviews = submissions?.filter(s => s.status === 'pending_review').length || 0;
  const underReview = submissions?.filter(s => s.status === 'under_review').length || 0;
  const valuationReady = submissions?.filter(s => s.status === 'valuation_ready').length || 0;
  
  const totalOffers = offers?.length || 0;
  const acceptedOffers = offers?.filter(o => o.status === 'accepted').length || 0;
  const declinedOffers = offers?.filter(o => o.status === 'declined').length || 0;
  const pendingOffers = offers?.filter(o => ['draft', 'sent', 'viewed'].includes(o.status)).length || 0;
  
  const totalValue = submissions?.reduce((sum, s) => sum + (s.estimated_value || 0), 0) || 0;
  const totalOfferValue = offers?.reduce((sum, o) => sum + (o.offer_amount || 0), 0) || 0;
  const acceptedValue = offers?.filter(o => o.status === 'accepted').reduce((sum, o) => sum + (o.offer_amount || 0), 0) || 0;
  
  const acceptanceRate = totalOffers > 0 ? (acceptedOffers / totalOffers) * 100 : 0;
  const avgOfferValue = totalOffers > 0 ? totalOfferValue / totalOffers : 0;

  const summary = {
    date: endDate.toISOString().split('T')[0],
    period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
    submissions: {
      total: totalSubmissions,
      pendingReview: pendingReviews,
      underReview: underReview,
      valuationReady: valuationReady,
      totalValue: totalValue,
      avgValue: totalSubmissions > 0 ? totalValue / totalSubmissions : 0
    },
    offers: {
      total: totalOffers,
      accepted: acceptedOffers,
      declined: declinedOffers,
      pending: pendingOffers,
      totalValue: totalOfferValue,
      acceptedValue: acceptedValue,
      avgValue: avgOfferValue,
      acceptanceRate: acceptanceRate
    },
    topVehicles: getTopVehicles(submissions || []),
    recentActivity: getRecentActivity(submissions || [], offers || [])
  };

  if (format === 'csv') {
    const csvData = [
      {
        'Metric': 'Total Submissions',
        'Value': summary.submissions.total,
        'Date': summary.date
      },
      {
        'Metric': 'Pending Reviews',
        'Value': summary.submissions.pendingReview,
        'Date': summary.date
      },
      {
        'Metric': 'Total Offers',
        'Value': summary.offers.total,
        'Date': summary.date
      },
      {
        'Metric': 'Accepted Offers',
        'Value': summary.offers.accepted,
        'Date': summary.date
      },
      {
        'Metric': 'Acceptance Rate (%)',
        'Value': summary.offers.acceptanceRate.toFixed(2),
        'Date': summary.date
      },
      {
        'Metric': 'Total Value ($)',
        'Value': summary.submissions.totalValue,
        'Date': summary.date
      },
      {
        'Metric': 'Accepted Value ($)',
        'Value': summary.offers.acceptedValue,
        'Date': summary.date
      }
    ];

    const csv = convertToCSV(csvData);
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="daily-summary-${summary.date}.csv"`
      }
    });
  }

  return NextResponse.json({ data: summary });
}

function getTopVehicles(submissions: Record<string, unknown>[]) {
  const vehicleCounts: Record<string, number> = {};
  
  submissions.forEach(submission => {
    const vehicle = submission.vehicles as Record<string, unknown>;
    if (vehicle) {
      const key = `${(vehicle.year as number) || 'Unknown'} ${(vehicle.make as string) || 'Unknown'} ${(vehicle.model as string) || 'Unknown'}`;
      vehicleCounts[key] = (vehicleCounts[key] || 0) + 1;
    }
  });

  return Object.entries(vehicleCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([vehicle, count]) => ({ vehicle, count }));
}

function getRecentActivity(submissions: Record<string, unknown>[], offers: Record<string, unknown>[]) {
  const recentSubmissions = submissions
    .sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime())
    .slice(0, 5)
    .map(s => ({
      type: 'submission',
      id: s.id,
      customer: (s.customers as Record<string, unknown>)?.name || 'Unknown',
      vehicle: `${(s.vehicles as Record<string, unknown>)?.year || 'N/A'} ${(s.vehicles as Record<string, unknown>)?.make || 'Unknown'} ${(s.vehicles as Record<string, unknown>)?.model || 'Unknown'}`,
      status: s.status,
      date: s.created_at
    }));

  const recentOffers = offers
    .sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime())
    .slice(0, 5)
    .map(o => ({
      type: 'offer',
      id: o.id,
      customer: ((o.quote_submissions as Record<string, unknown>)?.customers as Record<string, unknown>)?.name || 'Unknown',
      vehicle: `${((o.quote_submissions as Record<string, unknown>)?.vehicles as Record<string, unknown>)?.year || 'N/A'} ${((o.quote_submissions as Record<string, unknown>)?.vehicles as Record<string, unknown>)?.make || 'Unknown'} ${((o.quote_submissions as Record<string, unknown>)?.vehicles as Record<string, unknown>)?.model || 'Unknown'}`,
      status: o.status,
      amount: o.offer_amount,
      date: o.created_at
    }));

  return [...recentSubmissions, ...recentOffers]
    .sort((a, b) => new Date(b.date as string).getTime() - new Date(a.date as string).getTime())
    .slice(0, 10);
}

function convertToCSV(data: Record<string, unknown>[]) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
}
