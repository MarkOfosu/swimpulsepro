'use server'

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  // Return a status that can be used client-side to trigger further actions
  return { success: true, message: 'Logged out successfully' };
}
