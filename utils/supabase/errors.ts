import { AuthError } from '@supabase/supabase-js';

export class SupabaseAuthError extends AuthError {
    constructor(
      message: string,
      public status: number = 401,
      public code: string = 'AUTH_ERROR'
    ) {
      super(message);
      this.name = 'SupabaseAuthError';
      this.__isAuthError = true;
    }
  }