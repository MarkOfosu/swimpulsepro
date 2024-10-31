// components/activities/ActivityFilters.tsx
import React from 'react';
import styles from '@/styles/Activities.module.css';

interface ActivityFiltersProps {
  onFilterChange: (filters: ActivityFilters) => void;
  filters: ActivityFilters;
}

interface ActivityFilters {
  type?: 'all' | 'meet' | 'practice' | 'event';
  timeFrame?: 'upcoming' | 'past' | 'all';
  groupId?: string;
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  onFilterChange,
  filters,
}) => {
  return (
    <div className="flex gap-4 mb-6">
      <select
        className={styles.select}
        value={filters.type}
        onChange={(e) => onFilterChange({ ...filters, type: e.target.value as ActivityFilters['type'] })}
      >
        <option value="all">All Types</option>
        <option value="meet">Meets</option>
        <option value="practice">Practices</option>
        <option value="event">Events</option>
      </select>

      <select
        className={styles.select}
        value={filters.timeFrame}
        onChange={(e) => onFilterChange({ ...filters, timeFrame: e.target.value as ActivityFilters['timeFrame'] })}
      >
        <option value="upcoming">Upcoming</option>
        <option value="past">Past</option>
        <option value="all">All Time</option>
      </select>
    </div>
  );
};
