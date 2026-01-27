import type { SxProps, Theme } from '@mui/material';

export const pageContainerSx: SxProps<Theme> = {
  minHeight: '100vh',
  backgroundColor: 'grey.100',
  padding: { xs: '1rem', md: '2rem' },
};

export const contentContainerSx: SxProps<Theme> = {
  maxWidth: '36rem',
  margin: '0 auto',
  paddingTop: { xs: '2rem', md: '4rem' },
};

export const headerSx: SxProps<Theme> = {
  textAlign: 'center',
  marginBottom: '2rem',
};

export const titleSx: SxProps<Theme> = {
  fontSize: { xs: '1.5rem', md: '2rem' },
  fontWeight: 700,
  marginBottom: '0.5rem',
};

export const subtitleSx: SxProps<Theme> = {
  fontSize: '1rem',
  color: 'text.secondary',
};

export const uploadSectionSx: SxProps<Theme> = {
  marginBottom: '2rem',
};

export const previewSectionSx: SxProps<Theme> = {
  marginBottom: '2rem',
};

export const actionsSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
};

export const nextButtonSx: SxProps<Theme> = {
  minWidth: '12rem',
};

export const skipButtonSx: SxProps<Theme> = {
  color: 'text.secondary',
  '&:hover': {
    backgroundColor: 'transparent',
    textDecoration: 'underline',
  },
};
