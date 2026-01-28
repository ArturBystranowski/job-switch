import { useState, useEffect } from 'react';
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
  const [isValidSession, setIsValidSession] = useState(true);

  useEffect(() => {
    // Check if user has valid recovery session (Supabase creates session when clicking recovery link)
    if (!authLoading && !isAuthenticated) {
      setIsValidSession(false);
      setError('Link do resetowania hasła wygasł lub jest nieprawidłowy. Poproś o nowy link.');
    }
  }, [authLoading, isAuthenticated]);

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
      setSuccessMessage('Hasło zostało zmienione. Za chwilę zostaniesz przekierowany do logowania.');
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
    <AuthFormContainer title="Ustaw nowe hasło">
      <ResetPasswordForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        successMessage={successMessage}
        disabled={!isValidSession}
      />
    </AuthFormContainer>
  );
};
