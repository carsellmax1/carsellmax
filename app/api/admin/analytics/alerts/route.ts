import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const alerts = [];

    // Alert 1: Pending reviews > 24h
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const { data: pendingReviews, error: pendingError } = await supabase
      .from('quote_submissions')
      .select('id, created_at, customers(name, email), vehicles(make, model, year)')
      .eq('status', 'pending_review')
      .lt('created_at', twentyFourHoursAgo.toISOString());

    if (!pendingError && pendingReviews && pendingReviews.length > 0) {
      alerts.push({
        id: 'pending-reviews-24h',
        type: 'warning',
        title: 'Pending Reviews Over 24h',
        message: `${pendingReviews.length} quote submissions have been pending review for over 24 hours`,
        count: pendingReviews.length,
        severity: pendingReviews.length > 10 ? 'high' : 'medium',
        data: pendingReviews.map(review => ({
          id: review.id,
          customer: review.customers?.name || 'Unknown',
          email: review.customers?.email || 'Unknown',
          vehicle: `${review.vehicles?.year || 'N/A'} ${review.vehicles?.make || 'Unknown'} ${review.vehicles?.model || 'Unknown'}`,
          hoursPending: Math.floor((now.getTime() - new Date(review.created_at).getTime()) / (1000 * 60 * 60))
        }))
      });
    }

    // Alert 2: Offers expiring in 48h
    const fortyEightHoursFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const { data: expiringOffers, error: expiringError } = await supabase
      .from('offers')
      .select(`
        id,
        offer_amount,
        expiry_date,
        status,
        quote_submissions (
          customers (name, email),
          vehicles (make, model, year)
        )
      `)
      .in('status', ['draft', 'sent', 'viewed'])
      .lte('expiry_date', fortyEightHoursFromNow.toISOString())
      .gt('expiry_date', now.toISOString());

    if (!expiringError && expiringOffers && expiringOffers.length > 0) {
      alerts.push({
        id: 'offers-expiring-48h',
        type: 'warning',
        title: 'Offers Expiring in 48h',
        message: `${expiringOffers.length} offers will expire within 48 hours`,
        count: expiringOffers.length,
        severity: expiringOffers.length > 5 ? 'high' : 'medium',
        data: expiringOffers.map(offer => ({
          id: offer.id,
          customer: offer.quote_submissions?.customers?.name || 'Unknown',
          email: offer.quote_submissions?.customers?.email || 'Unknown',
          vehicle: `${offer.quote_submissions?.vehicles?.year || 'N/A'} ${offer.quote_submissions?.vehicles?.make || 'Unknown'} ${offer.quote_submissions?.vehicles?.model || 'Unknown'}`,
          offerAmount: offer.offer_amount,
          hoursUntilExpiry: Math.floor((new Date(offer.expiry_date).getTime() - now.getTime()) / (1000 * 60 * 60))
        }))
      });
    }

    // Alert 3: Send failures (offers that failed to send)
    const { data: failedOffers, error: failedError } = await supabase
      .from('offers')
      .select(`
        id,
        offer_amount,
        created_at,
        status,
        quote_submissions (
          customers (name, email),
          vehicles (make, model, year)
        )
      `)
      .eq('status', 'draft')
      .lt('created_at', new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()); // Created more than 2 hours ago

    if (!failedError && failedOffers && failedOffers.length > 0) {
      alerts.push({
        id: 'send-failures',
        type: 'error',
        title: 'Potential Send Failures',
        message: `${failedOffers.length} offers have been in draft status for over 2 hours`,
        count: failedOffers.length,
        severity: 'high',
        data: failedOffers.map(offer => ({
          id: offer.id,
          customer: offer.quote_submissions?.customers?.name || 'Unknown',
          email: offer.quote_submissions?.customers?.email || 'Unknown',
          vehicle: `${offer.quote_submissions?.vehicles?.year || 'N/A'} ${offer.quote_submissions?.vehicles?.make || 'Unknown'} ${offer.quote_submissions?.vehicles?.model || 'Unknown'}`,
          offerAmount: offer.offer_amount,
          hoursInDraft: Math.floor((now.getTime() - new Date(offer.created_at).getTime()) / (1000 * 60 * 60))
        }))
      });
    }

    // Alert 4: High volume of submissions (if > 50 in last 24h)
    const { data: recentSubmissions, error: recentError } = await supabase
      .from('quote_submissions')
      .select('id')
      .gte('created_at', twentyFourHoursAgo.toISOString());

    if (!recentError && recentSubmissions && recentSubmissions.length > 50) {
      alerts.push({
        id: 'high-volume',
        type: 'info',
        title: 'High Volume Alert',
        message: `${recentSubmissions.length} quote submissions received in the last 24 hours`,
        count: recentSubmissions.length,
        severity: 'medium',
        data: []
      });
    }

    // Alert 5: Low acceptance rate (if < 20% in last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { data: recentOffers, error: recentOffersError } = await supabase
      .from('offers')
      .select('status')
      .gte('created_at', sevenDaysAgo.toISOString());

    if (!recentOffersError && recentOffers) {
      const totalOffers = recentOffers.length;
      const acceptedOffers = recentOffers.filter(offer => offer.status === 'accepted').length;
      const acceptanceRate = totalOffers > 0 ? (acceptedOffers / totalOffers) * 100 : 0;

      if (acceptanceRate < 20 && totalOffers >= 5) {
        alerts.push({
          id: 'low-acceptance-rate',
          type: 'warning',
          title: 'Low Acceptance Rate',
          message: `Acceptance rate is ${acceptanceRate.toFixed(1)}% (${acceptedOffers}/${totalOffers}) in the last 7 days`,
          count: totalOffers,
          severity: 'high',
          data: [{
            acceptanceRate: acceptanceRate,
            acceptedOffers,
            totalOffers
          }]
        });
      }
    }

    // Sort alerts by severity (error > warning > info)
    const severityOrder = { error: 0, warning: 1, info: 2 };
    alerts.sort((a, b) => severityOrder[a.type as keyof typeof severityOrder] - severityOrder[b.type as keyof typeof severityOrder]);

    return NextResponse.json({
      data: {
        alerts,
        summary: {
          total: alerts.length,
          errors: alerts.filter(a => a.type === 'error').length,
          warnings: alerts.filter(a => a.type === 'warning').length,
          info: alerts.filter(a => a.type === 'info').length
        },
        timestamp: now.toISOString()
      }
    });
  } catch (error) {
    console.error('Error in alerts API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

