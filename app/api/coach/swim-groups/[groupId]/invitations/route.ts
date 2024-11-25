import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserRole } from '@/utils/supabase/getUserRole';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const supabase = createClient();

    // Verify authentication and role
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

    // Get request body
    const { email } = await request.json();
    const groupId = params.groupId;

    // Verify coach owns this group
    const { data: groupData, error: groupError } = await supabase
      .from('swim_groups')
      .select('id')
      .eq('id', groupId)
      .eq('coach_id', user.id)
      .single();

    if (groupError || !groupData) {
      return NextResponse.json(
        { error: 'Group not found or access denied' },
        { status: 404 }
      );
    }

    // Check for existing invitation
    const { data: existingInvitations, error: checkError } = await supabase
      .from('invitations')
      .select('*')
      .eq('group_id', groupId)
      .eq('email', email)
      .eq('status', 'pending');

    if (checkError) {
      return NextResponse.json(
        { error: 'Failed to check existing invitations' },
        { status: 500 }
      );
    }

    if (existingInvitations && existingInvitations.length > 0) {
      return NextResponse.json(
        { error: 'An invitation for this email is already pending' },
        { status: 409 }
      );
    }

    // Create new invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .insert({
        group_id: groupId,
        email: email,
        status: 'pending'
      })
      .select()
      .single();

    if (invitationError) {
      return NextResponse.json(
        { error: 'Failed to create invitation' },
        { status: 500 }
      );
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}