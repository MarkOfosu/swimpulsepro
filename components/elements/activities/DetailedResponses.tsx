// components/elements/activities/DetailedResponses.tsx
'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, 
  HelpCircle, 
  XCircle,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { DetailedResponsesProps, ActivityResponseStatus } from '../../../app/lib/types';
import styles from '@/styles/DetailedResponses.module.css';

export const DetailedResponses: React.FC<DetailedResponsesProps> = ({ 
  responses,
  onResponseUpdate 
}) => {
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set());

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
  );
};