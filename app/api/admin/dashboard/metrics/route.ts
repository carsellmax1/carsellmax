import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get total quote submissions
    const { count: totalSubmissions } = await supabase
      .from('quote_submissions')
      .select('*', { count: 'exact', head: true });

    // Get pending reviews
    const { count: pendingReviews } = await supabase
      .from('quote_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending_review');

    // Get quotes sent
    const { count: quotesSent } = await supabase
      .from('quote_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'quote_sent');

    // Get accepted quotes
    const { count: acceptedQuotes } = await supabase
      .from('quote_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'accepted');

    // Calculate acceptance rate
    const acceptanceRate = (quotesSent || 0) > 0 ? Math.round(((acceptedQuotes || 0) / (quotesSent || 1)) * 100) : 0;

    // Get total revenue estimate (sum of accepted offers)
    const { data: offers } = await supabase
      .from('offers')
      .select('offer_amount')
      .eq('status', 'accepted');

    const totalRevenue = offers?.reduce((sum, offer) => sum + (offer.offer_amount || 0), 0) || 0;

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recentSubmissions } = await supabase
      .from('quote_submissions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    return NextResponse.json({
      totalSubmissions: totalSubmissions || 0,
      pendingReviews: pendingReviews || 0,
      quotesSent: quotesSent || 0,
      acceptedQuotes: acceptedQuotes || 0,
      acceptanceRate: `${acceptanceRate}%`,
      totalRevenue: totalRevenue,
      recentSubmissions: recentSubmissions || 0,
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}

