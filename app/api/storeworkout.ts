"use server";
// pages/api/storeWorkout.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { WorkoutData, AITrainingData } from '../lib/types';
import { createClient } from '@utils/supabase/server';


// pages/api/storeWorkout.ts


const supabase = createClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { workout_data, coach_id, group_id } = req.body as WorkoutData;

    try {
      // Insert workout data into Workouts table
      const { error: workoutError } = await supabase
        .from('workouts')
        .insert({ coach_id: coach_id, group_id: group_id, workout_data: workout_data });

      if (workoutError) throw workoutError;

      // Fetch existing training data for the group
      const { data: aiData, error: aiFetchError } = await supabase
        .from('ai_training_data')
        .select('training_data')
        .eq('group_id', group_id)
        .single();

      if (aiFetchError) throw aiFetchError;

      const existingTrainingData = aiData?.training_data || [];
      
      // Append new workout data to existing training data
      const updatedTrainingData = [...existingTrainingData, workout_data];

      // Update or insert training data in ai_training_data table
      const { error: aiUpdateError } = await supabase
        .from('ai_training_data')
        .upsert({ group_id: group_id, training_data: updatedTrainingData });

      if (aiUpdateError) throw aiUpdateError;

      res.status(200).json({ message: 'Workout stored and training data updated successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to store workout or update training data.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
