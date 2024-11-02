// components/elements/activities/ResponseSummary.tsx
'use client';

import React from 'react';
import { 
  Users, 
  ThumbsUp, 
  Clock, 
  ThumbsDown,
  CheckCircle,
  HelpCircle,
  XCircle 
} from 'lucide-react';
import { ResponseSummaryProps } from '../../../app/lib/types';
import styles from '@/styles/ResponseSummary.module.css';

export const ResponseSummary: React.FC<ResponseSummaryProps> = ({ 
  summary, 
  isCoach 
}) => {
  const {
    total_responses,
    status_counts,
    attending_swimmers
  } = summary.summary;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'attending':
        return <CheckCircle className={styles.attendingIcon} />;
      case 'interested':
        return <HelpCircle className={styles.interestedIcon} />;
      case 'not_attending':
        return <XCircle className={styles.notAttendingIcon} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.summaryHeader}>
        <h3>Response Summary</h3>
        <div className={styles.totalResponses}>
          <Users className={styles.icon} />
          <span>{total_responses} total responses</span>
        </div>
      </div>

      <div className={styles.statusCounts}>
        {Object.entries(status_counts).map(([status, count]) => (
          <div key={status} className={`${styles.statusItem} ${styles[status]}`}>
            {getStatusIcon(status)}
            <span className={styles.count}>{count}</span>
            <span className={styles.label}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        ))}
      </div>

      {attending_swimmers && attending_swimmers.length > 0 && (
        <div className={styles.attendingList}>
          <h4>
            <CheckCircle className={styles.attendingIcon} />
            Attending Swimmers
          </h4>
          <ul>
            {attending_swimmers.map((swimmer, index) => (
              <li key={isCoach ? swimmer.id : index}>
                {swimmer.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.user_response && (
        <div className={styles.userResponse}>
          <h4>Your Response</h4>
          <div className={`${styles.responseStatus} ${styles[summary.user_response.status]}`}>
            {getStatusIcon(summary.user_response.status)}
            <span>{summary.user_response.status}</span>
          </div>
          {summary.user_response.additional_info && (
            <p className={styles.additionalInfo}>
              {summary.user_response.additional_info}
            </p>
          )}
        </div>
      )}
    </div>
  );
};