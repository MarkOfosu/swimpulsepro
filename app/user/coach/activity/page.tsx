// app/user/coach/activity/page.tsx
'use client';
import React from 'react';
import CoachPageLayout from '../CoachPageLayout';
import Activities from './Activities';
import { useUser } from '../../../context/UserContext';
import Loader from '@/components/elements/Loader';

export default function CoachActivitiesPage() {
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
      <Activities />
    </CoachPageLayout>
  );
}