import { useState } from 'react';
import {
  Stack,
  TextField,
  Button,
  Link,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PasswordField } from '../PasswordField';
import {
  formSx,
  textFieldSx,
  submitButtonSx,
  forgotPasswordLinkSx,
  registerLinkContainerSx,
  alertSx,
} from './LoginForm.sx';
import type { LoginFormProps, LoginFormData } from './LoginForm.types';

interface FormErrors {
  email?: string;
  password?: string;
}

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email jest wymagany';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Nieprawidłowy format email';
  }
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Hasło jest wymagane';
  }
  return undefined;
};

export const LoginForm = ({
  onSubmit,
  isLoading = false,
  error,
}: LoginFormProps) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: keyof LoginFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const validateFn = field === 'email' ? validateEmail : validatePassword;
      setErrors((prev) => ({ ...prev, [field]: validateFn(value) }));
    }
  };

  const handleBlur = (field: keyof LoginFormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validateFn = field === 'email' ? validateEmail : validatePassword;
    setErrors((prev) => ({ ...prev, [field]: validateFn(formData[field]) }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });

    if (!emailError && !passwordError) {
      onSubmit(formData);
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={formSx}
      data-testid='login-form'
    >
      <Stack gap={2.5}>
        {error && (
          <Alert
            severity='error'
            sx={alertSx}
            data-testid='login-error-message'
          >
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          label='Email'
          type='email'
          value={formData.email}
          onChange={(e) => handleChange('email')(e.target.value)}
          onBlur={handleBlur('email')}
          error={touched.email && !!errors.email}
          helperText={touched.email && errors.email}
          disabled={isLoading}
          autoComplete='email'
          sx={textFieldSx}
          inputProps={{ 'data-testid': 'login-email-input' }}
        />
        <PasswordField
          label='Hasło'
          value={formData.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
          error={touched.password && !!errors.password}
          helperText={touched.password ? errors.password : undefined}
          disabled={isLoading}
          autoComplete='current-password'
          data-testid='login-password-input'
        />
        <Box sx={forgotPasswordLinkSx}>
          <Link
            component={RouterLink}
            to='/forgot-password'
            variant='body2'
            underline='hover'
          >
            Nie pamiętasz hasła?
          </Link>
        </Box>
        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          disabled={isLoading}
          sx={submitButtonSx}
          data-testid='login-submit-button'
        >
          {isLoading ? 'Logowanie...' : 'Zaloguj się'}
        </Button>
        <Box sx={registerLinkContainerSx}>
          <Typography variant='body2' color='text.secondary'>
            Nie masz konta?{' '}
            <Link component={RouterLink} to='/register' underline='hover'>
              Zarejestruj się
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
