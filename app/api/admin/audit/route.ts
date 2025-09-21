import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const table = searchParams.get('table');
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';

    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        admin_users(name, email)
      `)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (action) {
      query = query.eq('action', action);
    }

    if (table) {
      query = query.eq('table_name', table);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching audit logs:', error);
      return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
    }

    // Transform the data to flatten the nested structure
    const transformedData = data?.map(log => ({
      ...log,
      admin_user: {
        name: log.admin_users?.name,
        email: log.admin_users?.email,
      }
    })) || [];

    return NextResponse.json({ data: transformedData, count: transformedData.length });
  } catch (error) {
    console.error('Error in audit API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

