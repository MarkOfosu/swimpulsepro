// actions.ts
'use server'

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function logout() {
  try {
    const cookieStore = cookies();
    const supabase = createClient();
    
    // Sign out from Supabase server-side
    await supabase.auth.signOut();

    // Clear all cookies
    for (const cookie of cookieStore.getAll()) {
      cookieStore.delete(cookie.name);
    }

    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Server-side logout error:', error);
    return { success: false, message: 'Failed to logout' };
  }
}
