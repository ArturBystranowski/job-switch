/**
 * Validation utility functions for forms
 */

/**
 * Email validation result
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Email regex pattern for validation
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates email format
 * @param email - Email to validate
 * @returns Validation result with error message if invalid
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email jest wymagany' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Nieprawidłowy format email' };
  }
  return { isValid: true };
};

/**
 * Validates password for login (simple required check)
 * @param password - Password to validate
 * @returns Validation result with error message if invalid
 */
export const validateLoginPassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Hasło jest wymagane' };
  }
  return { isValid: true };
};

/**
 * Validates password for registration (with strength requirements)
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one digit
 *
 * @param password - Password to validate
 * @returns Validation result with error message if invalid
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Hasło jest wymagane' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Hasło musi mieć minimum 8 znaków' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Hasło musi zawierać przynajmniej jedną wielką literę' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Hasło musi zawierać przynajmniej jedną cyfrę' };
  }
  return { isValid: true };
};

/**
 * Validates password confirmation matches password
 * @param password - Original password
 * @param confirmPassword - Confirmation password to validate
 * @returns Validation result with error message if invalid
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Potwierdzenie hasła jest wymagane' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Hasła muszą być identyczne' };
  }
  return { isValid: true };
};
