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
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator';
import {
  formSx,
  textFieldSx,
  submitButtonSx,
  loginLinkContainerSx,
  alertSx,
} from './RegisterForm.sx';
import type { RegisterFormProps, RegisterFormData } from './RegisterForm.types';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
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
  if (password.length < 8) {
    return 'Hasło musi mieć minimum 8 znaków';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Hasło musi zawierać przynajmniej jedną wielką literę';
  }
  if (!/[0-9]/.test(password)) {
    return 'Hasło musi zawierać przynajmniej jedną cyfrę';
  }
  return undefined;
};

const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | undefined => {
  if (!confirmPassword) {
    return 'Potwierdzenie hasła jest wymagane';
  }
  if (password !== confirmPassword) {
    return 'Hasła muszą być identyczne';
  }
  return undefined;
};

export const RegisterForm = ({
  onSubmit,
  isLoading = false,
  error,
}: RegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: keyof RegisterFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      let error: string | undefined;
      if (field === 'email') {
        error = validateEmail(value);
      } else if (field === 'password') {
        error = validatePassword(value);
        if (touched.confirmPassword && formData.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            password: error,
            confirmPassword: validateConfirmPassword(
              value,
              formData.confirmPassword
            ),
          }));
          return;
        }
      } else if (field === 'confirmPassword') {
        error = validateConfirmPassword(formData.password, value);
      }
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof RegisterFormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let error: string | undefined;
    if (field === 'email') {
      error = validateEmail(formData.email);
    } else if (field === 'password') {
      error = validatePassword(formData.password);
    } else if (field === 'confirmPassword') {
      error = validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      );
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    setErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });
    setTouched({ email: true, password: true, confirmPassword: true });

    if (!emailError && !passwordError && !confirmPasswordError) {
      onSubmit(formData);
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={formSx}
      data-testid='register-form'
    >
      <Stack gap={2.5}>
        {error && (
          <Alert
            severity='error'
            sx={alertSx}
            data-testid='register-error-message'
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
          inputProps={{ 'data-testid': 'register-email-input' }}
        />
        <Stack gap={1}>
          <PasswordField
            label='Hasło'
            value={formData.password}
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            error={touched.password && !!errors.password}
            helperText={touched.password ? errors.password : undefined}
            disabled={isLoading}
            autoComplete='new-password'
            data-testid='register-password-input'
          />
          <PasswordStrengthIndicator password={formData.password} />
        </Stack>
        <PasswordField
          label='Potwierdź hasło'
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          error={touched.confirmPassword && !!errors.confirmPassword}
          helperText={
            touched.confirmPassword ? errors.confirmPassword : undefined
          }
          disabled={isLoading}
          autoComplete='new-password'
          data-testid='register-confirm-password-input'
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          disabled={isLoading}
          sx={submitButtonSx}
          data-testid='register-submit-button'
        >
          {isLoading ? 'Rejestracja...' : 'Zarejestruj się'}
        </Button>
        <Box sx={loginLinkContainerSx}>
          <Typography variant='body2' color='text.secondary'>
            Masz już konto?{' '}
            <Link component={RouterLink} to='/login' underline='hover'>
              Zaloguj się
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
