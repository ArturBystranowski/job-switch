import { describe, it, expect } from 'vitest';
import type { AuthError } from '@supabase/supabase-js';
import { mapAuthError, AUTH_ERROR_MESSAGES } from '../auth.service';

/**
 * Helper to create mock AuthError objects
 */
const createAuthError = (
  message: string,
  status?: number,
  code?: string
): AuthError => {
  const error = {
    name: 'AuthError',
    message,
    status: status ?? 400,
  } as AuthError;

  if (code) {
    (error as unknown as { code: string }).code = code;
  }

  return error;
};

describe('Auth Error Mapping', () => {
  describe('mapAuthError', () => {
    describe('Login Errors', () => {
      it('maps invalid_credentials error correctly', () => {
        const error = createAuthError('Invalid login credentials', 400, 'invalid_credentials');
        expect(mapAuthError(error)).toBe('Nieprawidłowy email lub hasło');
      });

      it('maps email_not_confirmed error correctly', () => {
        const error = createAuthError('Email not confirmed', 400, 'email_not_confirmed');
        expect(mapAuthError(error)).toBe(
          'Email nie został potwierdzony. Sprawdź skrzynkę pocztową.'
        );
      });

      it('maps user_not_found error correctly', () => {
        const error = createAuthError('User not found', 400, 'user_not_found');
        expect(mapAuthError(error)).toBe('Użytkownik nie istnieje');
      });

      it('maps "Invalid login credentials" message without code', () => {
        const error = createAuthError('Invalid login credentials');
        expect(mapAuthError(error)).toBe('Nieprawidłowy email lub hasło');
      });

      it('maps "invalid_grant" in message to invalid_credentials', () => {
        const error = createAuthError('invalid_grant: Invalid login credentials');
        expect(mapAuthError(error)).toBe('Nieprawidłowy email lub hasło');
      });
    });

    describe('Registration Errors', () => {
      it('maps user_already_exists error correctly', () => {
        const error = createAuthError('User already registered', 400, 'user_already_exists');
        expect(mapAuthError(error)).toBe('Konto z tym adresem email już istnieje');
      });

      it('maps weak_password error correctly', () => {
        const error = createAuthError('Password is too weak', 400, 'weak_password');
        expect(mapAuthError(error)).toBe('Hasło jest zbyt słabe');
      });

      it('maps invalid_email error correctly', () => {
        const error = createAuthError('Invalid email format', 400, 'invalid_email');
        expect(mapAuthError(error)).toBe('Nieprawidłowy format adresu email');
      });

      it('maps signup_disabled error correctly', () => {
        const error = createAuthError('Signups not allowed', 400, 'signup_disabled');
        expect(mapAuthError(error)).toBe('Rejestracja jest obecnie wyłączona');
      });

      it('maps "User already registered" message without code', () => {
        const error = createAuthError('User already registered');
        expect(mapAuthError(error)).toBe('Konto z tym adresem email już istnieje');
      });

      it('maps "already exists" in message', () => {
        const error = createAuthError('A user with this email already exists');
        expect(mapAuthError(error)).toBe('Konto z tym adresem email już istnieje');
      });
    });

    describe('Password Reset Errors', () => {
      it('maps expired_token error correctly', () => {
        const error = createAuthError('Token has expired', 400, 'expired_token');
        expect(mapAuthError(error)).toBe(
          'Link do resetowania hasła wygasł. Poproś o nowy link.'
        );
      });

      it('maps invalid_token error correctly', () => {
        const error = createAuthError('Invalid token', 400, 'invalid_token');
        expect(mapAuthError(error)).toBe('Nieprawidłowy link do resetowania hasła.');
      });

      it('maps same_password error correctly', () => {
        const error = createAuthError('Cannot use same password', 400, 'same_password');
        expect(mapAuthError(error)).toBe('Nowe hasło nie może być takie samo jak poprzednie.');
      });

      it('maps session_not_found error correctly', () => {
        const error = createAuthError('Session not found', 400, 'session_not_found');
        expect(mapAuthError(error)).toBe(
          'Sesja wygasła. Poproś o nowy link do resetowania hasła.'
        );
      });
    });

    describe('Rate Limiting and General Errors', () => {
      it('maps too_many_requests error correctly', () => {
        const error = createAuthError('Too many requests', 429, 'too_many_requests');
        expect(mapAuthError(error)).toBe('Zbyt wiele prób. Spróbuj ponownie za kilka minut.');
      });

      it('maps rate_limit_exceeded error correctly', () => {
        const error = createAuthError('Rate limit exceeded', 429, 'rate_limit_exceeded');
        expect(mapAuthError(error)).toBe('Zbyt wiele prób. Spróbuj ponownie za kilka minut.');
      });

      it('maps 429 status code to rate limit message', () => {
        const error = createAuthError('Too many requests', 429);
        expect(mapAuthError(error)).toBe('Zbyt wiele prób. Spróbuj ponownie za kilka minut.');
      });

      it('maps server_error correctly', () => {
        const error = createAuthError('Internal server error', 500, 'server_error');
        expect(mapAuthError(error)).toBe('Wystąpił błąd serwera. Spróbuj ponownie później.');
      });

      it('maps 500 status code to server error message', () => {
        const error = createAuthError('Internal server error', 500);
        expect(mapAuthError(error)).toBe('Wystąpił błąd serwera. Spróbuj ponownie później.');
      });

      it('maps 502 status code to server error message', () => {
        const error = createAuthError('Bad gateway', 502);
        expect(mapAuthError(error)).toBe('Wystąpił błąd serwera. Spróbuj ponownie później.');
      });

      it('maps 503 status code to server error message', () => {
        const error = createAuthError('Service unavailable', 503);
        expect(mapAuthError(error)).toBe('Wystąpił błąd serwera. Spróbuj ponownie później.');
      });
    });

    describe('Unknown Errors', () => {
      it('maps unknown error code to default message', () => {
        const error = createAuthError('Some unknown error', 400, 'unknown_error_code');
        expect(mapAuthError(error)).toBe('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
      });

      it('maps error without code or matching message to default (non-400 status)', () => {
        const error = createAuthError('Something went wrong', 422);
        expect(mapAuthError(error)).toBe('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
      });

      it('maps 400 status without specific code to invalid_credentials', () => {
        const error = createAuthError('Bad request', 400);
        expect(mapAuthError(error)).toBe('Nieprawidłowy email lub hasło');
      });
    });

    describe('Case Insensitivity', () => {
      it('handles uppercase error code', () => {
        const error = createAuthError('Invalid credentials', 400, 'INVALID_CREDENTIALS');
        expect(mapAuthError(error)).toBe('Nieprawidłowy email lub hasło');
      });

      it('handles mixed case error message', () => {
        const error = createAuthError('Email Not Confirmed');
        expect(mapAuthError(error)).toBe(
          'Email nie został potwierdzony. Sprawdź skrzynkę pocztową.'
        );
      });
    });
  });

  describe('AUTH_ERROR_MESSAGES constant', () => {
    it('contains all required error keys', () => {
      const expectedKeys = [
        'invalid_credentials',
        'email_not_confirmed',
        'user_not_found',
        'user_already_exists',
        'weak_password',
        'invalid_email',
        'signup_disabled',
        'expired_token',
        'invalid_token',
        'same_password',
        'session_not_found',
        'too_many_requests',
        'rate_limit_exceeded',
        'network_error',
        'server_error',
        'unknown_error',
      ];

      expectedKeys.forEach((key) => {
        expect(AUTH_ERROR_MESSAGES).toHaveProperty(key);
      });
    });

    it('all messages are non-empty strings in Polish', () => {
      Object.values(AUTH_ERROR_MESSAGES).forEach((message) => {
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
        // Polish characters check (at least one Polish-specific letter)
        expect(
          message.includes('ą') ||
            message.includes('ę') ||
            message.includes('ó') ||
            message.includes('ś') ||
            message.includes('ł') ||
            message.includes('ż') ||
            message.includes('ź') ||
            message.includes('ć') ||
            message.includes('ń') ||
            message.includes('Ą') ||
            message.includes('Ę') ||
            message.includes('Ó') ||
            message.includes('Ś') ||
            message.includes('Ł') ||
            message.includes('Ż') ||
            message.includes('Ź') ||
            message.includes('Ć') ||
            message.includes('Ń')
        ).toBe(true);
      });
    });
  });
});
