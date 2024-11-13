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

  async changePassword({ newPassword }: ChangePasswordParams) {
    try {
      const { data: updateData, error: updateError } = await this.supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  

  async resetPasswordForEmail(email: string, redirectUrl?: string) {
    try {
      const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw error;
    }
  }

  async forgotPassword({ email, redirectUrl }: ResetPasswordParams) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl || `${window.location.origin}/auth/resetPassword`
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: true }; // Always return success for security
    }
  }

  async resetPassword(newPassword: string) {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw error;
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

      // Delete account with reason
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