"use client"
import React, { useState, useEffect } from 'react';
import styles from '../../../styles/WorkoutPage.module.css';
import { WorkoutData, SwimGroup } from '@app/lib/types';
import { createClient } from '@utils/supabase/client';
import WorkoutDetailsModal from './WorkoutDetailsModal';

interface ViewWorkoutsProps {
  groups: SwimGroup[];
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
}

const ITEMS_PER_PAGE = 10;

const ViewWorkouts: React.FC<ViewWorkoutsProps> = ({ groups, selectedGroup, setSelectedGroup }) => {
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterFocus, setFilterFocus] = useState<string>('');
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutData | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchWorkouts();
  }, [selectedGroup, filterDate, filterFocus, page]);

  const fetchWorkouts = async () => {
    setLoading(true);
    let query = supabase
      .from('workouts')
      .select('id, coach_id, group_id, workout_data, created_at')
      .order('created_at', { ascending: false })
      .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

    if (selectedGroup) {
      query = query.eq('group_id', selectedGroup);
    }

    if (filterDate) {
      const startDate = new Date(filterDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query = query.gte('created_at', startDate.toISOString()).lt('created_at', endDate.toISOString());
    }

    if (filterFocus) {
      query = query.textSearch('workout_data->>focus', filterFocus);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching workouts:', error);
    } else {
      setWorkouts(prevWorkouts => page === 1 ? data || [] : [...prevWorkouts, ...(data || [])]);
      setHasMore((data || []).length === ITEMS_PER_PAGE);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setPage(1);
    setWorkouts([]);
    fetchWorkouts();
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const renderWorkoutItem = (workout: WorkoutData) => {
    if (!workout.workout_data) {
      return (
        <li key={workout.id} className={styles.workoutItem}>
          <p>This workout has no data.</p>
        </li>
      );
    }

    return (
      <li key={workout.id} className={styles.workoutItem}>
        <div>
          <p><strong>Date:</strong> {new Date(workout.created_at || '').toLocaleDateString()}</p>
          <p><strong>Focus:</strong> {workout.workout_data.focus || 'N/A'}</p>
          <p><strong>Description:</strong> {workout.workout_data.description || 'No description provided'}</p>
          <p><strong>Group:</strong> {groups.find(g => g.id === workout.group_id)?.name || 'Unknown'}</p>
          <button onClick={() => setSelectedWorkout(workout)}>View Details</button>
        </div>
      </li>
    );
  };

  return (
    <div className={styles.workoutsSection}>
      <h2 className={styles.sectionTitle}>Past Workouts</h2>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Select Swim Group (Optional):</label>
        <select 
          className={styles.formSelect} 
          value={selectedGroup} 
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="">All Groups</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Filter by Date (Optional):</label>
        <input
          type="date"
          className={styles.formInput}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Filter by Focus (Optional):</label>
        <input
          type="text"
          className={styles.formInput}
          value={filterFocus}
          onChange={(e) => setFilterFocus(e.target.value)}
        />
      </div>
      <button className={styles.searchButton} onClick={handleSearch}>Search</button>
      
      {loading && <p>Loading workouts...</p>}
      
      {!loading && workouts.length === 0 && (
        <p>No workouts found matching the current criteria.</p>
      )}
      
      {workouts.length > 0 && (
        <>
          <ul className={styles.workoutList}>
            {workouts.map(renderWorkoutItem)}
          </ul>
          {hasMore && (
            <button className={styles.loadMoreButton} onClick={handleLoadMore} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </>
      )}

      {selectedWorkout && (
        <WorkoutDetailsModal workout={selectedWorkout} onClose={() => setSelectedWorkout(null)} />
      )}
    </div>
  );
};

export default ViewWorkouts;