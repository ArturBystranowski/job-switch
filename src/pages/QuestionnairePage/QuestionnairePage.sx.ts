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

export const stepperWrapperSx: SxProps<Theme> = {
  marginBottom: '2rem',
};

export const questionWrapperSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  minHeight: 'calc(100vh - 12rem)',
  paddingTop: '2rem',
};

export const errorContainerSx: SxProps<Theme> = {
  maxWidth: '32rem',
  margin: '0 auto',
  padding: '2rem',
};
