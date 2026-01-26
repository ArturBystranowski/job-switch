import type { SxProps, Theme } from '@mui/material';

export const cardSx: SxProps<Theme> = {
  padding: '1rem',
  backgroundColor: 'primary.main',
  borderRadius: '0.5rem',
  color: 'primary.contrastText',
};

export const roleNameSx: SxProps<Theme> = {
  fontSize: '1.125rem',
  fontWeight: 600,
  marginBottom: '0.5rem',
};

export const justificationSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  opacity: 0.9,
  lineHeight: 1.5,
};
