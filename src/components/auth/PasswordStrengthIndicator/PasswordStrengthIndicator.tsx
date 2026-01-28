import { Stack, LinearProgress, Typography } from '@mui/material';
import { containerSx, progressSx, labelSx } from './PasswordStrengthIndicator.sx';
import type {
  PasswordStrengthIndicatorProps,
  PasswordStrength,
  StrengthConfig,
} from './PasswordStrengthIndicator.types';

const STRENGTH_CONFIG: Record<PasswordStrength, StrengthConfig> = {
  weak: { value: 25, label: 'Słabe', color: 'error' },
  medium: { value: 50, label: 'Średnie', color: 'warning' },
  strong: { value: 75, label: 'Silne', color: 'success' },
  veryStrong: { value: 100, label: 'Bardzo silne', color: 'primary' },
};

const calculateStrength = (password: string): PasswordStrength => {
  if (password.length < 8) {
    return 'weak';
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const isLongEnough = password.length >= 12;

  if (isLongEnough && hasUppercase && hasDigit && hasSpecialChar) {
    return 'veryStrong';
  }

  if (hasUppercase && hasDigit) {
    return 'strong';
  }

  if (hasUppercase || hasDigit) {
    return 'medium';
  }

  return 'weak';
};

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  if (!password) {
    return null;
  }

  const strength = calculateStrength(password);
  const config = STRENGTH_CONFIG[strength];

  return (
    <Stack sx={containerSx} gap={0.5}>
      <LinearProgress
        variant="determinate"
        value={config.value}
        color={config.color}
        sx={progressSx}
      />
      <Typography variant="body2" color={`${config.color}.main`} sx={labelSx}>
        Siła hasła: {config.label}
      </Typography>
    </Stack>
  );
};
