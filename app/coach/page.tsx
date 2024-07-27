// app/coach/page.tsx
import React from 'react';
import CoachLayout from '../layouts/CoachLayout';
import RootLayout from '../layout';

const CoachPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RootLayout layoutType="coach">
      <CoachLayout>{children}</CoachLayout>
    </RootLayout>
  );
};

export default CoachPage;
