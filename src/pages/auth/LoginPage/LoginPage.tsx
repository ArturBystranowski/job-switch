import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthFormContainer, LoginForm } from '../../../components/auth';
import type { LoginFormData } from '../../../components/auth';
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

export const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectIfAuthenticated = async () => {
      if (!authLoading && isAuthenticated) {
        const redirectPath = await getRedirectPath();
        navigate(redirectPath);
      }
    };
    redirectIfAuthenticated();
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    const result = await signIn(data.email, data.password);

    if (result.success) {
      const redirectPath = await getRedirectPath();
      navigate(redirectPath);
    } else {
      setError(result.error ?? 'Wystąpił błąd podczas logowania');
    }

    setIsLoading(false);
  };

  if (authLoading) {
    return null;
  }

  return (
    <AuthFormContainer title="Zaloguj się">
      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
    </AuthFormContainer>
  );
};
