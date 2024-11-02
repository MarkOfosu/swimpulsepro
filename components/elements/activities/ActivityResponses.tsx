// components/elements/activities/ActivityResponses.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '../../../app/context/UserContext';
import { DashboardUtils } from '../../../app/api/dashboard/dashboardUtils';
import { 
  ActivityResponseDetails, 
  ActivityResponseSummary,
  ActivityResponseStatus,
  ActivityResponsesProps 
} from '../../../app/lib/types';
import { ResponseSummary } from './ResponseSummary';
import { DetailedResponses } from './DetailedResponses';
import  Loader  from '../Loader';
import styles from '@/styles/ActivityResponses.module.css';

export const ActivityResponses: React.FC<ActivityResponsesProps> = ({ 
  activityId, 
  showDetailedView = false,
  onResponseUpdate 
}) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<ActivityResponseDetails[]>([]);
  const [summary, setSummary] = useState<ActivityResponseSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dashboardUtils, setDashboardUtils] = useState<DashboardUtils | null>(null);

  useEffect(() => {
    if (user?.id) {
      setDashboardUtils(new DashboardUtils(user.id, user.role));
    }
  }, [user?.id, user?.role]);

  const fetchResponses = async () => {
    if (!dashboardUtils || !user?.id) return;
    
    try {
      setLoading(true);
      setError(null);

      if (user.role === 'coach' && showDetailedView) {
        const detailedResponses = await dashboardUtils.getActivityResponses(activityId);
        if (Array.isArray(detailedResponses)) {
          setResponses(detailedResponses);
        }
      }

      const responseSummary = await dashboardUtils.getActivityResponseSummary(activityId);
      setSummary(responseSummary);
    } catch (err) {
      console.error('Error fetching responses:', err);
      setError('Failed to load responses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, [activityId, dashboardUtils, showDetailedView]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {summary && (
        <ResponseSummary 
          summary={summary} 
          isCoach={user?.role === 'coach'} 
        />
      )}
      
      {showDetailedView && user?.role === 'coach' && responses.length > 0 && (
        <DetailedResponses 
          responses={responses} 
          onResponseUpdate={onResponseUpdate} 
        />
      )}
    </div>
  );
};