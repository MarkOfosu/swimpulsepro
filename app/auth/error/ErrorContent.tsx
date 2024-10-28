// app/auth/error/ErrorContent.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('message') || 'An authentication error occurred';

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}