import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserRole } from '@/utils/supabase/getUserRole';

export const dynamic = 'force-dynamic';

// GET all swim groups
export async function GET() {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const role = await getUserRole(supabase, user.id);
    if (role !== 'coach') {
      return NextResponse.json(
        { error: 'Access denied: Coach role required' },
        { status: 403 }
      );
    }

    const { data: groups, error: groupsError } = await supabase
      .from('swim_groups')
      .select('*')
      .eq('coach_id', user.id);

    if (groupsError) {
      console.error('Error fetching swim groups:', groupsError);
      return NextResponse.json(
        { error: groupsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(groups || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new swim group
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const role = await getUserRole(supabase, user.id);
    if (role !== 'coach') {
      return NextResponse.json(
        { error: 'Access denied: Coach role required' },
        { status: 403 }
      );
    }

    const groupData = await request.json();

    const { data, error } = await supabase
      .from('swim_groups')
      .insert({
        ...groupData,
        coach_id: user.id
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}