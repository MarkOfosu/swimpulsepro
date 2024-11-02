// components/elements/activities/CoachActivityCard.tsx
'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Pencil,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { UpcomingActivity } from '@/app/lib/types';
import { CoachActivityResponses } from './CoachActivityResponses';
import styles from '../../styles/CoachActivityCard.module.css';

interface CoachActivityCardProps {
  activity: UpcomingActivity;
  onEdit: (activity: UpcomingActivity) => void;
  onDelete: (activityId: string) => void;
}

export const CoachActivityCard: React.FC<CoachActivityCardProps> = ({
  activity,
  onEdit,
  onDelete
}) => {
  const [showResponses, setShowResponses] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className={styles.activityCard}>
      <div className={styles.activityHeader}>
        <div className={styles.activityTitle}>
          <h3>{activity.title}</h3>
          <span className={styles.activityType}>
            {activity.activity_type}
          </span>
        </div>
        <div className={styles.activityActions}>
          <button
            onClick={() => onEdit(activity)}
            className={styles.editButton}
            title="Edit Activity"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            className={styles.deleteButton}
            title="Delete Activity"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className={styles.activityContent}>
        <p className={styles.description}>{activity.description}</p>
        
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <Calendar size={16} />
            <span>
              {format(new Date(activity.start_date), 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
          <div className={styles.detailItem}>
            <Clock size={16} />
            <span>
              {format(new Date(activity.start_date), 'h:mm a')}
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

        <div className={styles.responsesSection}>
          <button
            onClick={() => {
              setShowResponses(!showResponses);
              if (!showResponses) {
                setRefreshTrigger(prev => prev + 1);
              }
            }}
            className={styles.toggleResponses}
          >
            <span>
              {showResponses ? 'Hide Responses' : 'Show Responses'}
              {activity.responses && activity.responses.length > 0 && (
                <span className={styles.responseCount}>
                  ({activity.responses.length})
                </span>
              )}
            </span>
            {showResponses ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showResponses && (
            <div className={styles.responsesContainer}>
              <CoachActivityResponses
                activityId={activity.id}
                refreshTrigger={refreshTrigger}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};