
'use client';

import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { UpcomingActivity } from '../../../app/lib/types';
import styles from '../../styles/UpcomingActivities.module.css';

interface UpcomingActivitiesProps {
  activities: UpcomingActivity[];
  loading?: boolean;
  error?: string | null;
  onRespond?: (activityId: string, status: 'attending' | 'interested' | 'not_attending') => void;
  userRole?: 'coach' | 'swimmer';
  showResponses?: boolean;
}

export const UpcomingActivities: React.FC<UpcomingActivitiesProps> = ({
  activities,
  loading,
  error,
  onRespond,
  userRole = 'swimmer',
  showResponses = true
}) => {
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.upcomingActivities}>
      {activities.map((activity) => (
        <div key={activity.id} className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <Calendar size={18} />
            <h3>{activity.title}</h3>
          </div>
          
          <div className={styles.activityDetails}>
            <p className={styles.activityTime}>
              <Clock size={14} />
              {new Date(activity.start_date).toLocaleDateString()}
              {activity.end_date && ` - ${new Date(activity.end_date).toLocaleDateString()}`}
            </p>
            
            <p className={styles.activityLocation}>
              <MapPin size={14} />
              {activity.location}
            </p>

            {userRole === 'coach' && (
              <p className={styles.activityGroups}>
                <Users size={14} />
                {activity.groups.map(g => g.name).join(', ')}
              </p>
            )}
          </div>

          {activity.description && (
            <p className={styles.activityDescription}>{activity.description}</p>
          )}

          {showResponses && activity.responses && (
            <div className={styles.responses}>
              <div className={styles.responseStats}>
                {activity.responses.map(response => (
                  <span key={response.status} className={styles.responseStat}>
                    {response.count} {response.status}
                  </span>
                ))}
              </div>

              {userRole === 'swimmer' && onRespond && (
                <div className={styles.responseButtons}>
                  <button
                    onClick={() => onRespond(activity.id, 'attending')}
                    className={styles.attendButton}
                  >
                    Attending
                  </button>
                  <button
                    onClick={() => onRespond(activity.id, 'interested')}
                    className={styles.interestedButton}
                  >
                    Interested
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {loading && <div className={styles.loading}>Loading...</div>}
      
      {activities.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <p>No upcoming activities</p>
        </div>
      )}
    </div>
  );
};