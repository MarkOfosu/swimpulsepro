import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserRole } from '@/utils/supabase/getUserRole';

export const dynamic = 'force-dynamic';

// GET specific swim group
export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
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

    const { data, error } = await supabase
      .from('swim_groups')
      .select('*')
      .eq('id', params.groupId)
      .eq('coach_id', user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
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