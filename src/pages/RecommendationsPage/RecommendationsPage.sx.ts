import type { SxProps, Theme } from '@mui/material';

export const pageContainerSx: SxProps<Theme> = {
  minHeight: '100vh',
  backgroundColor: 'grey.100',
  padding: { xs: '1rem', md: '2rem' },
};

export const contentContainerSx: SxProps<Theme> = {
  maxWidth: '56rem',
  margin: '0 auto',
  paddingTop: { xs: '1rem', md: '2rem' },
};

export const headerSx: SxProps<Theme> = {
  textAlign: 'center',
  marginBottom: { xs: '2rem', md: '3rem' },
};

export const titleSx: SxProps<Theme> = {
  fontSize: { xs: '1.5rem', md: '2rem' },
  fontWeight: 700,
  marginBottom: '0.5rem',
  color: 'text.primary',
};

export const subtitleSx: SxProps<Theme> = {
  fontSize: '1rem',
  color: 'text.secondary',
};

export const cardsContainerSx: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
  gap: '1.5rem',
};

export const loadingContainerSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
};

export const errorContainerSx: SxProps<Theme> = {
  maxWidth: '32rem',
  margin: '0 auto',
  padding: '2rem',
};

export const generateContainerSx: SxProps<Theme> = {
  textAlign: 'center',
  padding: '3rem 2rem',
  backgroundColor: 'background.paper',
  borderRadius: '1rem',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

export const generateTitleSx: SxProps<Theme> = {
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: '1rem',
};

export const generateDescriptionSx: SxProps<Theme> = {
  fontSize: '0.9375rem',
  color: 'text.secondary',
  marginBottom: '1.5rem',
};
