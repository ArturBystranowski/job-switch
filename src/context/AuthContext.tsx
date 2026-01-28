import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { authService, type AuthResult } from '../services';
import type { AuthContextValue } from './AuthContext.types';

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize session on mount
    const initializeAuth = async () => {
      const { session: currentSession } = await authService.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    };

    initializeAuth();

    // Subscribe to auth state changes
    const subscription = authService.onAuthStateChange((newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string): Promise<AuthResult> => {
    const result = await authService.signIn(email, password);
    return result;
  };

  const handleSignUp = async (email: string, password: string): Promise<AuthResult> => {
    const result = await authService.signUp(email, password);
    return result;
  };

  const handleSignOut = async (): Promise<void> => {
    await authService.signOut();
  };

  const handleResetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const result = await authService.resetPasswordForEmail(email);
    return result;
  };

  const handleUpdatePassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
    const result = await authService.updatePassword(password);
    return result;
  };

  const value: AuthContextValue = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
