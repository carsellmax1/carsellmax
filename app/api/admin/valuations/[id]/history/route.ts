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

    // Fetch valuation history
    const { data: history, error: historyError } = await supabase
      .from('valuation_history')
      .select(`
        *,
        created_by:admin_users (
          email
        )
      `)
      .eq('valuation_id', id)
      .order('created_at', { ascending: false });

    if (historyError) {
      console.error('Error fetching valuation history:', historyError);
      return NextResponse.json(
        { error: 'Failed to fetch valuation history' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: history || [] });
  } catch (error) {
    console.error('Error in GET /api/admin/valuations/[id]/history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
