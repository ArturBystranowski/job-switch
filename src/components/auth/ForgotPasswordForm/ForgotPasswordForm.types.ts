export interface ForgotPasswordFormData {
  email: string;
}

export interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  successMessage?: string | null;
}
