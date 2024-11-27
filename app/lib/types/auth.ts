// types/auth.ts
export type UserRole = 'coach' | 'swimmer' | 'admin';

export interface AuthError extends Error {
  status: number;
  code: string;
}

export interface BaseUserData {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'swimmer' | 'coach';
    date_of_birth: Date | null;
    gender?: string;
    isVerified?: boolean;
  }
  
  export interface SwimmerData extends BaseUserData {
    role: 'swimmer';
    group_id?: string;
    group_name?: string;
    coach_first_name?: string;
    coach_last_name?: string;
  }
  
  export interface CoachData extends BaseUserData {
    role: 'coach';
    team_name?: string;
    team_location?: string;
  }