
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { WorkoutData, SwimWorkout } from '@app/lib/types';
import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/supabase/getUserRole';

export async function POST(request: Request) {
    try {
      const supabase = createClient()
  
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
  
      const role = await getUserRole(supabase, user.id)
      if (role !== 'coach') {
        return NextResponse.json(
          { error: 'Access denied: Coach role required' },
          { status: 403 }
        )
      }
  
      const { groupId, date, focus, page = 1, itemsPerPage = 5 } = await request.json()
  
      let query = supabase
        .from('workouts')
        .select('id, workout_data, created_at, coach_id, group_id')
        .eq('coach_id', user.id)
        .order('created_at', { ascending: false })
  
      if (groupId) {
        query = query.eq('group_id', groupId)
      }
  
      if (date) {
        const startDate = new Date(date)
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 1)
        query = query
          .gte('created_at', startDate.toISOString())
          .lt('created_at', endDate.toISOString())
      }
  
      if (focus) {
        query = query.textSearch('workout_data->>focus', focus)
      }
  
      // Add pagination
      query = query.range(
        (page - 1) * itemsPerPage,
        page * itemsPerPage - 1
      )
  
      const { data, error } = await query
  
      if (error) {
        console.error('Error searching workouts:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }
  
      return NextResponse.json(data || [])
    } catch (error) {
      console.error('Unexpected error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }