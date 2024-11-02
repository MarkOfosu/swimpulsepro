
// components/elements/activities/SwimmerActivityResponses.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  HelpCircle,
  XCircle,
  Users,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/elements/Button';
import { DashboardUtils } from '@/app/api/dashboard/dashboardUtils';
import {
  ActivityResponseStatus,
  ActivityResponseSummary,
  UpcomingActivity
} from '@/app/lib/types';
import { ResponseModal } from './ResponseModal'
import Loader from '@/components/elements/Loader';
import styles from '@/styles/SwimmerActivityResponses.module.css';
import { toast } from 'react-hot-toast';

interface SwimmerActivityResponsesProps {
  activity: UpcomingActivity;
  onResponseUpdate?: () => void;
}

export const SwimmerActivityResponses: React.FC<SwimmerActivityResponsesProps> = ({
  activity,
  onResponseUpdate
}) => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ActivityResponseSummary | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [dashboardUtils, setDashboardUtils] = useState<DashboardUtils | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      if (userId) {
        setDashboardUtils(new DashboardUtils(userId, 'swimmer'));
      }
    }
  }, []);

  const fetchResponses = async () => {
    if (!dashboardUtils) return;
    
    try {
      setLoading(true);
      const responseSummary = await dashboardUtils.getActivityResponseSummary(activity.id);
      setSummary(responseSummary);
    } catch (err) {
      console.error('Error fetching response summary:', err);
      toast.error('Failed to load responses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, [activity.id, dashboardUtils]);

  const handleResponse = async (status: ActivityResponseStatus, additionalInfo?: string) => {
    if (!dashboardUtils) return;
    
    try {
      await dashboardUtils.respondToActivity(activity.id, status, additionalInfo);
      await fetchResponses();
      setShowResponseModal(false);
      onResponseUpdate?.();
      toast.success('Response submitted successfully');
    } catch (err) {
      console.error('Error submitting response:', err);
      toast.error('Failed to submit response');
    }
  };

  const getStatusIcon = (status: ActivityResponseStatus) => {
    switch (status) {
      case 'attending':
        return <CheckCircle className={styles.attendingIcon} />;
      case 'interested':
        return <HelpCircle className={styles.interestedIcon} />;
      case 'not_attending':
        return <XCircle className={styles.notAttendingIcon} />;
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {summary && (
        <>
          <div className={styles.summary}>
            <div className={styles.totalResponses}>
              <Users className={styles.icon} />
              <span>{summary.summary.total_responses} responses</span>
            </div>

            <div className={styles.statusCounts}>
              {Object.entries(summary.summary.status_counts).map(([status, count]) => (
                <div key={status} className={`${styles.statusCount} ${styles[status]}`}>
                  {getStatusIcon(status as ActivityResponseStatus)}
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {summary.summary.attending_swimmers.length > 0 && (
            <div className={styles.attendingSwimmers}>
              <h4>Who's Going</h4>
              <div className={styles.swimmerList}>
                {summary.summary.attending_swimmers.map((swimmer, index) => (
                  <span key={index} className={styles.swimmerName}>
                    {swimmer.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.userResponse}>
            {summary.user_response ? (
              <>
                <div className={`${styles.currentResponse} ${styles[summary.user_response.status]}`}>
                  {getStatusIcon(summary.user_response.status)}
                  <span>You are {summary.user_response.status}</span>
                </div>
                {summary.user_response.additional_info && (
                  <div className={styles.additionalInfo}>
                    <MessageSquare size={14} />
                    <p>{summary.user_response.additional_info}</p>
                  </div>
                )}
                <Button
                  onClick={() => setShowResponseModal(true)}
                  variant="secondary"
                  className={styles.changeResponse}
                >
                  Change Response
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowResponseModal(true)}
                variant="primary"
                className={styles.respondButton}
              >
                Respond to Activity
              </Button>
            )}
          </div>
        </>
      )}

      <ResponseModal
        isOpen={showResponseModal}
        onClose={() => setShowResponseModal(false)}
        onSubmit={handleResponse}
        activity={activity}
        initialStatus={summary?.user_response?.status}
        initialInfo={summary?.user_response?.additional_info}
      />
    </div>
  );
};