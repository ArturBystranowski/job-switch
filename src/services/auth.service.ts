import { supabaseClient } from '../db/supabase.client';
import type { AuthError, Session, User } from '@supabase/supabase-js';

export interface AuthResult {
  success: boolean;
  user?: User | null;
  session?: Session | null;
  error?: string;
}

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Login errors
  invalid_credentials: 'Nieprawidłowy email lub hasło',
  email_not_confirmed:
    'Email nie został potwierdzony. Sprawdź skrzynkę pocztową.',
  user_not_found: 'Użytkownik nie istnieje',

  // Registration errors
  user_already_exists: 'Konto z tym adresem email już istnieje',
  weak_password: 'Hasło jest zbyt słabe',
  invalid_email: 'Nieprawidłowy format adresu email',
  signup_disabled: 'Rejestracja jest obecnie wyłączona',

  // Password reset errors
  expired_token: 'Link do resetowania hasła wygasł. Poproś o nowy link.',
  invalid_token: 'Nieprawidłowy link do resetowania hasła.',
  same_password: 'Nowe hasło nie może być takie samo jak poprzednie.',
  session_not_found: 'Sesja wygasła. Poproś o nowy link do resetowania hasła.',

  // General errors
  too_many_requests: 'Zbyt wiele prób. Spróbuj ponownie za kilka minut.',
  rate_limit_exceeded: 'Zbyt wiele prób. Spróbuj ponownie za kilka minut.',
  network_error:
    'Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.',
  server_error: 'Wystąpił błąd serwera. Spróbuj ponownie później.',

  // Default
  unknown_error: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
};

export const mapAuthError = (error: AuthError): string => {
  // First check the error code property (most reliable)
  const errorCodeProperty = (
    error as unknown as { code?: string }
  ).code?.toLowerCase();
  if (errorCodeProperty) {
    for (const [key, message] of Object.entries(AUTH_ERROR_MESSAGES)) {
      if (errorCodeProperty.includes(key) || key.includes(errorCodeProperty)) {
        return message;
      }
    }
  }

  const errorMessage = error.message?.toLowerCase() ?? '';
  const errorCodeFromMessage = errorMessage.replace(/\s+/g, '_');

  // Check for specific error patterns in the message
  for (const [key, message] of Object.entries(AUTH_ERROR_MESSAGES)) {
    if (
      errorCodeFromMessage.includes(key) ||
      errorMessage.includes(key.replace(/_/g, ' ')) ||
      key.includes(errorCodeFromMessage)
    ) {
      return message;
    }
  }

  // Check for common Supabase error messages
  if (
    errorMessage.includes('invalid login credentials') ||
    errorMessage.includes('invalid_grant')
  ) {
    return AUTH_ERROR_MESSAGES.invalid_credentials;
  }

  if (errorMessage.includes('email not confirmed')) {
    return AUTH_ERROR_MESSAGES.email_not_confirmed;
  }

  if (
    errorMessage.includes('user already registered') ||
    errorMessage.includes('already exists')
  ) {
    return AUTH_ERROR_MESSAGES.user_already_exists;
  }

  // Check status code
  if (error.status === 429) {
    return AUTH_ERROR_MESSAGES.rate_limit_exceeded;
  }

  if (error.status === 400) {
    return AUTH_ERROR_MESSAGES.invalid_credentials;
  }

  if (error.status && error.status >= 500) {
    return AUTH_ERROR_MESSAGES.server_error;
  }

  return AUTH_ERROR_MESSAGES.unknown_error;
};

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: mapAuthError(error),
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch {
      return {
        success: false,
        error: AUTH_ERROR_MESSAGES.network_error,
      };
    }
  },

  async signUp(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: mapAuthError(error),
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch {
      return {
        success: false,
        error: AUTH_ERROR_MESSAGES.network_error,
      };
    }
  },

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        return {
          success: false,
          error: mapAuthError(error),
        };
      }

      return { success: true };
    } catch {
      return {
        success: false,
        error: AUTH_ERROR_MESSAGES.network_error,
      };
    }
  },

  async getSession(): Promise<{ session: Session | null; error?: string }> {
    try {
      const { data, error } = await supabaseClient.auth.getSession();

      if (error) {
        return {
          session: null,
          error: mapAuthError(error),
        };
      }

      return { session: data.session };
    } catch {
      return {
        session: null,
        error: AUTH_ERROR_MESSAGES.network_error,
      };
    }
  },

  async resetPasswordForEmail(
    email: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;

      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        return {
          success: false,
          error: mapAuthError(error),
        };
      }

      return { success: true };
    } catch {
      return {
        success: false,
        error: AUTH_ERROR_MESSAGES.network_error,
      };
    }
  },

  async updatePassword(
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabaseClient.auth.updateUser({
        password,
      });

      if (error) {
        return {
          success: false,
          error: mapAuthError(error),
        };
      }

      return { success: true };
    } catch {
      return {
        success: false,
        error: AUTH_ERROR_MESSAGES.network_error,
      };
    }
  },

  onAuthStateChange(callback: (session: Session | null) => void) {
    const { data } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        callback(session);
      }
    );

    return data.subscription;
  },
};
