
import { workoutService } from '@/app/services/workoutService';
import { ITEMS_PER_PAGE } from '@/app/lib/constants';
import { useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { SwimWorkout, WorkoutData } from '@app/lib/types'

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchWorkouts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/workouts', {
        credentials: 'include'
      })
      
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch workouts')
      }

      setWorkouts(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch workouts'
      setError(errorMessage)
      console.error('Error fetching workouts:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveWorkout = useCallback(async (workout: SwimWorkout, groupId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/workouts', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workout, groupId }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save workout')
      }

      setWorkouts(prev => [...prev, data])
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save workout'
      setError(errorMessage)
      console.error('Error saving workout:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    workouts,
    isLoading,
    error,
    fetchWorkouts,
    saveWorkout
  }
}