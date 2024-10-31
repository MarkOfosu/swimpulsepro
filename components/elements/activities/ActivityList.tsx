
// components/activities/ActivityList.tsx
import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import styles from '../../../app/styles/Activities.module.css';
import { UpcomingActivity } from '../../../app/lib/types';

interface ActivityListProps {
  activities: UpcomingActivity[];
  userRole: 'coach' | 'swimmer';
  onRespond?: (activityId: string, status: 'attending' | 'interested' | 'not_attending') => Promise<void>;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  userRole,
  onRespond,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.container}>
      {activities.map((activity) => (
        <div key={activity.id} className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <div>
              <h3 className={styles.activityTitle}>{activity.title}</h3>
              <p className={styles.activityDate}>
                <Calendar size={16} className="inline mr-2" />
                {formatDate(activity.start_date)}
              </p>
            </div>
          </div>

          <div className={styles.activityDetails}>
            <p>{activity.description}</p>
            <p className={styles.activityLocation}>
              <MapPin size={16} />
              {activity.location}
            </p>

            <div className={styles.activityGroups}>
              {activity.groups.map((group) => (
                <span key={group.id} className={styles.groupTag}>
                  {group.name}
                </span>
              ))}
            </div>

            {userRole === 'swimmer' && onRespond && (
              <div className={styles.responseButtons}>
                <button
                  onClick={() => onRespond(activity.id, 'attending')}
                  className={`${styles.responseButton} ${styles.attending}`}
                >
                  Attending
                </button>
                <button
                  onClick={() => onRespond(activity.id, 'interested')}
                  className={`${styles.responseButton} ${styles.interested}`}
                >
                  Interested
                </button>
                <button
                  onClick={() => onRespond(activity.id, 'not_attending')}
                  className={`${styles.responseButton} ${styles.notAttending}`}
                >
                  Not Attending
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};