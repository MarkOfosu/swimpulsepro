'use client';

import React from 'react';
import { Activity, Clock, Award, User } from 'lucide-react';
import { ActivityFeedItem } from '../../../app/lib/types';
import styles from '../../styles/ActivityFeed.module.css';

interface ActivityFeedProps {
  activities: ActivityFeedItem[];
  loading?: boolean;
  error?: string | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  loading,
  error,
  onLoadMore,
  hasMore
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Award size={16} />;
      case 'swim_result':
        return <Activity size={16} />;
      case 'badge_earned':
        return <Award size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.activityFeed}>
      {activities.map((activity) => (
        <div key={activity.id} className={styles.activityItem}>
          <div className={styles.activityIcon}>
            {getActivityIcon(activity.activity_type)}
          </div>
          <div className={styles.activityContent}>
            <p className={styles.activityTitle}>{activity.title}</p>
            <p className={styles.activityDescription}>{activity.description}</p>
            <div className={styles.activityMeta}>
              <span className={styles.activityTime}>
                <Clock size={14} />
                {new Date(activity.created_at).toLocaleDateString()}
              </span>
              <span className={styles.activityUser}>
                <User size={14} />
                {activity.swimmer.profiles.first_name} {activity.swimmer.profiles.last_name}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      {loading && <div className={styles.loading}>Loading...</div>}
      
      {hasMore && !loading && (
        <button 
          onClick={onLoadMore} 
          className={styles.loadMoreButton}
        >
          Load More
        </button>
      )}
      
      {activities.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <p>No recent activities</p>
        </div>
      )}
    </div>
  );
};