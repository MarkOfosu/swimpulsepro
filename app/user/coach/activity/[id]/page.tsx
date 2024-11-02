// app/user/coach/activity/[id]/page.tsx
'use client';

import ActivityDetails from './ActivityDetails';
import { useUser } from '../../../../../app/context/UserContext';
import Loader from '@/components/elements/Loader';
import CoachPageLayout from '../../CoachPageLayout';

export default function ActivityDetailPage() {
  const { user, loading, error } = useUser();

  if (loading) {
    return (
      <CoachPageLayout>
        <Loader />
      </CoachPageLayout>
    );
  }

  if (error || !user) {
    return (
      <CoachPageLayout>
        <div className="text-red-500 p-4">
          {error || 'No user found. Please log in again.'}
        </div>
      </CoachPageLayout>
    );
  }

  return (
    <CoachPageLayout>
      <ActivityDetails />
    </CoachPageLayout>
  );
}