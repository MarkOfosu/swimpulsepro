
// components/activities/ActivityResponsesView.tsx
import React from 'react';
import styles from '@/styles/Activities.module.css';

interface ResponseCount {
  status: 'attending' | 'interested' | 'not_attending';
  count: number;
}

interface ActivityResponsesViewProps {
  responses: ResponseCount[];
}

export const ActivityResponsesView: React.FC<ActivityResponsesViewProps> = ({ responses }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attending':
        return 'bg-green-100 text-green-800';
      case 'interested':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_attending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex gap-4 mt-4">
      {responses.map((response) => (
        <div
          key={response.status}
          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(response.status)}`}
        >
          {response.status.replace('_', ' ')}: {response.count}
        </div>
      ))}
    </div>
  );
};
