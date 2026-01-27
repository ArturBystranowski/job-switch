import type { SxProps, Theme } from '@mui/material';

export const cardSx: SxProps<Theme> = {
  padding: { xs: '1.5rem', md: '2rem 4rem' },
  borderRadius: '1rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  width: '100%',
  margin: '0 auto',
};

export const questionTextSx: SxProps<Theme> = {
  fontSize: { xs: '1.25rem', md: '1.5rem' },
  fontWeight: 600,
  textAlign: 'center',
  marginBottom: '1.5rem',
  color: 'text.primary',
};

export const optionsContainerSx: SxProps<Theme> = {
  marginBottom: '2rem',
};

export const navigationContainerSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
};

export const navButtonSx: SxProps<Theme> = {
  minWidth: '7rem',
};
