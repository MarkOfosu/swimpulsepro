'use server'

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
// import { useRouter } from 'next/navigation';
import React from 'react';

export async function logout() {
  // const router = useRouter();
  const supabase = createClient();
  await supabase.auth.signOut();
  return { success: true, message: 'Logged out successfully' }; 
  // router.push('/login');
}

