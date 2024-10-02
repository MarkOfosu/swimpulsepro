"use client";
import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ContentRootLayout from '@app/layouts/ContentRootlayout';
import { createClient } from '@utils/supabase/client';
import { Session } from '@supabase/supabase-js';

const CoachPageLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const links = [
    { href: '/user/coach/dashboard', label: 'Dashboard' },
    { href: '/user/coach/swimGroup', label: 'Swim Groups' },
    { href: '/user/coach/analytics', label: 'Analytics' },
    { href: '/user/coach/workout', label: 'Workout' },
    { href: '/user/coach/metrics', label: 'Create Metric' },
  ];

  return (
    <ContentRootLayout links={links}>
      {children}
    </ContentRootLayout>
  );
};

export default CoachPageLayout;
