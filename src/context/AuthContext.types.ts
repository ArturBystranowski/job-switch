import type { Session, User } from '@supabase/supabase-js';
import type { AuthResult } from '../services';

export interface PasswordResetResult {
  success: boolean;
  error?: string;
}

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<PasswordResetResult>;
  updatePassword: (password: string) => Promise<PasswordResetResult>;
}
