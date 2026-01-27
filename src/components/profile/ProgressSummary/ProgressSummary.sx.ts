import type { SxProps, Theme } from '@mui/material';

export const containerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
};

export const progressBoxSx: SxProps<Theme> = {
  position: 'relative',
  display: 'inline-flex',
};

export const progressTextSx: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '1.25rem',
  fontWeight: 700,
  color: 'primary.main',
};

export const infoSx: SxProps<Theme> = {
  // flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

export const labelSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
  marginBottom: '0.25rem',
};

export const valueSx: SxProps<Theme> = {
  fontSize: '1rem',
  fontWeight: 600,
  color: 'text.primary',
};

export const linkButtonSx: SxProps<Theme> = {
  marginTop: '0.5rem',
};
