// app/auth/confirm/page.tsx
'use client';

import { Suspense } from 'react';
import AuthConfirmContent from './AuthConfirmContent';
import Loader from '@/components/elements/Loader'; 


export default function AuthConfirmPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
           <Loader />
          </div>
        </div>
      }
    >
      <AuthConfirmContent />
    </Suspense>
  );
}