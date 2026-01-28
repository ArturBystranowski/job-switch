import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validateLoginPassword,
  validatePassword,
  validateConfirmPassword,
} from '../validation';

describe('Validation Functions', () => {
  describe('validateEmail', () => {
    describe('Valid emails', () => {
      it('accepts standard email format', () => {
        const result = validateEmail('user@example.com');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('accepts email with subdomain', () => {
        const result = validateEmail('user@mail.example.com');
        expect(result.isValid).toBe(true);
      });

      it('accepts email with plus sign', () => {
        const result = validateEmail('user+tag@example.com');
        expect(result.isValid).toBe(true);
      });

      it('accepts email with dots in local part', () => {
        const result = validateEmail('user.name@example.com');
        expect(result.isValid).toBe(true);
      });

      it('accepts email with numbers', () => {
        const result = validateEmail('user123@example123.com');
        expect(result.isValid).toBe(true);
      });

      it('accepts email with hyphens in domain', () => {
        const result = validateEmail('user@example-domain.com');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Invalid emails', () => {
      it('rejects empty email', () => {
        const result = validateEmail('');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Email jest wymagany');
      });

      it('rejects whitespace-only email', () => {
        const result = validateEmail('   ');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Email jest wymagany');
      });

      it('rejects email without @', () => {
        const result = validateEmail('userexample.com');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Nieprawidłowy format email');
      });

      it('rejects email without domain', () => {
        const result = validateEmail('user@');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Nieprawidłowy format email');
      });

      it('rejects email without local part', () => {
        const result = validateEmail('@example.com');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Nieprawidłowy format email');
      });

      it('rejects email without TLD', () => {
        const result = validateEmail('user@example');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Nieprawidłowy format email');
      });

      it('rejects email with spaces', () => {
        const result = validateEmail('user @example.com');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Nieprawidłowy format email');
      });

      it('rejects email with multiple @', () => {
        const result = validateEmail('user@@example.com');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Nieprawidłowy format email');
      });

      it('rejects plain text', () => {
        const result = validateEmail('notanemail');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Nieprawidłowy format email');
      });
    });
  });

  describe('validateLoginPassword', () => {
    it('accepts any non-empty password', () => {
      const result = validateLoginPassword('password');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('accepts short password for login', () => {
      const result = validateLoginPassword('a');
      expect(result.isValid).toBe(true);
    });

    it('accepts password with only numbers', () => {
      const result = validateLoginPassword('123456');
      expect(result.isValid).toBe(true);
    });

    it('rejects empty password', () => {
      const result = validateLoginPassword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Hasło jest wymagane');
    });
  });

  describe('validatePassword (registration)', () => {
    describe('Valid passwords', () => {
      it('accepts password meeting all requirements', () => {
        const result = validatePassword('Password1');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('accepts password with special characters', () => {
        const result = validatePassword('Password1!@#');
        expect(result.isValid).toBe(true);
      });

      it('accepts long password', () => {
        const result = validatePassword('VeryLongPassword123');
        expect(result.isValid).toBe(true);
      });

      it('accepts password with multiple uppercase letters', () => {
        const result = validatePassword('PASSWORD123');
        expect(result.isValid).toBe(true);
      });

      it('accepts password with multiple digits', () => {
        const result = validatePassword('Password12345');
        expect(result.isValid).toBe(true);
      });

      it('accepts minimum valid password (8 chars, 1 uppercase, 1 digit)', () => {
        const result = validatePassword('Passwor1');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Invalid passwords', () => {
      it('rejects empty password', () => {
        const result = validatePassword('');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Hasło jest wymagane');
      });

      it('rejects password shorter than 8 characters', () => {
        const result = validatePassword('Pass1');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Hasło musi mieć minimum 8 znaków');
      });

      it('rejects 7-character password', () => {
        const result = validatePassword('Passwo1');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Hasło musi mieć minimum 8 znaków');
      });

      it('rejects password without uppercase letter', () => {
        const result = validatePassword('password123');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Hasło musi zawierać przynajmniej jedną wielką literę');
      });

      it('rejects password without digit', () => {
        const result = validatePassword('Password');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Hasło musi zawierać przynajmniej jedną cyfrę');
      });

      it('rejects password with only lowercase letters (8 chars)', () => {
        const result = validatePassword('password');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Hasło musi zawierać przynajmniej jedną wielką literę');
      });

      it('rejects password with only numbers', () => {
        const result = validatePassword('12345678');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Hasło musi zawierać przynajmniej jedną wielką literę');
      });

      it('rejects password with lowercase and digits but no uppercase', () => {
        const result = validatePassword('password123');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Hasło musi zawierać przynajmniej jedną wielką literę');
      });
    });

    describe('Error priority', () => {
      it('checks required first', () => {
        const result = validatePassword('');
        expect(result.error).toBe('Hasło jest wymagane');
      });

      it('checks length before uppercase', () => {
        const result = validatePassword('short');
        expect(result.error).toBe('Hasło musi mieć minimum 8 znaków');
      });

      it('checks uppercase before digit', () => {
        const result = validatePassword('lowercase1');
        expect(result.error).toBe('Hasło musi zawierać przynajmniej jedną wielką literę');
      });
    });
  });

  describe('validateConfirmPassword', () => {
    it('accepts matching passwords', () => {
      const result = validateConfirmPassword('Password1', 'Password1');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('accepts matching complex passwords', () => {
      const result = validateConfirmPassword('P@ssw0rd!123', 'P@ssw0rd!123');
      expect(result.isValid).toBe(true);
    });

    it('rejects empty confirm password', () => {
      const result = validateConfirmPassword('Password1', '');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Potwierdzenie hasła jest wymagane');
    });

    it('rejects non-matching passwords', () => {
      const result = validateConfirmPassword('Password1', 'Password2');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Hasła muszą być identyczne');
    });

    it('rejects passwords differing by case', () => {
      const result = validateConfirmPassword('Password1', 'password1');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Hasła muszą być identyczne');
    });

    it('rejects passwords differing by whitespace', () => {
      const result = validateConfirmPassword('Password1', 'Password1 ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Hasła muszą być identyczne');
    });

    it('checks required before matching (empty confirm password)', () => {
      const result = validateConfirmPassword('Password1', '');
      expect(result.error).toBe('Potwierdzenie hasła jest wymagane');
    });

    it('accepts both empty passwords as matching (empty check first)', () => {
      const result = validateConfirmPassword('', '');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Potwierdzenie hasła jest wymagane');
    });
  });
});
