// components/elements/activities/SwimmerActivitiesList.tsx
import styles from '../../../styles/SwimmerActivityList.module.css';
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Info } from 'lucide-react';
import { Button } from '@/components/elements/Button';
import { ActivityResponseModal } from '../../../../components/elements/activities/ActivityResponseModal';
import { UpcomingActivity, ActivityResponseStatus } from '../../../lib/types';


interface SwimmerActivitiesListProps {
  activities: UpcomingActivity[];
  responses: { activityId: string; status: ActivityResponseStatus }[];
  onRespond: (
    activityId: string, 
    status: ActivityResponseStatus,
    additionalInfo?: string
  ) => Promise<void>;
  isLoading?: boolean;
  currentResponse?: {
    activityId: string;
    status: ActivityResponseStatus;
  };
}

const SwimmerActivitiesList: React.FC<SwimmerActivitiesListProps> = ({
  activities,
  onRespond,
  isLoading = false,
  currentResponse
}) => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseLoading, setResponseLoading] = useState<string | null>(null);

  const handleResponse = async (
    activityId: string,
    status: ActivityResponseStatus,
    additionalInfo?: string
  ) => {
    try {
      setResponseLoading(activityId);
      await onRespond(activityId, status, additionalInfo);
      setIsResponseModalOpen(false);
      setSelectedActivity(null);
    } catch (error) {
      console.error('Error responding to activity:', error);
    } finally {
      setResponseLoading(null);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading activities...</div>;
  }

  if (activities.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Calendar size={48} className={styles.emptyIcon} />
        <h3>No Upcoming Activities</h3>
        <p>There are no activities scheduled at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.activityList}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.activityCard}>
            <div className={styles.activityHeader}>
              <div className={styles.activityTitle}>
                <h3>{activity.title}</h3>
                <span className={styles.activityType}>
                  {activity.activity_type}
                </span>
              </div>

              {activity.additional_details?.skill_level && 
                activity.additional_details.skill_level !== 'all' && (
                <span className={styles.skillLevel}>
                  {activity.additional_details.skill_level}
                </span>
              )}
            </div>
            
            <div className={styles.activityBody}>
              {activity.description && (
                <p className={styles.description}>{activity.description}</p>
              )}
              
              <div className={styles.activityDetails}>
                <div className={styles.detailItem}>
                  <Calendar size={16} className={styles.icon} />
                  <span>{formatDateTime(activity.start_date)}</span>
                </div>
                
                {activity.end_date && (
                  <div className={styles.detailItem}>
                    <Clock size={16} className={styles.icon} />
                    <span>Until {formatDateTime(activity.end_date)}</span>
                  </div>
                )}
                
                <div className={styles.detailItem}>
                  <MapPin size={16} className={styles.icon} />
                  <span>{activity.location}</span>
                </div>

                {activity.groups.length > 0 && (
                  <div className={styles.detailItem}>
                    <Users size={16} className={styles.icon} />
                    <span>{activity.groups.map(g => g.name).join(', ')}</span>
                  </div>
                )}
              </div>

              {activity.additional_details && (
                <div className={styles.additionalInfo}>
                  {activity.additional_details.equipment_needed && (
                    <div className={styles.infoItem}>
                      <Info size={16} className={styles.icon} />
                      <span>Equipment needed: {activity.additional_details.equipment_needed}</span>
                    </div>
                  )}
                  {activity.additional_details.preparation_notes && (
                    <div className={styles.infoItem}>
                      <Info size={16} className={styles.icon} />
                      <span>{activity.additional_details.preparation_notes}</span>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.responseButtons}>
  
            <Button
            onClick={() => {
                console.log('Button clicked');
                setSelectedActivity(activity.id);
                setIsResponseModalOpen(true);
            }}
            className={styles.respondButton}
            disabled={responseLoading === activity.id}
            >
            Respond to Activity
            </Button>

            {selectedActivity && isResponseModalOpen && (
            <ActivityResponseModal
                isOpen={isResponseModalOpen}
                onClose={() => {
                setIsResponseModalOpen(false);
                setSelectedActivity(null);
                }}
                onSubmit={async (status, additionalInfo) => {
                await handleResponse(selectedActivity, status, additionalInfo);
                }}
                activity={activities.find(a => a.id === selectedActivity)!}
                initialStatus={currentResponse?.activityId === selectedActivity ? 
                currentResponse.status : undefined}
            />
            )}
            </div>
            </div>
        </div>
        ))}
    </div>
    </>
);
};

export  default SwimmerActivitiesList ;