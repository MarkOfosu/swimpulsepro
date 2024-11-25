import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/supabase/getUserRole';

export async function GET() {
  try {
    const supabase = createClient();

    // Get user and verify auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is a coach
    const role = await getUserRole(supabase, user.id);
    if (role !== 'coach') {
      return NextResponse.json(
        { error: 'Access denied: Coach role required' },
        { status: 403 }
      );
    }

    // Fetch swim groups
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
