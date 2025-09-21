import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '90');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all submissions with related data
    const { data: submissions, error: submissionsError } = await supabase
      .from('quote_submissions')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }

    // Fetch related data separately
    const submissionIds = submissions?.map(s => s.id) || [];
    
    // Get customers data
    const { data: customers } = await supabase
      .from('customers')
      .select('id, name, email, address')
      .in('id', submissions?.map(s => s.customer_id).filter(Boolean) || []);

    // Get vehicles data
    const { data: vehicles } = await supabase
      .from('vehicles')
      .select('id, make, model, year, condition')
      .in('id', submissions?.map(s => s.vehicle_id).filter(Boolean) || []);

    // Get valuations data
    const { data: valuations } = await supabase
      .from('valuations')
      .select('quote_submission_id, final_valuation, market_value, status')
      .in('quote_submission_id', submissionIds);

    // Get offers data
    const { data: offers } = await supabase
      .from('offers')
      .select('quote_submission_id, id, offer_amount, status, created_at, accepted_at, declined_at')
      .in('quote_submission_id', submissionIds);

    // Create lookup maps
    const customersMap = new Map(customers?.map(c => [c.id, c]) || []);
    const vehiclesMap = new Map(vehicles?.map(v => [v.id, v]) || []);
    const valuationsMap = new Map(valuations?.map(v => [v.quote_submission_id, v]) || []);
    const offersMap = new Map(offers?.map(o => [o.quote_submission_id, o]) || []);

    // Enrich submissions with related data
    const enrichedSubmissions = submissions?.map(submission => ({
      ...submission,
      customers: customersMap.get(submission.customer_id),
      vehicles: vehiclesMap.get(submission.vehicle_id),
      valuations: valuationsMap.get(submission.id) ? [valuationsMap.get(submission.id)] : [],
      offers: offersMap.get(submission.id) ? [offersMap.get(submission.id)] : []
    })) || [];

    // Analyze by make/model/year
    const byVehicle = {
      byMake: {} as Record<string, unknown>,
      byModel: {} as Record<string, unknown>,
      byYear: {} as Record<string, unknown>,
      byMakeModel: {} as Record<string, unknown>
    };

    // Analyze by source (simplified - using submission method)
    const bySource = {
      website: { total: 0, converted: 0, avgValue: 0, totalValue: 0 },
      referral: { total: 0, converted: 0, avgValue: 0, totalValue: 0 },
      other: { total: 0, converted: 0, avgValue: 0, totalValue: 0 }
    };

    // Analyze by geography (using address data)
    const byGeography = {
      byState: {} as Record<string, unknown>,
      byCity: {} as Record<string, unknown>
    };

    // Funnel analysis
    const funnel = {
      submissions: 0,
      underReview: 0,
      valuationReady: 0,
      offerSent: 0,
      accepted: 0,
      declined: 0
    };

    let totalValue = 0;

    enrichedSubmissions?.forEach(submission => {
      const vehicle = submission.vehicles;
      const customer = submission.customers;
      const valuation = submission.valuations?.[0];
      const offer = submission.offers?.[0];

      // Vehicle analysis
      if (vehicle) {
        const make = vehicle.make || 'Unknown';
        const model = vehicle.model || 'Unknown';
        const year = vehicle.year?.toString() || 'Unknown';
        const makeModel = `${make} ${model}`;

        // By make
        if (!byVehicle.byMake[make]) {
          byVehicle.byMake[make] = { total: 0, converted: 0, avgValue: 0, totalValue: 0 };
        }
        (byVehicle.byMake[make] as { total: number; converted: number; avgValue: number; totalValue: number }).total++;
        (byVehicle.byMake[make] as { total: number; converted: number; avgValue: number; totalValue: number }).totalValue += valuation?.final_valuation || submission.estimated_value || 0;
        if (offer?.status === 'accepted') (byVehicle.byMake[make] as { total: number; converted: number; avgValue: number; totalValue: number }).converted++;

        // By model
        if (!byVehicle.byModel[model]) {
          byVehicle.byModel[model] = { total: 0, converted: 0, avgValue: 0, totalValue: 0 };
        }
        (byVehicle.byModel[model] as { total: number; converted: number; avgValue: number; totalValue: number }).total++;
        (byVehicle.byModel[model] as { total: number; converted: number; avgValue: number; totalValue: number }).totalValue += valuation?.final_valuation || submission.estimated_value || 0;
        if (offer?.status === 'accepted') (byVehicle.byModel[model] as { total: number; converted: number; avgValue: number; totalValue: number }).converted++;

        // By year
        if (!byVehicle.byYear[year]) {
          byVehicle.byYear[year] = { total: 0, converted: 0, avgValue: 0, totalValue: 0 };
        }
        (byVehicle.byYear[year] as { total: number; converted: number; avgValue: number; totalValue: number }).total++;
        (byVehicle.byYear[year] as { total: number; converted: number; avgValue: number; totalValue: number }).totalValue += valuation?.final_valuation || submission.estimated_value || 0;
        if (offer?.status === 'accepted') (byVehicle.byYear[year] as { total: number; converted: number; avgValue: number; totalValue: number }).converted++;

        // By make/model combination
        if (!byVehicle.byMakeModel[makeModel]) {
          byVehicle.byMakeModel[makeModel] = { total: 0, converted: 0, avgValue: 0, totalValue: 0 };
        }
        (byVehicle.byMakeModel[makeModel] as { total: number; converted: number; avgValue: number; totalValue: number }).total++;
        (byVehicle.byMakeModel[makeModel] as { total: number; converted: number; avgValue: number; totalValue: number }).totalValue += valuation?.final_valuation || submission.estimated_value || 0;
        if (offer?.status === 'accepted') (byVehicle.byMakeModel[makeModel] as { total: number; converted: number; avgValue: number; totalValue: number }).converted++;
      }

      // Source analysis (simplified)
      const source = 'website'; // Default source
      bySource[source as keyof typeof bySource].total++;
      bySource[source as keyof typeof bySource].totalValue += valuation?.final_valuation || submission.estimated_value || 0;
      if (offer?.status === 'accepted') {
        bySource[source as keyof typeof bySource].converted++;
      }

      // Geography analysis
      if (customer?.address) {
        const state = customer.address.state || 'Unknown';
        const city = customer.address.city || 'Unknown';

        if (!byGeography.byState[state]) {
          byGeography.byState[state] = { total: 0, converted: 0, avgValue: 0, totalValue: 0 };
        }
        (byGeography.byState[state] as { total: number; converted: number; avgValue: number; totalValue: number }).total++;
        (byGeography.byState[state] as { total: number; converted: number; avgValue: number; totalValue: number }).totalValue += valuation?.final_valuation || submission.estimated_value || 0;
        if (offer?.status === 'accepted') (byGeography.byState[state] as { total: number; converted: number; avgValue: number; totalValue: number }).converted++;

        if (!byGeography.byCity[city]) {
          byGeography.byCity[city] = { total: 0, converted: 0, avgValue: 0, totalValue: 0 };
        }
        (byGeography.byCity[city] as { total: number; converted: number; avgValue: number; totalValue: number }).total++;
        (byGeography.byCity[city] as { total: number; converted: number; avgValue: number; totalValue: number }).totalValue += valuation?.final_valuation || submission.estimated_value || 0;
        if (offer?.status === 'accepted') (byGeography.byCity[city] as { total: number; converted: number; avgValue: number; totalValue: number }).converted++;
      }

      // Funnel analysis
      funnel.submissions++;
      if (submission.status === 'under_review') funnel.underReview++;
      if (submission.status === 'valuation_ready') funnel.valuationReady++;
      if (offer) funnel.offerSent++;
      if (offer?.status === 'accepted') funnel.accepted++;
      if (offer?.status === 'declined') funnel.declined++;

      totalValue += valuation?.final_valuation || submission.estimated_value || 0;
    });

    // Calculate averages and conversion rates
    Object.values(byVehicle.byMake).forEach(item => {
      (item as { total: number; converted: number; avgValue: number; totalValue: number }).avgValue = (item as { total: number; converted: number; avgValue: number; totalValue: number }).total > 0 ? (item as { total: number; converted: number; avgValue: number; totalValue: number }).totalValue / (item as { total: number; converted: number; avgValue: number; totalValue: number }).total : 0;
    });
    Object.values(byVehicle.byModel).forEach(item => {
      (item as { total: number; converted: number; avgValue: number; totalValue: number }).avgValue = (item as { total: number; converted: number; avgValue: number; totalValue: number }).total > 0 ? (item as { total: number; converted: number; avgValue: number; totalValue: number }).totalValue / (item as { total: number; converted: number; avgValue: number; totalValue: number }).total : 0;
    });
    Object.values(byVehicle.byYear).forEach(item => {
      (item as { total: number; converted: number; avgValue: number; totalValue: number }).avgValue = (item as { total: number; converted: number; avgValue: number; totalValue: number }).total > 0 ? (item as { total: number; converted: number; avgValue: number; totalValue: number }).totalValue / (item as { total: number; converted: number; avgValue: number; totalValue: number }).total : 0;
    });
    Object.values(byVehicle.byMakeModel).forEach(item => {
      (item as { total: number; converted: number; avgValue: number; totalValue: number }).avgValue = (item as { total: number; converted: number; avgValue: number; totalValue: number }).total > 0 ? (item as { total: number; converted: number; avgValue: number; totalValue: number }).totalValue / (item as { total: number; converted: number; avgValue: number; totalValue: number }).total : 0;
    });

    Object.values(bySource).forEach(item => {
      (item as { total: number; converted: number; avgValue: number; totalValue: number }).avgValue = (item as { total: number; converted: number; avgValue: number; totalValue: number }).total > 0 ? (item as { total: number; converted: number; avgValue: number; totalValue: number }).totalValue / (item as { total: number; converted: number; avgValue: number; totalValue: number }).total : 0;
    });

    Object.values(byGeography.byState).forEach(item => {
      (item as { total: number; converted: number; avgValue: number; totalValue: number }).avgValue = (item as { total: number; converted: number; avgValue: number; totalValue: number }).total > 0 ? (item as { total: number; converted: number; avgValue: number; totalValue: number }).totalValue / (item as { total: number; converted: number; avgValue: number; totalValue: number }).total : 0;
    });
    Object.values(byGeography.byCity).forEach(item => {
      (item as { total: number; converted: number; avgValue: number; totalValue: number }).avgValue = (item as { total: number; converted: number; avgValue: number; totalValue: number }).total > 0 ? (item as { total: number; converted: number; avgValue: number; totalValue: number }).totalValue / (item as { total: number; converted: number; avgValue: number; totalValue: number }).total : 0;
    });

    // Calculate funnel conversion rates
    const funnelRates = {
      submissionToReview: funnel.submissions > 0 ? (funnel.underReview / funnel.submissions) * 100 : 0,
      reviewToValuation: funnel.underReview > 0 ? (funnel.valuationReady / funnel.underReview) * 100 : 0,
      valuationToOffer: funnel.valuationReady > 0 ? (funnel.offerSent / funnel.valuationReady) * 100 : 0,
      offerToAccepted: funnel.offerSent > 0 ? (funnel.accepted / funnel.offerSent) * 100 : 0,
      offerToDeclined: funnel.offerSent > 0 ? (funnel.declined / funnel.offerSent) * 100 : 0
    };

    return NextResponse.json({
      data: {
        byVehicle,
        bySource,
        byGeography,
        funnel: {
          ...funnel,
          rates: funnelRates
        },
        summary: {
          totalSubmissions: enrichedSubmissions?.length || 0,
          totalValue,
          avgValue: enrichedSubmissions?.length ? totalValue / enrichedSubmissions.length : 0
        },
        period: {
          days,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Error in cohorts funnels API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
