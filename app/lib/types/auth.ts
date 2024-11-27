// types/auth.ts
export type UserRole = 'coach' | 'swimmer' | 'admin';

export interface AuthError extends Error {
  status: number;
  code: string;
}