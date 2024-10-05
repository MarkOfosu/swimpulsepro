import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserRole(supabase: SupabaseClient<any, "public", any>, userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
  
    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  
    return data?.role;
  }
