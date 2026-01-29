export interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  autoComplete?: string;
  placeholder?: string;
  'data-testid'?: string;
}
