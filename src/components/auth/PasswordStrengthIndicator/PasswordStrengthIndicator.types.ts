export interface PasswordStrengthIndicatorProps {
  password: string;
}

export type PasswordStrength = 'weak' | 'medium' | 'strong' | 'veryStrong';

export interface StrengthConfig {
  value: number;
  label: string;
  color: 'error' | 'warning' | 'success' | 'primary';
}
