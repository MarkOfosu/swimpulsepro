// components/elements/activities/CoachActivityResponses.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle,
  HelpCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { DashboardUtils } from '@/app/api/dashboard/dashboardUtils';
import {
  ActivityResponseDetails,
  ActivityResponseSummary,
  ActivityResponseStatus
} from '@/app/lib/types';
import Loader from '@/components/elements/Loader';
import styles from '../../styles/CoachActivityResponses.module.css';

interface CoachActivityResponsesProps {
  activityId: string;
  refreshTrigger?: number;
}

export const CoachActivityResponses: React.FC<CoachActivityResponsesProps> = ({
  activityId,
  refreshTrigger
}) => {
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<ActivityResponseDetails[]>([]);
  const [summary, setSummary] = useState<ActivityResponseSummary | null>(null);
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set());
  const [dashboardUtils, setDashboardUtils] = useState<DashboardUtils | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get user ID and role from your auth context or localStorage
      const userId = localStorage.getItem('userId');
      if (userId) {
        setDashboardUtils(new DashboardUtils(userId, 'coach'));
      }
    }
  }, []);

  const fetchResponses = async () => {
    if (!dashboardUtils) return;
    
    try {
      setLoading(true);
      setError(null);

      const [detailedResponses, responseSummary] = await Promise.all([
        dashboardUtils.getActivityResponses(activityId),
        dashboardUtils.getActivityResponseSummary(activityId)
      ]);

      setResponses(detailedResponses);
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
  }, [activityId, dashboardUtils, refreshTrigger]);

  const toggleResponse = (swimmerId: string) => {
    const newExpanded = new Set(expandedResponses);
    if (newExpanded.has(swimmerId)) {
      newExpanded.delete(swimmerId);
    } else {
      newExpanded.add(swimmerId);
    }
    setExpandedResponses(newExpanded);
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

  if (error) {
    return (
      <div className={styles.error}>
        <AlertTriangle />
        <p>{error}</p>
      </div>
    );
  }

  const groupedResponses = responses.reduce((acc, response) => {
    const status = response.response_status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(response);
    return acc;
  }, {} as Record<ActivityResponseStatus, typeof responses>);

  return (
    <div className={styles.container}>
      {/* Response Summary */}
      {summary && (
        <div className={styles.summary}>
          <div className={styles.summaryHeader}>
            <h3>Response Summary</h3>
            <div className={styles.totalResponses}>
              <Users className={styles.icon} />
              <span>{summary.summary.total_responses} total responses</span>
            </div>
          </div>

          <div className={styles.statusCounts}>
            {Object.entries(summary.summary.status_counts).map(([status, count]) => (
              <div key={status} className={`${styles.statusCount} ${styles[status]}`}>
                {getStatusIcon(status as ActivityResponseStatus)}
                <span className={styles.count}>{count}</span>
                <span className={styles.label}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Responses */}
      <div className={styles.detailedResponses}>
        <h3>Detailed Responses</h3>
        
        {Object.entries(groupedResponses).map(([status, statusResponses]) => (
          <div key={status} className={styles.statusGroup}>
            <h4 className={`${styles.statusHeader} ${styles[status]}`}>
              {getStatusIcon(status as ActivityResponseStatus)}
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className={styles.count}>({statusResponses.length})</span>
            </h4>

            <div className={styles.responsesList}>
              {statusResponses.map((response) => (
                <div 
                  key={response.swimmer_id} 
                  className={styles.responseItem}
                >
                  <div 
                    className={styles.responseHeader}
                    onClick={() => toggleResponse(response.swimmer_id)}
                  >
                    <div className={styles.swimmerInfo}>
                      <span className={styles.swimmerName}>
                        {response.first_name} {response.last_name}
                      </span>
                      <span className={styles.responseTime}>
                        <Clock size={14} />
                        {format(new Date(response.status_updated_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    
                    {response.additional_info && (
                      <button 
                        className={styles.expandButton}
                        aria-label={expandedResponses.has(response.swimmer_id) ? 
                          "Show less" : "Show more"}
                      >
                        {expandedResponses.has(response.swimmer_id) ? 
                          <ChevronUp size={20} /> : 
                          <ChevronDown size={20} />
                        }
                      </button>
                    )}
                  </div>

                  {expandedResponses.has(response.swimmer_id) && 
                   response.additional_info && (
                    <div className={styles.additionalInfo}>
                      {response.additional_info}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};