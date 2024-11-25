
// app/user/coach/activity/[id]/ActivityDetail.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DashboardUtils } from '@/app/api/dashboard/dashboardUtils';
import { UpcomingActivity } from '@app/lib/types';
import { CoachActivityResponses } from '@/components/elements/activities/CoachActivityResponses';
import Loader from '@/components/elements/Loader';
import { Button } from '@/components/elements/Button';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft,
  RefreshCw,
  Edit,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import styles from '../../../../styles/ActivityDetails.module.css';
import { toast } from 'react-hot-toast';

export default function ActivityDetails() {
  const params = useParams();
  const activityId = params.id as string;
  const [activity, setActivity] = useState<UpcomingActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dashboardUtils, setDashboardUtils] = useState<DashboardUtils | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      if (userId) {
        setDashboardUtils(new DashboardUtils(userId, 'coach'));
      }
    }
  }, []);

  const fetchActivityDetails = async () => {
    if (!dashboardUtils) return;
    
    try {
      setLoading(true);
      const response = await dashboardUtils.fetchUpcomingActivities({});
      const activityDetail = response.data.find(a => a.id === activityId);
      
      if (activityDetail) {
        setActivity(activityDetail);
      } else {
        toast.error('Activity not found');
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
      toast.error('Failed to load activity details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dashboardUtils) {
      fetchActivityDetails();
    }
  }, [activityId, dashboardUtils]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success('Responses refreshed');
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className={styles.error}>
        <h2>Activity not found</h2>
        <Link href="/user/coach/activity" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back to Activities
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/user/coach/activity" className={styles.backLink}>
            <ArrowLeft size={20} />
            Back to Activities
          </Link>
          <div className={styles.headerActions}>
            <Button 
              onClick={handleRefresh}
              variant="secondary"
              className={styles.refreshButton}
            >
              <RefreshCw size={16} />
              Refresh Responses
            </Button>
            <Link href={`/user/coach/activity/edit/${activityId}`}>
              <Button variant="secondary" className={styles.editButton}>
                <Edit size={16} />
                Edit Activity
              </Button>
            </Link>
          </div>
        </div>

        <div className={styles.titleSection}>
          <h1>{activity.title}</h1>
          <span className={styles.activityType}>
            {activity.activity_type}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Activity Details Section */}
        <div className={styles.activityDetails}>
          <div className={styles.mainInfo}>
            {activity.description && (
              <p className={styles.description}>{activity.description}</p>
            )}
            
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <Calendar className={styles.icon} />
                <div>
                  <strong>Date</strong>
                  <span>
                    {format(new Date(activity.start_date), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <Clock className={styles.icon} />
                <div>
                  <strong>Time</strong>
                  <span>
                    {format(new Date(activity.start_date), 'h:mm a')}
                    {activity.end_date && (
                      ` - ${format(new Date(activity.end_date), 'h:mm a')}`
                    )}
                  </span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <MapPin className={styles.icon} />
                <div>
                  <strong>Location</strong>
                  <span>{activity.location}</span>
                </div>
              </div>

              {activity.groups && activity.groups.length > 0 && (
                <div className={styles.detailItem}>
                  <Users className={styles.icon} />
                  <div>
                    <strong>Groups</strong>
                    <span>{activity.groups.map(g => g.name).join(', ')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Details */}
            {activity.additional_details && (
              Object.keys(activity.additional_details).some(key => 
                activity.additional_details[key as keyof typeof activity.additional_details]
              ) && (
                <div className={styles.additionalDetails}>
                  <h3>
                    <Info size={20} />
                    Additional Information
                  </h3>
                  {activity.additional_details.equipment_needed && (
                    <div className={styles.additionalItem}>
                      <strong>Equipment Needed:</strong>
                      <p>{activity.additional_details.equipment_needed}</p>
                    </div>
                  )}
                  {activity.additional_details.preparation_notes && (
                    <div className={styles.additionalItem}>
                      <strong>Preparation Notes:</strong>
                      <p>{activity.additional_details.preparation_notes}</p>
                    </div>
                  )}
                  {activity.additional_details.skill_level && 
                   activity.additional_details.skill_level !== 'all' && (
                    <div className={styles.additionalItem}>
                      <strong>Skill Level:</strong>
                      <p>{activity.additional_details.skill_level}</p>
                    </div>
                  )}
                  {activity.additional_details.capacity_limit && (
                    <div className={styles.additionalItem}>
                      <strong>Capacity Limit:</strong>
                      <p>{activity.additional_details.capacity_limit}</p>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Responses Section */}
        <div className={styles.responsesSection}>
          <div className={styles.responsesSectionHeader}>
            <h2>Activity Responses</h2>
            <Button 
              onClick={handleRefresh}
              variant="secondary"
              className={styles.refreshButton}
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>
          
          <div className={styles.responsesContainer}>
            <CoachActivityResponses
              activityId={activity.id}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </div>
    </div>
  );
}