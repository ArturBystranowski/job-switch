import { useState } from 'react';
import { AuthFormContainer, ForgotPasswordForm } from '../../../components/auth';
import type { ForgotPasswordFormData } from '../../../components/auth';
import { useAuth } from '../../../hooks';

export const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const result = await resetPassword(data.email);

    if (result.success) {
      setSuccessMessage('Link do resetowania hasła został wysłany na podany adres email.');
    } else {
      setError(result.error ?? 'Wystąpił błąd podczas wysyłania linku.');
    }

    setIsLoading(false);
  };

  return (
    <AuthFormContainer
      title="Odzyskaj hasło"
      subtitle="Podaj adres email powiązany z Twoim kontem. Wyślemy Ci link do resetowania hasła."
    >
      <ForgotPasswordForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        successMessage={successMessage}
      />
    </AuthFormContainer>
  );
};
