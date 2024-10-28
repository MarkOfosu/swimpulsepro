// app/auth/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('message') || 'An authentication error occurred';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-xl font-bold text-red-600">Authentication Error</h1>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-4 rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}