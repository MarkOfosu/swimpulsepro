// components/activities/EmptyState.tsx
import React from 'react';
import { Calendar } from 'lucide-react';

export const EmptyState: React.FC<{ message?: string }> = ({ 
  message = "No activities found" 
}) => {
  return (
    <div className="text-center py-12">
      <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};
