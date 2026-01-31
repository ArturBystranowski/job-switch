import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthFormContainer, ResetPasswordForm } from '../../../components/auth';
import type { ResetPasswordFormData } from '../../../components/auth';
import { useAuth } from '../../../hooks';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { updatePassword, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Derive session validity directly from auth state (avoids useEffect setState)
  const isValidSession = authLoading || isAuthenticated;
  const sessionError =
    !authLoading && !isAuthenticated
      ? 'Link do resetowania hasła wygasł lub jest nieprawidłowy. Poproś o nowy link.'
      : null;

  const handleSubmit = async (data: ResetPasswordFormData) => {
    if (!isAuthenticated) {
      setError('Sesja wygasła. Poproś o nowy link do resetowania hasła.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const result = await updatePassword(data.password);

    if (result.success) {
      setSuccessMessage(
        'Hasło zostało zmienione. Za chwilę zostaniesz przekierowany do logowania.'
      );
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error ?? 'Wystąpił błąd podczas zmiany hasła.');
    }

    setIsLoading(false);
  };

  if (authLoading) {
    return null;
  }

  return (
    <AuthFormContainer title='Ustaw nowe hasło'>
      <ResetPasswordForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error ?? sessionError}
        successMessage={successMessage}
        disabled={!isValidSession}
      />
    </AuthFormContainer>
  );
};
