import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all quote submissions with their related data
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
      .select('id, name, email')
      .in('id', submissions?.map(s => s.customer_id).filter(Boolean) || []);

    // Get vehicles data
    const { data: vehicles } = await supabase
      .from('vehicles')
      .select('id, make, model, year')
      .in('id', submissions?.map(s => s.vehicle_id).filter(Boolean) || []);

    // Get valuations data
    const { data: valuations } = await supabase
      .from('valuations')
      .select('quote_submission_id, final_valuation, market_value, status, created_at')
      .in('quote_submission_id', submissionIds);

    // Get offers data
    const { data: offers } = await supabase
      .from('offers')
      .select('quote_submission_id, id, offer_amount, status, created_at, sent_at, accepted_at, declined_at, expiry_date')
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

    // Calculate SLA metrics
    const now = new Date();
    const slaMetrics = {
      submissionToReview: {
        total: 0,
        within24h: 0,
        within48h: 0,
        over48h: 0,
        avgHours: 0
      },
      reviewToSend: {
        total: 0,
        within24h: 0,
        within48h: 0,
        over48h: 0,
        avgHours: 0
      }
    };

    // Calculate acceptance metrics
    const acceptanceMetrics = {
      totalOffers: 0,
      accepted: 0,
      declined: 0,
      expired: 0,
      pending: 0,
      acceptanceRate: 0
    };

    // Calculate discount metrics
    const discountMetrics = {
      totalValuations: 0,
      totalDiscount: 0,
      avgDiscount: 0,
      avgDiscountPercentage: 0
    };

    // Calculate channel performance (simplified - using submission source)
    const channelMetrics = {
      total: submissions?.length || 0,
      bySource: {} as Record<string, number>
    };

    let totalSubmissionToReviewHours = 0;
    let totalReviewToSendHours = 0;
    let submissionToReviewCount = 0;
    let reviewToSendCount = 0;

    enrichedSubmissions?.forEach(submission => {
      const submissionDate = new Date(submission.created_at);
      const updatedDate = new Date(submission.updated_at);
      
      // Track submission to review SLA
      if (submission.status !== 'pending_review') {
        const hoursToReview = (updatedDate.getTime() - submissionDate.getTime()) / (1000 * 60 * 60);
        totalSubmissionToReviewHours += hoursToReview;
        submissionToReviewCount++;
        
        slaMetrics.submissionToReview.total++;
        if (hoursToReview <= 24) {
          slaMetrics.submissionToReview.within24h++;
        } else if (hoursToReview <= 48) {
          slaMetrics.submissionToReview.within48h++;
        } else {
          slaMetrics.submissionToReview.over48h++;
        }
      }

      // Track review to send SLA
      const offer = submission.offers?.[0];
      if (offer && offer.created_at) {
        const offerDate = new Date(offer.created_at);
        const hoursToSend = (offerDate.getTime() - submissionDate.getTime()) / (1000 * 60 * 60);
        totalReviewToSendHours += hoursToSend;
        reviewToSendCount++;
        
        slaMetrics.reviewToSend.total++;
        if (hoursToSend <= 24) {
          slaMetrics.reviewToSend.within24h++;
        } else if (hoursToSend <= 48) {
          slaMetrics.reviewToSend.within48h++;
        } else {
          slaMetrics.reviewToSend.over48h++;
        }
      }

      // Track acceptance metrics
      if (offer) {
        acceptanceMetrics.totalOffers++;
        switch (offer.status) {
          case 'accepted':
            acceptanceMetrics.accepted++;
            break;
          case 'declined':
            acceptanceMetrics.declined++;
            break;
          case 'expired':
            acceptanceMetrics.expired++;
            break;
          default:
            acceptanceMetrics.pending++;
        }
      }

      // Track discount metrics
      const valuation = submission.valuations?.[0];
      if (valuation && offer && valuation.final_valuation && offer.offer_amount) {
        discountMetrics.totalValuations++;
        const discount = valuation.final_valuation - offer.offer_amount;
        discountMetrics.totalDiscount += discount;
      }

      // Track channel performance (simplified)
      const source = 'website'; // Default source
      channelMetrics.bySource[source] = (channelMetrics.bySource[source] || 0) + 1;
    });

    // Calculate averages
    if (submissionToReviewCount > 0) {
      slaMetrics.submissionToReview.avgHours = totalSubmissionToReviewHours / submissionToReviewCount;
    }
    if (reviewToSendCount > 0) {
      slaMetrics.reviewToSend.avgHours = totalReviewToSendHours / reviewToSendCount;
    }

    // Calculate acceptance rate
    if (acceptanceMetrics.totalOffers > 0) {
      acceptanceMetrics.acceptanceRate = (acceptanceMetrics.accepted / acceptanceMetrics.totalOffers) * 100;
    }

    // Calculate average discount
    if (discountMetrics.totalValuations > 0) {
      discountMetrics.avgDiscount = discountMetrics.totalDiscount / discountMetrics.totalValuations;
      const totalValuation = enrichedSubmissions?.reduce((sum, s) => {
        const valuation = s.valuations?.[0];
        return sum + (valuation?.final_valuation || 0);
      }, 0) || 0;
      if (totalValuation > 0) {
        discountMetrics.avgDiscountPercentage = (discountMetrics.totalDiscount / totalValuation) * 100;
      }
    }

    return NextResponse.json({
      data: {
        slaMetrics,
        acceptanceMetrics,
        discountMetrics,
        channelMetrics,
        period: {
          days,
          startDate: startDate.toISOString(),
          endDate: now.toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Error in ops metrics API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
