"use client";
import CoachPageLayout from "../page";
import { useState, useEffect } from 'react';
import { createClient } from '@utils/supabase/client';
import { SwimWorkout, WorkoutData, AITrainingData } from '@app/lib/types'; 
import styles from '../../../styles/WorkoutPage.module.css';
import { generateSwimWorkout } from "@app/lib/langchain/langchainHelper";
import ClipLoader from "react-spinners/ClipLoader";

const WorkoutPage = () => {
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [generatedWorkout, setGeneratedWorkout] = useState<SwimWorkout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fields for manual workout
  const [date, setDate] = useState<string>('');
  const [focus, setFocus] = useState<string>('');
  const [warmup, setWarmup] = useState<string[]>(['']);
  const [preset, setPreset] = useState<string[]>(['']);
  const [mainSet, setMainSet] = useState<string[]>(['']);
  const [cooldown, setCooldown] = useState<string[]>(['']);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [intensity, setIntensity] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [viewMode, setViewMode] = useState<'view' | 'manual' | 'ai'>('manual');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterFocus, setFilterFocus] = useState<string>('');

  const supabase = createClient();

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        console.error('No session found, redirecting to login...');
        return;
      }

      const { data: groupData, error: groupError } = await supabase
        .from('swim_groups')
        .select('*')
        .eq('coach_id', session.user.id);

      if (groupError) {
        console.error('Error fetching swim groups:', groupError);
      } else {
        setGroups(groupData || []);
      }

      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .select('id, workout_data, created_at, coach_id, group_id')
        .eq('coach_id', session.user.id);
      
      if (workoutError) {
        console.error('Error fetching workouts:', workoutError);
      } else {
        setWorkouts(workoutData || []);
      }
    };

    fetchInitialData();
  }, []);

  const handleGenerateWorkout = async () => {
    setLoading(true);
    try {
      const data = await generateSwimWorkout(inputText);
      if ('error' in data) {
        console.error('Failed to generate workout:', data.error);
      } else {
        setGeneratedWorkout(data);
      }
    } catch (error) {
      console.error('Failed to generate workout:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveWorkout = async () => {
    const workout: SwimWorkout = {
      focus,
      warmup,
      preset,
      main_set: mainSet,
      cooldown,
      distance,
      duration,
      intensity,
      description,
    };

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;

    if (!session) return;

    const coachId = session.user.id;

    const { data, error } = await supabase
      .from('workouts')
      .insert<WorkoutData>([
        {
          coach_id: coachId,
          group_id: selectedGroup,
          workout_data: workout,
        },
      ]);

    if (error) {
      console.error('Error saving workout:', error);
    } else {
      const trainingData: SwimWorkout[] = [workout];

      await supabase
        .from('ai_training_data')
        .insert<AITrainingData>([{ id: '', group_id: selectedGroup, training_data: trainingData, created_at: new Date().toISOString() }]);

      alert('Workout saved successfully!');
      if (data) {
        setWorkouts([...workouts, data[0]]);
      }
    }
  };

  const handleViewWorkouts = () => {
    let filteredWorkouts = workouts.filter(workout => workout.group_id === selectedGroup);

    if (filterDate) {
      filteredWorkouts = filteredWorkouts.filter(workout => 
        new Date(workout.created_at || '').toLocaleDateString() === new Date(filterDate).toLocaleDateString()
      );
    }

    if (filterFocus) {
      filteredWorkouts = filteredWorkouts.filter(workout => 
        workout.workout_data.focus.toLowerCase().includes(filterFocus.toLowerCase())
      );
    }

    setWorkouts(filteredWorkouts);
  };

  return (
    <CoachPageLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Manage Workouts</h1>

        <div className={styles.buttonGroup}>
          <button onClick={() => setViewMode('view')} className={styles.optionButton}>View Past Workouts</button>
          <button onClick={() => setViewMode('ai')} className={styles.optionButton}>Generate AI Workout</button>
          <button onClick={() => setViewMode('manual')} className={styles.optionButton}>Write Manual Workout</button>
        </div>

        {viewMode === 'view' && (
          <div className={styles.workoutsSection}>
            <h2 className={styles.sectionTitle}>Past Workouts</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Select Swim Group:</label>
              <select className={styles.formSelect} value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                <option value="">Select Group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.group_name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Filter by Date:</label>
              <input
                type="date"
                className={styles.formInput}
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Filter by Focus:</label>
              <input
                type="text"
                className={styles.formInput}
                value={filterFocus}
                onChange={(e) => setFilterFocus(e.target.value)}
              />
            </div>
            <button className={styles.searchButton} onClick={handleViewWorkouts}>Search</button>
            <ul className={styles.workoutList}>
              {workouts.map((workout) => (
                <li key={workout.coach_id} className={styles.workoutItem}>
                  <div>
                    <p><strong>Date:</strong> {new Date(workout.created_at || '').toLocaleDateString()}</p>
                    <p><strong>Focus:</strong> {workout.workout_data.focus}</p>
                    <p><strong>Description:</strong> {workout.workout_data.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {viewMode === 'manual' && (
          <div className={styles.createWorkoutSection}>
            <h2 className={styles.sectionTitle}>Write Manual Workout</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Select Swim Group:</label>
              <select className={styles.formSelect} value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                <option value="">Select Group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.group_name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Date:</label>
              <input
                type="date"
                className={styles.formInput}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Focus:</label>
              <input
                type="text"
                className={styles.formInput}
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label                 className={styles.formLabel}>Warmup:</label>
              <textarea
                className={styles.formTextarea}
                value={warmup.join('\n')}
                onChange={(e) => setWarmup(e.target.value.split('\n'))}
                placeholder="Enter warmup exercises, each on a new line"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Preset:</label>
              <textarea
                className={styles.formTextarea}
                value={preset.join('\n')}
                onChange={(e) => setPreset(e.target.value.split('\n'))}
                placeholder="Enter preset exercises, each on a new line"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Main Set:</label>
              <textarea
                className={styles.formTextarea}
                value={mainSet.join('\n')}
                onChange={(e) => setMainSet(e.target.value.split('\n'))}
                placeholder="Enter main set exercises, each on a new line"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Cooldown:</label>
              <textarea
                className={styles.formTextarea}
                value={cooldown.join('\n')}
                onChange={(e) => setCooldown(e.target.value.split('\n'))}
                placeholder="Enter cooldown exercises, each on a new line"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Distance:</label>
              <input
                type="text"
                className={styles.formInput}
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Enter total distance (optional)"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Duration:</label>
              <input
                type="text"
                className={styles.formInput}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter estimated duration (optional)"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Intensity:</label>
              <input
                type="text"
                className={styles.formInput}
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                placeholder="Enter intensity level (optional)"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Description:</label>
              <textarea
                className={styles.formTextarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description for the workout (optional)"
              />
            </div>
            <button className={styles.saveButton} onClick={handleSaveWorkout}>Save Workout</button>
          </div>
        )}

        {viewMode === 'ai' && (
          <div className={styles.createWorkoutSection}>
            <h2 className={styles.sectionTitle}>Generate AI Workout</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Select Swim Group:</label>
              <select className={styles.formSelect} value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                <option value="">Select Group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.group_name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Workout Request:</label>
              <input
                type="text"
                className={styles.formInput}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your workout request"
              />
            </div>
            <button 
              className={styles.generateButton} 
              onClick={handleGenerateWorkout}
              disabled={loading}  // Disable button while loading
            >
              {loading ? <ClipLoader size={20} color={"#ffffff"} /> : "Generate AI Workout"}
            </button>
            {generatedWorkout && (
              <div className={styles.generatedWorkout}>
                <h2>Generated Workout</h2>
                <div className={styles.workoutDetails}>
                  <p><strong>Focus:</strong> {generatedWorkout.focus}</p>
                  <p><strong>Warmup:</strong></p>
                  <ul>
                    {generatedWorkout.warmup.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <p><strong>Preset:</strong></p>
                  <ul>
                    {generatedWorkout.preset.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <p><strong>Main Set:</strong></p>
                  <ul>
                    {generatedWorkout.main_set.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <p><strong>Cooldown:</strong></p>
                  <ul>
                    {generatedWorkout.cooldown.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <p><strong>Distance:</strong> {generatedWorkout.distance}</p>
                  <p><strong>Duration:</strong> {generatedWorkout.duration}</p>
                  <p><strong>Intensity:</strong> {generatedWorkout.intensity}</p>
                  <p><strong>Description:</strong> {generatedWorkout.description}</p>
                </div>
                <button className={styles.saveButton} onClick={handleSaveWorkout}>Save Workout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </CoachPageLayout>
  );
};

export default WorkoutPage;

              
