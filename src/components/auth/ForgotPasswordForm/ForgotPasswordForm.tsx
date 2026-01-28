import { useState } from 'react';
import { Stack, TextField, Button, Link, Alert, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  formSx,
  textFieldSx,
  submitButtonSx,
  backLinkContainerSx,
  alertSx,
} from './ForgotPasswordForm.sx';
import type { ForgotPasswordFormProps, ForgotPasswordFormData } from './ForgotPasswordForm.types';

interface FormErrors {
  email?: string;
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

export const ForgotPasswordForm = ({
  onSubmit,
  isLoading = false,
  error,
  successMessage,
}: ForgotPasswordFormProps) => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (value: string) => {
    setFormData({ email: value });
    if (touched.email) {
      setErrors({ email: validateEmail(value) });
    }
  };

  const handleBlur = () => {
    setTouched({ email: true });
    setErrors({ email: validateEmail(formData.email) });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const emailError = validateEmail(formData.email);
    setErrors({ email: emailError });
    setTouched({ email: true });

    if (!emailError) {
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
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          error={touched.email && !!errors.email}
          helperText={touched.email && errors.email}
          disabled={isLoading || !!successMessage}
          autoComplete="email"
          sx={textFieldSx}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading || !!successMessage}
          sx={submitButtonSx}
        >
          {isLoading ? 'Wysyłanie...' : 'Wyślij link'}
        </Button>
        <Box sx={backLinkContainerSx}>
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
          >
            <ArrowBackIcon fontSize="small" />
            Wróć do logowania
          </Link>
        </Box>
      </Stack>
    </Box>
  );
};
