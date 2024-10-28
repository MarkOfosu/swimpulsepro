// app/auth/confirm/AuthConfirmContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AuthConfirmContent() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        if (!token_hash || !type) {
          throw new Error('Missing confirmation parameters');
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any
        });

        if (error) throw error;

        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const role = user.user_metadata.role;
          router.push(role === 'coach' ? '/user/coach/swimGroup' : '/user/swimmer/dashboard');
        } else {
          router.push('/auth/login');
        }

      } catch (err) {
        console.error('Verification error:', err);
        setError(err instanceof Error ? err.message : 'Verification failed');
      } finally {
        setLoading(false);
      }
    };

    handleConfirmation();
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Email Verified Successfully!</h2>
        <p className="text-gray-600">Redirecting you to your dashboard...</p>
      </div>
    </div>
  );
}