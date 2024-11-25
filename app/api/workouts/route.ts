// import { SupabaseClient } from '@supabase/supabase-js';
// import { WorkoutData, SwimWorkout, AITrainingData } from '@app/lib/types';

// export const fetchGroups = async (supabase: SupabaseClient, coachId: string) => {
//   const { data, error } = await supabase
//     .from('swim_groups')
//     .select('*')
//     .eq('coach_id', coachId);

//   if (error) {
//     console.error('Error fetching swim groups:', error);
//     return [];
//   }
//   return data || [];
// };

// export const fetchWorkouts = async (supabase: SupabaseClient, coachId: string) => {
//   const { data, error } = await supabase
//     .from('workouts')
//     .select('id, workout_data, created_at, coach_id, group_id')
//     .eq('coach_id', coachId);
  
//   if (error) {
//     console.error('Error fetching workouts:', error);
//     return [];
//   }
//   return data || [];
// };

// export const saveWorkout = async (supabase: SupabaseClient, coachId: string, groupId: string, workoutData: SwimWorkout) => {
//   const { data, error } = await supabase
//     .from('workouts')
//     .insert<WorkoutData>([
//       {
//         coach_id: coachId,
//         group_id: groupId,
//         workout_data: workoutData,
//       },
//     ]);

//   if (error) {
//     console.error('Error saving workout:', error);
//     return null;
//   }

//   const trainingData: SwimWorkout[] = [workoutData];

//   await supabase
//     .from('ai_training_data')
//     .insert<AITrainingData>([{ id: '', group_id: groupId, training_data: trainingData, created_at: new Date().toISOString() }]);

//   return data ? data[0] : null;
// };
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { getUserRole } from '@/utils/supabase/getUserRole'
import { SwimWorkout } from '@app/lib/types'

export async function GET() {
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

    const { data: workouts, error: workoutsError } = await supabase
      .from('workouts')
      .select('*')
      .eq('coach_id', user.id)
      .order('created_at', { ascending: false })

    if (workoutsError) {
      console.error('Error fetching workouts:', workoutsError)
      return NextResponse.json(
        { error: workoutsError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(workouts || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    const { workout, groupId } = await request.json()

    // Save to workouts table
    const { data: workoutData, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        coach_id: user.id,
        group_id: groupId,
        workout_data: workout,
      })
      .select()
      .single()

    if (workoutError) {
      console.error('Error saving workout:', workoutError)
      return NextResponse.json(
        { error: workoutError.message },
        { status: 500 }
      )
    }

    // Save to ai_training_data table
    const { error: aiTrainingError } = await supabase
      .from('ai_training_data')
      .insert({
        group_id: groupId,
        training_data: [workout],
      })

    if (aiTrainingError) {
      console.error('Error saving to AI training data:', aiTrainingError)
      // Don't fail the request if AI training data save fails
    }

    return NextResponse.json(workoutData)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
