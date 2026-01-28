export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  successMessage?: string | null;
  disabled?: boolean;
}
