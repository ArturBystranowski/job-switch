import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box } from '@mui/material';
import { AuthFormContainer, RegisterForm } from '../../../components/auth';
import type { RegisterFormData } from '../../../components/auth';
import { useAuth } from '../../../hooks';
import { profilesApi } from '../../../api/profiles.api';

const getRedirectPath = async (): Promise<string> => {
  try {
    const profile = await profilesApi.getProfile();
    return profile?.selected_role_id ? '/roadmap' : '/';
  } catch {
    return '/';
  }
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { signUp, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const redirectIfAuthenticated = async () => {
      if (!authLoading && isAuthenticated) {
        const redirectPath = await getRedirectPath();
        navigate(redirectPath);
      }
    };
    redirectIfAuthenticated();
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const result = await signUp(data.email, data.password);

    if (result.success) {
      if (result.session) {
        const redirectPath = await getRedirectPath();
        navigate(redirectPath);
      } else {
        setSuccessMessage('Konto zostało utworzone. Sprawdź email, aby potwierdzić rejestrację.');
      }
    } else {
      setError(result.error ?? 'Wystąpił błąd podczas rejestracji');
    }

    setIsLoading(false);
  };

  if (authLoading) {
    return null;
  }

  return (
    <AuthFormContainer title="Utwórz konto w JobSwitch">
      {successMessage ? (
        <Box>
          <Alert severity="success" sx={{ borderRadius: '0.5rem' }}>
            {successMessage}
          </Alert>
        </Box>
      ) : (
        <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      )}
    </AuthFormContainer>
  );
};
