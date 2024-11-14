// accountService.ts

import { createClient } from '@utils/supabase/client';
import { DeletionReason } from '../lib/constants';

interface DeleteAccountParams {
  userId: string;
  email: string;
  reasonType: DeletionReason;
  reasonDetails?: string;
}

interface CheckEmailParams {
  email: string;
}

interface ChangePasswordParams {
  newPassword: string;
}

interface ResetPasswordParams {
  email: string;
  redirectUrl?: string;
}

class AccountService {
  private supabase = createClient();

  /**
   * Change password for logged-in user
   */
  async changePassword({ newPassword }: ChangePasswordParams) {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }

      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Initiate password reset via email
   * This sends a magic link that logs the user in and redirects to password reset page
   */
  async forgotPassword({ email, redirectUrl }: ResetPasswordParams) {
    try {
      // Always use hyphenated URL for consistency
      const finalRedirectUrl = redirectUrl || `${window.location.origin}/auth/resetPassword`;
      
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: finalRedirectUrl
      });

      if (error) {
        console.error('Error in forgotPassword:', error);
      }
      
      // Always return success for security (don't reveal if email exists)
      return { success: true };
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      // Always return success for security
      return { success: true };
    }
  }

  /**
   * Update password after magic link login
   * This should be called from the reset password page
   */
  async updatePassword(newPassword: string) {
    try {
      // Verify we have an active session from magic link
      const { data: { session } } = await this.supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No valid session. Please use the reset link from your email.');
      }

      // Update the password
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      // Sign out after successful password change
      await this.supabase.auth.signOut();

      return { success: true };
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  /**
   * Get current session status
   * Useful for checking if magic link login was successful
   */
  async getSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      return { session, error };
    } catch (error) {
      console.error('Error getting session:', error);
      return { session: null, error };
    }
  }

  async deleteAccount({
    userId,
    email,
    reasonType,
    reasonDetails
  }: DeleteAccountParams) {
    try {
      if (!reasonType) {
        throw new Error('Deletion reason is required');
      }

      const { data: deleteResult, error: deleteError } = await this.supabase.rpc(
        'delete_own_account',
        {
          p_reason: reasonType,
          p_reason_details: reasonDetails || null
        }
      );

      if (deleteError) {
        console.error('Error deleting account:', deleteError);
        throw deleteError;
      }

      if (!deleteResult?.success) {
        throw new Error(deleteResult?.error || 'Failed to delete account');
      }

      await this.supabase.auth.signOut({
        scope: 'global'
      });

      return { success: true };
    } catch (error) {
      console.error('Error in deleteAccount:', error);
      throw error;
    }
  }
}

export const accountService = new AccountService();