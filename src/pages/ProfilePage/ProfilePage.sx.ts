import type { SxProps, Theme } from '@mui/material';

export const pageContainerSx: SxProps<Theme> = {
  minHeight: '100vh',
  backgroundColor: 'grey.100',
  padding: { xs: '1rem', md: '2rem' },
};

export const contentContainerSx: SxProps<Theme> = {
  maxWidth: '48rem',
  margin: '0 auto',
};

export const headerSx: SxProps<Theme> = {
  marginBottom: '2rem',
};

export const titleSx: SxProps<Theme> = {
  fontSize: { xs: '1.5rem', md: '2rem' },
  fontWeight: 700,
  marginBottom: '0.5rem',
};

export const readOnlyNoticeSx: SxProps<Theme> = {
  backgroundColor: 'grey.200',
  borderRadius: '0.5rem',
  padding: '0.75rem 1rem',
  marginTop: '1rem',
};

export const readOnlyTextSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
};

export const sectionsContainerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

export const cvInfoSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

export const cvIconSx: SxProps<Theme> = {
  color: 'error.main',
  fontSize: '2rem',
};

export const cvTextSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
};

export const cvDateSx: SxProps<Theme> = {
  fontSize: '1rem',
  fontWeight: 500,
};

export const errorContainerSx: SxProps<Theme> = {
  maxWidth: '32rem',
  margin: '0 auto',
  padding: '2rem',
};
