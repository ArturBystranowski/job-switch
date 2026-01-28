import { useState } from 'react';
import { Stack, Button, Link, Alert, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PasswordField } from '../PasswordField';
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator';
import {
  formSx,
  submitButtonSx,
  loginLinkContainerSx,
  alertSx,
} from './ResetPasswordForm.sx';
import type { ResetPasswordFormProps, ResetPasswordFormData } from './ResetPasswordForm.types';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

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

const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) {
    return 'Potwierdzenie hasła jest wymagane';
  }
  if (password !== confirmPassword) {
    return 'Hasła muszą być identyczne';
  }
  return undefined;
};

export const ResetPasswordForm = ({
  onSubmit,
  isLoading = false,
  error,
  successMessage,
  disabled = false,
}: ResetPasswordFormProps) => {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: keyof ResetPasswordFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      let error: string | undefined;
      if (field === 'password') {
        error = validatePassword(value);
        if (touched.confirmPassword && formData.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            password: error,
            confirmPassword: validateConfirmPassword(value, formData.confirmPassword),
          }));
          return;
        }
      } else if (field === 'confirmPassword') {
        error = validateConfirmPassword(formData.password, value);
      }
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof ResetPasswordFormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let error: string | undefined;
    if (field === 'password') {
      error = validatePassword(formData.password);
    } else if (field === 'confirmPassword') {
      error = validateConfirmPassword(formData.password, formData.confirmPassword);
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });
    setTouched({ password: true, confirmPassword: true });

    if (!passwordError && !confirmPasswordError) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={formSx}>
      <Stack gap={2.5}>
        {error && (
          <Alert severity="error" sx={alertSx}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={alertSx}>
            {successMessage}
          </Alert>
        )}
        <Stack gap={1}>
          <PasswordField
            label="Nowe hasło"
            value={formData.password}
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            error={touched.password && !!errors.password}
            helperText={touched.password ? errors.password : undefined}
            disabled={isLoading || !!successMessage || disabled}
            autoComplete="new-password"
          />
          <PasswordStrengthIndicator password={formData.password} />
        </Stack>
        <PasswordField
          label="Potwierdź nowe hasło"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          error={touched.confirmPassword && !!errors.confirmPassword}
          helperText={touched.confirmPassword ? errors.confirmPassword : undefined}
          disabled={isLoading || !!successMessage || disabled}
          autoComplete="new-password"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading || !!successMessage || disabled}
          sx={submitButtonSx}
        >
          {isLoading ? 'Zapisywanie...' : 'Zapisz nowe hasło'}
        </Button>
        {successMessage && (
          <Box sx={loginLinkContainerSx}>
            <Link component={RouterLink} to="/login" underline="hover">
              Przejdź do logowania
            </Link>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
