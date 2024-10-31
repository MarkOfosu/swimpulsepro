// components/elements/activities/ActivityCard.tsx
import React from 'react';
import { Pencil, Trash2, Calendar, MapPin, Users } from 'lucide-react';
import { UpcomingActivity} from '@/app/lib/types';
import styles from './Activities.module.css';

interface ActivityCardProps {
  activity: UpcomingActivity;
  onEdit?: () => void;
  onDelete?: () => void;
  onRespond?: (status: 'attending' | 'interested' | 'not_attending') => void;
  responses?: Response[];
  userRole?: 'coach' | 'swimmer';
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onEdit,
  onDelete,
  onRespond,
  userRole
}) => {
  return (
    <div className={styles.activityCard}>
      <div className={styles.activityHeader}>
        <div className={styles.activityTitle}>
          <h3>{activity.title}</h3>
          <span className={styles.activityType}>
            {activity.activity_type}
          </span>
        </div>
        {userRole === 'coach' && (onEdit || onDelete) && (
          <div className={styles.activityActions}>
            {onEdit && (
              <button
                onClick={onEdit}
                className={styles.editButton}
                title="Edit Activity"
              >
                <Pencil size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className={styles.deleteButton}
                title="Delete Activity"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className={styles.activityContent}>
        {activity.description && (
          <p className={styles.description}>{activity.description}</p>
        )}

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <Calendar size={16} />
            <span>
              {new Date(activity.start_date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className={styles.detailItem}>
            <MapPin size={16} />
            <span>{activity.location}</span>
          </div>
          {activity.groups && activity.groups.length > 0 && (
            <div className={styles.detailItem}>
              <Users size={16} />
              <span>{activity.groups.map(g => g.name).join(', ')}</span>
            </div>
          )}
        </div>

        {activity.additional_details && (
          <div className={styles.additionalDetails}>
            {activity.additional_details.equipment_needed && (
              <div className={styles.detailItem}>
                <strong>Equipment:</strong> {activity.additional_details.equipment_needed}
              </div>
            )}
            {activity.additional_details.skill_level && (
              <div className={styles.detailItem}>
                <strong>Level:</strong> {activity.additional_details.skill_level}
              </div>
            )}
          </div>
        )}

        {userRole === 'swimmer' && onRespond && (
          <div className={styles.responseButtons}>
            <button
              onClick={() => onRespond('attending')}
              className={`${styles.responseButton} ${styles.attending}`}
            >
              Attending
            </button>
            <button
              onClick={() => onRespond('interested')}
              className={`${styles.responseButton} ${styles.interested}`}
            >
              Interested
            </button>
            <button
              onClick={() => onRespond('not_attending')}
              className={`${styles.responseButton} ${styles.notAttending}`}
            >
              Not Attending
            </button>
          </div>
        )}

        {activity.responses && activity.responses.length > 0 && (
          <div className={styles.responseStats}>
            {activity.responses.map((response) => (
              <span
                key={response.status}
                className={`${styles.responseStatus} ${styles[response.status]}`}
              >
                {response.status} ({response.count})
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;